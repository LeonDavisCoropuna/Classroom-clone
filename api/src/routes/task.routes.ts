import { Router } from "express";
import { createTask, getTasks, getTaskById, deleteTask, updateTask } from "../controllers/task.controller";
import multer from "multer";

const upload = multer()
const router = Router();

// Crear una nueva tarea (ya implementado)
router.post("/", upload.array("files"), createTask);
router.put("/:id_task", upload.array("files"), updateTask);

// Obtener todas las tareas
router.get("/:id_course", getTasks);

// Obtener una tarea específica por ID
router.get("/:id_course/:id_task", getTaskById);

// Eliminar una tarea por ID
router.delete("/:id_task", deleteTask);

export default router;
