import { useState, useEffect } from "react";
import axios from "@/config/axios";
import { User } from "@/schemas/user.schema";

export const usePersons = (id_course: string) => {
  const [persons, setPersons] = useState<{user: User, role: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchannounces = async () => {
      setLoading(true);
      setError(null); // Resetear el error antes de hacer la solicitud

      try {
        const { data } = await axios.get(`/course/persons?courseId=${id_course}`)
        setPersons(data); // Actualizar el estado con los cursos
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al obtener los cursos");
      } finally {
        setLoading(false); // Detener el estado de carga
      }
    };

    if (id_course) {
      fetchannounces();
    }
  }, [id_course]);

  return { persons, loading, error };
};
