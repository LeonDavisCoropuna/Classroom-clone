import { useState, useEffect } from "react";
import { Announce } from "@/schemas/announce.schema";
import axios from "@/config/axios";

export const useAnnounces = (id_course: string) => {
  const [announces, setAnnounces] = useState<Announce[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchannounces = async () => {
      setLoading(true);
      setError(null); // Resetear el error antes de hacer la solicitud

      try {
        const response = await axios.get(`/course/announces?id_course=${id_course}`)
        setAnnounces(response.data); // Actualizar el estado con los cursos
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

  return { announces, loading, error };
};
