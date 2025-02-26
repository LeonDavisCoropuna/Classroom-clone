import type { Request, Response } from "express";
import prisma from "../lib/db";

// https://developers.google.com/drive/api/guides/search-files?hl=es-419
import { google } from "googleapis";
import stream from "stream";
import { setCommonHeaders } from "../utils/setHeaders";

// Configurar multer para manejar archivos
export const createSubmission = async (req: Request, res: Response): Promise<void> => {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    res.status(401).json({ error: "Token no encontrado" });
    return;
  }
  try {
    const { score, id_task, id_creator } = req.body
    const files = req.files as Express.Multer.File[]
    if (!id_task || !id_creator) {
      res.status(400).json({ error: "El id de la tarea y del usuario son obligatorios" })
    }

    // 2. Configurar Google Drive API
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth });

    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(id_task)
      },
      include: {
        course: true
      }
    })
    const course_user = await prisma.course_users.findFirst({
      where: {
        id_course: task?.id_course,
        id_user: parseInt(id_creator)
      }
    })
    const folderId = course_user?.folder_id || ""
    const uploadedLinks: { fileId: string, url: string, name: string, type: string }[] = [];

    for (const file of files) {

      // Convertir el archivo a un flujo (stream)
      const fileStream = new stream.PassThrough();
      fileStream.end(file.buffer);

      const uploadResponse = await drive.files.create({
        requestBody: {
          name: file.originalname,
          parents: [folderId],
        },
        media: {
          mimeType: file.mimetype,
          body: fileStream, // Pasar el flujo aquí
        },
        fields: "id, webViewLink",
      });

      const fileId = uploadResponse.data.id as string;

      // Configurar permisos de visualización
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      uploadedLinks.push({ fileId, url: uploadResponse.data.webViewLink || "", name: file.originalname, type: file.mimetype });
    }

    // 4. Guardar el anuncio y los archivos en la base de datos
    const [announce, announceFiles] = await prisma.$transaction(async (prisma) => {
      const newAnnounce = await prisma.task_submission.create({
        data: {
          score: score === "null" ? null : parseInt(score),
          id_task: parseInt(id_task),
          id_creator: parseInt(id_creator),
        },
      });

      const filesData = uploadedLinks.map(link => ({
        id_task_submission: newAnnounce.id,
        url: link.url,
        name: link.name,
        type: link.type,
        id_file: link.fileId,
        thumbnailLink: `https://drive.google.com/thumbnail?id=${link.fileId}`,
      }));

      await prisma.task_submission_files.createMany({ data: filesData });

      return [newAnnounce, filesData];
    });

    // 5. Responder con éxito
    res.status(201).json({ message: 'Tarea enviada exitosamente.', links: uploadedLinks });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json(
      { error: "Hubo un error al procesar la solicitud. Inténtalo de nuevo más tarde." },
    );
  }
}


export const getTaskSubmission = async (req: Request, res: Response): Promise<void> => {
  setCommonHeaders(res)
  try {
    const { id_task, id_creator } = req.body

    if (!id_task || !id_creator) {
      res.status(400).json(
        { error: "El parámetro 'id_task' e 'id_creator' es obligatorio." },
      );
    }

    // Consultar anuncios y archivos asociados
    const task_submission = await prisma.task_submission.findFirst({
      where: { id_task: parseInt(id_task as string), id_creator: parseInt(id_creator as string) },
      include: {
        task_submission_files: true, // Incluye los archivos relacionados
      },
      orderBy: {
        createdAt: "desc", // Ordenar por fecha de creación más reciente
      },
    });

    if (!task_submission) {
      res.status(404).json(
        { message: "No se encontraron anuncios para este curso." },
      );
    }

    res.json(task_submission);
    return;
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json(
      { error: "Hubo un error al procesar la solicitud. Inténtalo de nuevo más tarde." },
    );
  }
}