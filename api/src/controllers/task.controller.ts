import type { Request, Response } from "express";
import { setCommonHeaders } from "../utils/setHeaders";
import { google } from "googleapis";
import prisma from "../lib/db";
import stream from "stream";

export const createTask = async (req: Request, res: Response) => {
  setCommonHeaders(res);

  try {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      res.status(401).json({ error: "Token no encontrado" });
    }

    const { instructions, creator_id, id_course, deadline, lockSubmissions, points, title, topic_id } = req.body;

    const files = req.files as Express.Multer.File[];
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth });

    // Verificar si el curso tiene carpeta asociada
    const course_user = await prisma.course_users.findFirst({
      where: {
        id_course: parseInt(id_course),
        id_user: parseInt(creator_id)
      }
    });
    console.log("id course: ", parseInt(id_course))
    console.log("id_ user: ", parseInt(creator_id))
    const courseFolderId = course_user?.folder_id || "";
    console.log(course_user)
    // Validar si se encontró el folder_id
    if (!courseFolderId) {
      res.status(400).json({ error: "No se encontró el folder_id para el curso" });
      return;
    }

    const uploadedLinks: { fileId: string, url: string, name: string, type: string }[] = [];
    for (const file of files) {
      try {
        const fileStream = new stream.PassThrough();
        fileStream.end(file.buffer);

        const uploadResponse = await drive.files.create({
          requestBody: {
            name: file.originalname,
            parents: [courseFolderId],
          },
          media: {
            mimeType: file.mimetype,
            body: fileStream,
          },
          fields: "id, webViewLink",
        });

        const fileId = uploadResponse.data.id as string;

        await drive.permissions.create({
          fileId,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        });

        uploadedLinks.push({
          fileId,
          url: uploadResponse.data.webViewLink || "",
          name: file.originalname,
          type: file.mimetype,
        });

      } catch (uploadError) {
        console.error("Error al subir archivo:", uploadError);
        // No respondas aún, sigue procesando los archivos
      }
    }


    // Guardar la tarea y los archivos en la base de datos
    const parsedDeadline = isNaN(Date.parse(deadline)) ? null : new Date(deadline);

    const [task, task_files] = await prisma.$transaction(async (prisma) => {
      const newTask = await prisma.task.create({
        data: {
          deadline: deadline ? new Date(deadline) : null,
          lockSubmissions: lockSubmissions === "true",
          points: parseInt(points),
          title: title,
          creator_id: parseInt(creator_id),
          id_course: parseInt(id_course),
          instructions: instructions,
          topic_id: topic_id === "0" ? null : parseInt(topic_id)
        },
      });

      const filesData = uploadedLinks.map(link => ({
        id_task: newTask.id || 0,
        url: link.url,
        name: link.name,
        type: link.type,
        id_file: link.fileId,
        thumbnailLink: `https://drive.google.com/thumbnail?id=${link.fileId}`,
      }));

      await prisma.task_files.createMany({ data: filesData });

      return [newTask, filesData];
    });
    res.status(201).json(task);

  } catch (error: any) {
    console.error("Error creando tarea:", error);
    res.status(500).json({
      message: error?.message || "Ocurrió un error",
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  setCommonHeaders(res);

  try {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      res.status(401).json({ error: "Token no encontrado" });
      return
    }

    const { id_task } = req.params;
    const { instructions, creator_id, deadline, id_course, lockSubmissions, points, title, topic_id, task_files } = req.body;
    const files = req.files as Express.Multer.File[];
    const dataToUpdate = {
      instructions: instructions,
      creator_id: parseInt(creator_id),
      deadline: deadline ? new Date(deadline) : null,
      id_course: parseInt(id_course),
      lockSubmissions: lockSubmissions === "true",
      points: parseInt(points),
      title: title,
      topic_id: topic_id === "0" ? null : parseInt(topic_id),
      id: parseInt(id_task)
    }
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth });

    const taskExists = await prisma.task.findUnique({
      where: { id: parseInt(id_task) },
    });

    if (!taskExists) {
      res.status(404).json({ error: "Tarea no encontrada" });
      return
    }

    const course_user = await prisma.course_users.findFirst({
      where: {
        id_course: taskExists?.id_course,
        id_user: taskExists?.creator_id
      }
    });

    const uploadedLinks: { fileId: string, url: string, name: string, type: string }[] = [];

    // 1. Obtener archivos actuales asociados a la tarea
    const existingFiles = await prisma.task_files.findMany({
      where: { id_task: parseInt(id_task) },
    });

    // 2. Mapear IDs de archivos actuales para comparación
    const taskFiles = JSON.parse(task_files);
    const bodyFileIds = taskFiles.map((file: typeof taskFiles[0]) => file.id);

    // 3. Determinar archivos a eliminar
    const filesToDelete = existingFiles.filter(file => !bodyFileIds.includes(file.id));
    // Eliminar archivos de la base de datos y Google Drive
    for (const file of filesToDelete) {
      await prisma.task_files.delete({ where: { id: file.id } });

      // Eliminar el archivo de Google Drive si es necesario
      await drive.files.delete({ fileId: file.id_file }).catch(err => {
        console.warn(`Error eliminando archivo ${file.id_file}: ${err.message}`);
      });
    }

    const updateTask = await prisma.task.update({
      where: { id: dataToUpdate.id },
      data: dataToUpdate
    })

    // 4. Subir y guardar nuevos archivos
    if (files && files.length > 0) {
      for (const file of files) {
        const fileStream = new stream.PassThrough();
        fileStream.end(file.buffer);

        const uploadResponse = await drive.files.create({
          requestBody: {
            name: file.originalname,
            parents: [course_user?.folder_id || ""],
          },
          media: {
            mimeType: file.mimetype,
            body: fileStream,
          },
          fields: "id, webViewLink",
        });

        const fileId = uploadResponse.data.id as string;

        await drive.permissions.create({
          fileId,
          requestBody: { role: "reader", type: "anyone" },
        });

        uploadedLinks.push({
          fileId,
          url: uploadResponse.data.webViewLink || "",
          name: file.originalname,
          type: file.mimetype,
        });
      }

      // Guardar los nuevos archivos en la base de datos
      const filesData = uploadedLinks.map(link => ({
        id_task: parseInt(id_task),
        url: link.url,
        name: link.name,
        type: link.type,
        id_file: link.fileId,
        thumbnailLink: `https://drive.google.com/thumbnail?id=${link.fileId}`,
      }));

      await prisma.task_files.createMany({ data: filesData });
    }
    console.log(updateTask)
    res.json(updateTask);
    return;
  } catch (error) {
    console.error("Error actualizando tarea:", error);
    res.status(500).json({ error: "Error actualizando la tarea" });
  }
};


