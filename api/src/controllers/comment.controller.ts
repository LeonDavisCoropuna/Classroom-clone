import type { Request, Response } from "express";
import { setCommonHeaders } from "../utils/setHeaders";
import prisma from "../lib/db";

export const createComment = async (req: Request, res: Response) => {
  setCommonHeaders(res);
  try {
    const { text, taskId, isPrivate, recipientId, creatorId } = req.body;

    // Validación de datos
    if (!text || !taskId || typeof isPrivate !== 'boolean') {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
      return
    }

    if (isPrivate && !recipientId) {
      res.status(400).json({ error: 'recipientId es obligatorio para mensajes privados' });
      return
    }
    const newMessage = await prisma.comment.create({
      data: {
        text,
        id_creator: creatorId,
        id_recipient: isPrivate ? recipientId : null, // Solo se asigna si es privado
        id_task: taskId,
        is_private: isPrivate,
      },
      include: {
        sender: true, // Incluir información del remitente
        recipient: true, // Incluir información del receptor (si existe)
      },
    });

    // Respuesta exitosa
    res.status(201).json(newMessage);
    return;
  } catch (error: any) {
    console.error("Error creating course:", error);
    res.status(500).json({
      message: error?.message || "Ocurrió un error",
    });
  }
}

export const getComments = async (req: Request, res: Response) => {
  setCommonHeaders(res);
  try {
    const { id_task, userId } = req.body
    if (!id_task) {
      res.status(400).json({ error: "El ID de la tarea es obligatorio." });
    }
    const publicMessages = await prisma.comment.findMany({
      where: {
        id_task: parseInt(id_task),
        is_private: false, // Solo mensajes públicos
      },
      include: {
        sender: true, // Incluir información del remitente
      },
    });
    const privateMessages = await prisma.comment.findMany({
      where: {
        OR: [
          { id_creator: userId }, // Mensajes enviados por el usuario
          { id_recipient: userId }, // Mensajes recibidos por el usuario
        ],
        is_private: true, // Solo mensajes privados
        id_task: parseInt(id_task)
      },
      include: {
        sender: true, // Incluir información del remitente
        recipient: true, // Incluir información del receptor
      },
    });
    const asd = [
      ...publicMessages, ...privateMessages
    ]
    res.json(asd)
    return
  } catch (error: any) {
    console.error("Error creating course:", error);
    res.status(500).json({
      message: error?.message || "Ocurrió un error",
    });
  }
}
