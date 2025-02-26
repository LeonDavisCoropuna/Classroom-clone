import type { Request, Response } from "express";
import prisma from "../lib/db";


// Crear un nuevo tema dentro de un curso
export const createTopic = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { name } = req.body;

  try {
    const topic = await prisma.topic.create({
      data: {
        name,
        id_course: parseInt(courseId),
      },
    });
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el tema' });
  }
};

// Obtener todos los temas de un curso
export const getAllTopics = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const topics = await prisma.topic.findMany({
      where: {
        id_course: parseInt(courseId)
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    if (!topics) {
      res.status(404).json({ message: "Topics not found" })
    }
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los temas' });
  }
};

// Obtener un tema específico dentro de un curso
export const getTopicById = async (req: Request, res: Response) => {
  const { courseId, topicId } = req.params;

  try {
    const topic = await prisma.topic.findFirst({
      where: {
        id: parseInt(topicId),
        id_course: parseInt(courseId),
      },
      include: {
        task: true
      }
    });
    if (!topic) {
      res.status(404).json({ error: 'Tema no encontrado' });
    }
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el tema' });
  }
};

// Actualizar un tema dentro de un curso
export const updateTopic = async (req: Request, res: Response) => {
  const { courseId, topicId } = req.params;
  const { name } = req.body;

  try {
    const topic = await prisma.topic.update({
      where: {
        id: parseInt(topicId),
      },
      data: {
        name,
        id_course: parseInt(courseId),
      },
    });
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el tema' });
  }
};

// Eliminar un tema dentro de un curso
export const deleteTopic = async (req: Request, res: Response) => {
  const { courseId, topicId } = req.params;

  try {
    const topic = await prisma.topic.delete({
      where: {
        id: parseInt(topicId),
      },
    });
    res.status(200).json({ message: 'Tema eliminado con éxito', topic });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el tema' });
  }
};