export const getTasks = async (req: Request, res: Response) => {
  setCommonHeaders(res);
  try {
    const { id_course } = req.params
    if (!id_course) {
      res.status(400).json({ error: "El ID del curso es obligatorio." });
    }
    const courseId = parseInt(id_course, 10);
    const tasks = await prisma.task.findMany({
      where: { id_course: courseId },
      include: {
        task_files: true,
        topic: true,
        creator: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    res.json(tasks)
  } catch (error: any) {
    console.error("Error creating course:", error);
    res.status(500).json({
      message: error?.message || "Ocurrió un error",
    });
  }
}

export const getTaskById = async (req: Request, res: Response) => {
  const { id_course, id_task } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: parseInt(id_task),
      },
      include: {
        task_files: true,
        topic: true,
        creator: true,
      },
    });
    if (!task) {
      res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error obteniendo la tarea:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar una tarea por ID
export const deleteTask = async (req: Request, res: Response) => {
  const { id_course, id_task } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: parseInt(id_task),
      },
    });

    if (!task) {
      res.status(404).json({ error: "Tarea no encontrada" });
    }

    // Eliminar los archivos asociados a la tarea
    await prisma.task_files.deleteMany({
      where: {
        id_task: parseInt(id_task),
      },
    });

    // Eliminar la tarea
    await prisma.task.delete({
      where: {
        id: parseInt(id_task),
      },
    });

    res.status(204).json({ message: "Tarea eliminada exitosamente" });
  } catch (error) {
    console.error("Error eliminando la tarea:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};