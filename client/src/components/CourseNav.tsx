import { useCourses } from "@/context/CourseContext";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const CourseNav = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const location = useLocation();
  const [active, setActive] = useState("");
  const { singleCourse: course, fetchCourseById } = useCourses()
  const { user } = useUser()
  useEffect(() => {
    // Obtener el último segmento de la URL
    const pathSegments = location.pathname.split("/");
    setActive(pathSegments[3] || ""); // Si no hay un segmento en la posición 3, será vacío
  }, [location]);
  useEffect(() => {
    fetchCourseById(parseInt(courseId ?? ""))
  }, [fetchCourseById])
  return (
    <nav className="h-12 border border-b-third flex w-full items-center px-6">
      <Link to={`/courses/${courseId}`} className="h-full">
        <h4
          className={`text-[14px] text-second hover:text-primary h-full font-medium flex items-center px-6 flex-1 
          ${!active
              ? "border-b-4 border-b-[#185ABC] text-[#185ABC] hover:bg-primary-hover"
              : "hover:bg-third"
            }`}
        >
          Novedades
        </h4>
      </Link>
      <Link to={`/courses/${courseId}/trabajo`} className="h-full">
        <h4
          className={`text-[14px] text-second hover:text-primary h-full font-medium flex items-center px-6 flex-1 
          ${active === "trabajo"
              ? "border-b-4 border-b-[#185ABC] text-[#185ABC] hover:bg-primary-hover"
              : "hover:bg-third"
            }`}
        >
          Trabajo en clase
        </h4>
      </Link>
      <Link to={`/courses/${courseId}/personas`} className="h-full">
        <h4
          className={`text-[14px] text-second hover:text-primary h-full font-medium flex items-center px-6 flex-1 
          ${active === "personas"
              ? "border-b-4 border-b-[#185ABC] text-[#185ABC] hover:bg-primary-hover"
              : "hover:bg-third"
            }`}
        >
          Personas
        </h4>
      </Link>
      {course?.creator?.id === user?.id && <Link to={`/courses/${courseId}/calificaciones`} className="h-full">
        <h4
          className={`text-[14px] text-second hover:text-primary h-full font-medium flex items-center px-6 flex-1 
          ${active === "calificaciones"
              ? "border-b-4 border-b-[#185ABC] text-[#185ABC] hover:bg-primary-hover"
              : "hover:bg-third"
            }`}
        >
          Calificaciones
        </h4>
      </Link>}
    </nav>
  );
};

export default CourseNav;
