import { generateCodeClass } from "../utils/generateCodeClass";
import { courseSchema } from "../schemas/course.schema";
import type { Request, Response } from "express";
import prisma from "../lib/db";
import { setCommonHeaders } from "../utils/setHeaders";
import { courseUsersSchema } from "../schemas/course_user.schema";
import { google } from "googleapis";

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  setCommonHeaders(res);
  try {

    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      res.status(401).json({ error: "Token no encontrado" });
    }

    const data = req.body;

    // Generar automáticamente el campo code_class
    const code_class = generateCodeClass();

    // Validar los datos con el esquema de Zod
    const validatedData = courseSchema.parse({
      ...data,
      code_class, // Añadir el campo generado al objeto validado
    });

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken || "" }); // Requiere el token del usuario

    const drive = google.drive({ version: "v3", auth });

    const creator = await prisma.user.findFirst({
      where: { id: data.creator_id }
    })

    if (!creator) {
      res.send(404).json({ message: "User not found" })
    }
    const folderId = creator?.folder_id || ""
    // 2. Crear subcarpeta para el curso
    const courseFolder = await drive.files.create({
      requestBody: {
        name: validatedData.course_name,
        mimeType: "application/vnd.google-apps.folder",
        parents: [folderId],
      },
      fields: "id",
    });

    const courseFolderId = courseFolder.data.id || "";

    // 3. Crear el curso en la base de datos
    const newCourse = await prisma.course.create({
      data: {
        code_class,
        course_name: validatedData.course_name,
        description: validatedData.description,
        section: validatedData.section,
        subject: validatedData.subject,
        creator_id: validatedData.creator_id,
      },
    });

    // 4. Crear registro en course_users con folder_id
    await prisma.course_users.create({
      data: {
        id_course: newCourse.id,
        id_user: newCourse.creator_id,
        role: "teacher",
        folder_id: courseFolderId, // Guardar el folder_id en la tabla
      },
    });

    res.status(201).json(newCourse);
    return;
  } catch (error: any) {
    console.error("Error creating course:", error);
    res.status(500).json({
      message: error?.message || "Ocurrió un error",
    });
  }
};
export const getCourses = async (req: Request, res: Response) => {
  setCommonHeaders(res);

  try {
    //course?id_user=2
    const { id_user: creator_id } = req.query;

    if (!creator_id || typeof creator_id !== "string") {
      res.status(400).json({ error: "El id del usuario es obligatorio y debe ser válido." });
      return;
    }

    // Buscar todos los cursos donde el usuario esté inscrito
    const userCourses = await prisma.course_users.findMany({
      where: { id_user: parseInt(creator_id) },
      select: {
        id_course: true,
        role: true,
      },
    });


    // Obtener los ids de los cursos
    const courseIds = userCourses.map((userCourse) => userCourse.id_course);

    // Buscar los detalles de los cursos
    const courses = await prisma.course.findMany({
      where: {
        id: { in: courseIds },
      },
      include: {
        creator: true
      }
    });
    // Combinar los cursos con los roles del usuario
    const response = courses.map((course) => {
      const userCourse = userCourses.find((uc) => uc.id_course === course.id);
      return {
        ...course,
        role: userCourse?.role || "unknown", // Añadimos el rol
      };
    });

    res.json(response);
  } catch (error) {
    console.error("Error en el endpoint:", error);
    res.status(500).json({ error: "Hubo un error en el servidor." });
  }
}


export const getCourseById = async (req: Request, res: Response) => {
  setCommonHeaders(res);
  try {
    // Captura el ID de los parámetros de la URL
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "El ID del curso es obligatorio." });
    }
    // Convertir el ID a número (siempre y cuando Prisma espere un entero)
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      res.status(400).json({ error: "El ID del curso debe ser un número válido." });
    }

    // Buscar el curso por su ID
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
      },
    });

    // Validar si se encontró el curso
    if (!course) {
      res.status(404).json({ message: "No se encontró el curso." });
    }

    // Responder con los detalles del curso
    res.status(200).json(course);
  } catch (error) {
    console.error("Error en el endpoint:", error);
    res.status(500).json({ error: "Hubo un error en el servidor." });
  }
};

export const joinRoom = async (req: Request, res: Response) => {
  setCommonHeaders(res)

  try {
    // Parsear el cuerpo de la solicitud
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      res.status(401).json({ error: "Token no encontrado" });
    }
    const { code_class, role, id_user, user_photo, user_email } = await req.body;

    const course_user = courseUsersSchema.safeParse({
      id: 0,
      id_course: 0,
      id_user,
      role,
      user_photo,
      user_email,
      code_class
    })
    if (!course_user.success) {
      res.status(400).json({ message: course_user.error.errors })
      console.log(course_user.error.errors)
      return;
    }

    const { data } = course_user

    // Buscar el curso con el código proporcionado
    const course = await prisma.course.findFirst({
      where: { code_class: data.code_class }, // Suponiendo que `code` es el campo en tu modelo
    });

    if (!course) {
      res.status(404).json({ error: 'Curso no encontrado.' });
    }
    // Autenticación con Google Drive
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken || "" }); // Token del usuario para autenticación

    const drive = google.drive({ version: "v3", auth });
    const user = await prisma.user.findFirst({
      where: { id: id_user }
    })
    if (!user) {
      res.status(404).json({ error: "User not found" });

    }
    const folderId = user?.folder_id || ""
    const courseFolder = await drive.files.create({
      requestBody: {
        name: course?.course_name,
        mimeType: "application/vnd.google-apps.folder",
        parents: [folderId],
      },
      fields: "id",
    });

    const courseFolderId = courseFolder.data.id || "";

    // Crear la relación en course_users y guardar el folder_id en la base de datos
    const newCourseUser = await prisma.course_users.create({
      data: {
        id_course: course?.id || 0,
        id_user: data.id_user,
        role: data.role,
        folder_id: courseFolderId, // Guardar el folder_id en la tabla course_users
      },
    });

    res.json(newCourseUser);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({
      error: 'Hubo un error al procesar la solicitud. Inténtalo de nuevo más tarde.',
    });
  }
};

export const getPersonsByCourse = async (req: Request, res: Response) => {
  setCommonHeaders(res)
  try {
    // /course/persons?courseId=2
    const { courseId } = req.query;
    if (!courseId) {
      res.status(400).json({ error: "El ID del curso es obligatorio." });
    }
    const id = courseId as string
    const persons = await prisma.course_users.findMany({
      where: { id_course: parseInt(id) },
      select: {
        user: true,
        role: true
      }
    })

    res.json(persons)

  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json(
      { error: 'Hubo un error al procesar la solicitud. Inténtalo de nuevo más tarde.' },
    );
  }
}