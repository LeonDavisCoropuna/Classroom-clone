import { Router } from 'express';
import {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic
} from '../controllers/topic.controller';

const router = Router();

// Crear un nuevo tema asociado a un curso
router.post('/:courseId', createTopic);

// Obtener todos los temas de un curso específico
router.get('/:courseId', getAllTopics);

// Obtener un tema específico por su ID dentro de un curso
router.get('/:courseId/:topicId', getTopicById);

// Actualizar un tema específico dentro de un curso
router.put('/:courseId/:topicId', updateTopic);

// Eliminar un tema dentro de un curso
router.delete('/:courseId/:topicId', deleteTopic);

export default router;
