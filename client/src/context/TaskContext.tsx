import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from "@/config/axios";
import { Task } from "@/schemas/task.schema";

// Definir el tipo de los datos del contexto
interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  singleTask: Task | null;
  fetchTasks: () => void;
  updateTaskById: (task: Task) => void
  fetchTaskById: (taskId: number) => Task | null;
  deleteTask: (taskId: number) => void;
}

// Crear el contexto
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Definir el tipo de las props del proveedor
interface TaskProviderProps {
  children: ReactNode;
  id_course: string;
}

// Crear el Provider
export const TaskProvider: React.FC<TaskProviderProps> = ({ children, id_course }) => {
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

  // Obtener una tarea por su ID (filtrando el array de tareas en lugar de llamar a la API)
  const fetchTaskById = (taskId: number) => {
    const task = tasks.find((task) => task.id === taskId) || null;
    setSingleTask(task);
    return task;
  };

  const updateTaskById = (updateTask: Task) => {
    const updatedTasks = tasks.map(task => task.id === updateTask.id ? updateTask : task)
    setTasks(updatedTasks)
    return;
  };

  // Eliminar una tarea por su ID
  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete(`/task/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al eliminar la tarea");
    }
    //setTasks(tasks.filter(task => task.id === taskId))
  };

  // Llamamos a fetchTasks al montar el componente (cuando se cambia id_course)
  useEffect(() => {
    if (id_course) {
      fetchTasks();
    }
  }, [id_course]);

  return (
    <TaskContext.Provider value={{ tasks, loading, error, singleTask, fetchTasks, fetchTaskById, deleteTask, updateTaskById }}>
      {children}
    </TaskContext.Provider>
  );
};

// Crear un custom hook para consumir el contexto
export const useTasks = (): TaskContextType => {
  const context = React.useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
