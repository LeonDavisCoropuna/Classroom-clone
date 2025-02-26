import { useState, useEffect } from "react";
import axios from "@/config/axios";
import { Task } from "@/schemas/task.schema";

export const useTasks = (id_course: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [singleTask, setSingleTask] = useState<Task | null>(null);

  // Obtener todas las tareas
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<Task[]>(`/task/${id_course}`);
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al obtener las tareas");
    } finally {
      setLoading(false);
    }
  };

  // Obtener una tarea por su ID
  const fetchTaskById = async (taskId: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<Task>(`/task/0/${taskId}`);
      setSingleTask(data);
      console.log("desde hook: ", singleTask)
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al obtener la tarea");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una tarea por su ID
  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete(`/task/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al eliminar la tarea");
    }
  };

  useEffect(() => {
    if (id_course) {
      fetchTasks();
    }
  }, [id_course]);

  return { tasks, loading, error, deleteTask, fetchTaskById, singleTask };
};
