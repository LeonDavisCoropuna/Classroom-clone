import type { Request, Response } from "express";
import prisma from "../lib/db";

// https://developers.google.com/drive/api/guides/search-files?hl=es-419
import { google } from "googleapis";
import stream from "stream";
import { setCommonHeaders } from "../utils/setHeaders";

// Configurar multer para manejar archivos
export const createAnnounce = async (req: Request, res: Response): Promise<void> => {
  setCommonHeaders(res);

  try {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      res.status(401).json({ error: "Token no encontrado" });
      return;
    }

    // 1. Obtener los datos del formulario
    const { text, creator_id, id_course } = req.body;

    const data = {
      id_course: parseInt(id_course),
      id_user: parseInt(creator_id)
    }
    const files = req.files as Express.Multer.File[];

    // 2. Configurar Google Drive API
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth });
    // 3. Verificar o crear carpeta "Classroom clone"
    const course_user = await prisma.course_users.findFirst({
      where: {
        id_course: data.id_course,
        id_user: data.id_user
      }
    })
    const folderId = course_user?.folder_id || ""
    // 3. Subir los archivos a Google Drive
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
      const newAnnounce = await prisma.announce.create({
        data: {
          creator_id: parseInt(creator_id),
          id_course: parseInt(id_course),
          text: text.toString(),
        },
      });

      const filesData = uploadedLinks.map(link => ({
        id_announce: newAnnounce.id,
        url: link.url,
        name: link.name,
        type: link.type,
        id_file: link.fileId,
        thumbnailLink: `https://drive.google.com/thumbnail?id=${link.fileId}`,
      }));

      await prisma.announce_files.createMany({ data: filesData });

      return [newAnnounce, filesData];
    });

    // 5. Responder con éxito
    res.status(201).json({ message: 'Anuncio y archivos creados exitosamente.', links: uploadedLinks });
    return;
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ error: 'Hubo un error al procesar la solicitud. Inténtalo de nuevo más tarde.' });
    return;

  }
}


export const getAnnounces = async (req: Request, res: Response): Promise<void> => {
  setCommonHeaders(res)
  try {
    const { id_course } = req.query
    const accessToken = req.cookies.access_token
    if (!id_course) {
      res.status(401).json(
        { error: "El parámetro 'id_course' es obligatorio." },
      );
    }

    // Consultar anuncios y archivos asociados
    const announces = await prisma.announce.findMany({
      where: { id_course: parseInt(id_course as string) },
      include: {
        announce_files: true, // Incluye los archivos relacionados
        creator: true
      },
      orderBy: {
        createdAt: "desc", // Ordenar por fecha de creación más reciente
      },
    });

    if (announces.length === 0) {
      res.status(404).json(
        { message: "No se encontraron anuncios para este curso." },
      );
    }

    // // Configurar autenticación de Google Drive
    // const auth = new google.auth.OAuth2();
    // auth.setCredentials({ access_token: accessToken });

    // const drive = google.drive({ version: "v3", auth });

    // // Verificar y actualizar thumbnailLink en cada archivo
    // for (const announce of announces) {
    //   for (const file of announce.announce_files) {
    //     if (!file.thumbnailLink || file.thumbnailLink === "") {
    //       try {
    //         // Obtener detalles del archivo desde Google Drive
    //         const driveFile = await drive.files.get({
    //           fileId: file.id_file,
    //           fields: "thumbnailLink",
    //         });

    //         const newThumbnailLink = driveFile.data.thumbnailLink || "";

    //         // Actualizar el thumbnailLink en la base de datos
    //         await prisma.announce_files.update({
    //           where: { id: file.id },
    //           data: { thumbnailLink: newThumbnailLink },
    //         });

    //         // Asignar el nuevo thumbnailLink a la respuesta
    //         file.thumbnailLink = newThumbnailLink;
    //       } catch (driveError) {
    //         console.error(`Error al obtener el thumbnailLink del archivo ${file.id_file}:`, driveError);
    //       }
    //     }
    //   }
    // }
    res.json(announces);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json(
      { error: "Hubo un error al procesar la solicitud. Inténtalo de nuevo más tarde." },
    );
  }
}