import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from "@/config/axios";
import { Course } from '@/schemas/course.schema';
import { useUser } from './UserContext';
import { Topic } from '@/schemas/task.schema';

// Definir el tipo de los datos del contexto
interface CourseContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
  singleCourse: Course | null;
  topics: Topic[];
  fetchCourses: () => void;
  fetchCourseById: (courseId: number) => Course | null;
  deleteCourse: (courseId: number) => void;
  fetchTopics: (courseId: number) => void;
}

// Crear el contexto
const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Definir el tipo de las props del proveedor
interface CourseProviderProps {
  children: ReactNode;
}

// Crear el Provider
export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const { user } = useUser()
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [singleCourse, setSingleCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([])
  // Obtener todas las tareas
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<Course[]>(`/course?id_user=${user?.id}`);
      setCourses(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al obtener las tareas");
    } finally {
      setLoading(false);
    }
  };

  // Obtener una tarea por su ID (filtrando el array de tareas en lugar de llamar a la API)
  const fetchCourseById = (courseId: number) => {
    const course = courses.find((course) => course.id === courseId) || null;
    setSingleCourse(course);
    return course
  };

  const fetchTopics = async (courseId: number) => {
    try {
      const { data } = await axios.get(`/topic/${courseId}`)
      setTopics(data);
    } catch (err: any) {
      console.log(err)
    }
  }

  // Eliminar una tarea por su ID
  const deleteCourse = async (courseId: number) => {
    try {
      await axios.delete(`/course/${courseId}`);
      setCourses((prevCourses) => prevCourses.filter((Course) => Course.id !== courseId));
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al eliminar la tarea");
    }
  };

  // Llamamos a fetchCourses al montar el componente (cuando se cambia id_user)
  useEffect(() => {
    if (user?.id) {
      fetchCourses();
    }
  }, [user?.id]);

  return (
    <CourseContext.Provider value={{ courses, loading, error, singleCourse, topics, fetchCourses, fetchCourseById, deleteCourse, fetchTopics }}>
      {children}
    </CourseContext.Provider>
  );
};

// Crear un custom hook para consumir el contexto
export const useCourses = (): CourseContextType => {
  const context = React.useContext(CourseContext);
  if (!context) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
};
