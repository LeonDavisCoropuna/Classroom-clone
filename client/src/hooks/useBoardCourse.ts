import axios from "@/config/axios";
import { Course } from "@/schemas/course.schema";
import { useEffect, useState } from "react";

export const useBoardCourse = (id: string) => {
  const [course, setCourse] = useState<Course>({
    id: 0,
    course_name: "",
    creator_id: 0,
    code_class: "",
    description: "",
    section: "",
    subject: "",
    createdAt: new Date,
    updatedAt: new Date,
    role: "",
    creator: {
      email: "",
      family_name: "",
      given_name: "",
      id: 0,
      name: "",
      photo: " ",
      sub: "",
      createdAt: new Date,
      updatedAt: new Date
    }
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`/course/${id}`);
        setCourse(data);
      } catch (err) {
        setError('Error fetching courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [id]);

  return { course, loading, error };
};
