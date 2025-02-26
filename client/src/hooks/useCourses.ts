import { useState, useEffect } from "react";
import { Course } from "@/schemas/course.schema";
import axios from "@/config/axios";

export const useCourses = (id_user: number) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null); // Resetear el error antes de hacer la solicitud

      try {
        const response = await axios.get(`/course?id_user=${id_user}`);
        setCourses(response.data); // Actualizar el estado con los cursos
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al obtener los cursos");
      } finally {
        setLoading(false); // Detener el estado de carga
      }
    };

    if (id_user) {
      fetchCourses();
    }
  }, [id_user]);

  return { courses, loading, error };
};
