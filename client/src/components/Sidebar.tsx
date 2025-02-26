import { AiOutlineHome } from 'react-icons/ai';
import { FaCaretDown, FaRegCalendar } from 'react-icons/fa';
import { PiBookOpenText } from 'react-icons/pi';
import { HiMiniInboxArrowDown } from 'react-icons/hi2';
import { IoSettingsOutline } from 'react-icons/io5';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'; // Importa tus componentes de acordeón personalizados
import { GraduationCap } from 'lucide-react';
import { PiUsersThree } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { useCourses } from '@/context/CourseContext';

const Sidebar = () => {
  const { courses, loading, error } = useCourses();

  if (loading) {
    return (
      <section className="border-r border-third w-[18.6em] p-4">
        <p className="text-primary">Cargando cursos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="border-r border-third w-[18.6em] p-4">
        <p className="text-red-500">Error al cargar los cursos</p>
      </section>
    );
  }

  return (
    <section className="border-r border-third w-[22.4em]">
      {/* Sección de navegación principal */}
      <div className="pr-3 py-2 border-b border-third">
        <Link to="/" className="flex items-center gap-x-3 h-10 hover:bg-primary-hover hover:rounded-r-full">
          <AiOutlineHome className="text-second ml-6" size={22} />
          <h4 className="h4 text-primary ml-3">Inicio</h4>
        </Link>
        <Link to="/calendar" className="flex items-center gap-x-3 h-10 hover:bg-primary-hover hover:rounded-r-full">
          <FaRegCalendar className="text-second ml-6" size={22} />
          <h4 className="text-primary h4 ml-3">Calendar</h4>
        </Link>
      </div>

      <div className="py-2 border-b border-third">
        <Accordion type="multiple" className="pr-3" defaultValue={["item-1"]}>
          <AccordionItem value="item-1">
            <AccordionTrigger className='flex flex-1 hover:bg-primary-hover rounded-r-full py-2'>
              <div className="flex items-center gap-x-1">
                <span>
                  <FaCaretDown className="h-4 w-4 shrink-0 transition-transform duration-200 text-second ml-1" />
                </span>
                <PiUsersThree className="text-second" size={24} />
              </div>
              <h4 className="text-primary h4 ml-3">Cursos que dictas</h4>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-x-3 h-10 hover:bg-primary-hover hover:rounded-r-full">
                <PiBookOpenText size={24} className="ml-6" />
                <h4 className="ml-3 h4">Pendientes de revisión</h4>
              </div>
              {/* Cursos mapeados */}
              {Array.isArray(courses) && courses.length > 0 && courses.map((course, index) => {
                return course.role === "teacher" ? (
                  <Link key={index} className="flex items-center gap-x-3 h-12 hover:bg-primary-hover hover:rounded-r-full" to={`/courses/${course.id}`}>
                    <img
                      src={course.creator?.photo}
                      alt={course.course_name.split(' ')[0]}
                      width={32}
                      height={32}
                      className="ml-6 rounded-full"
                    />
                    <div className="ml-3 overflow-hidden leading-5">
                      <h4 className="h4 truncate">{course.course_name}</h4>
                      {course.description && (
                        <h4 className="text-[#5F6368] text-sm truncate">{course.description}</h4>
                      )}
                    </div>
                  </Link>
                ) : null;
              })}

            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Sección de cursos */}
      <div className="py-2 border-b border-third">
        <Accordion type="multiple" className="pr-3" defaultValue={["item-1"]}>
          <AccordionItem value="item-1">
            <AccordionTrigger className='flex flex-1 hover:bg-primary-hover rounded-r-full py-2'>
              <div className="flex items-center gap-x-1">
                <span>
                  <FaCaretDown className="h-4 w-4 shrink-0 transition-transform duration-200 text-second ml-1" />
                </span>
                <GraduationCap className="text-second" size={24} />
              </div>
              <h4 className="text-primary h4 ml-3">Cursos en los que te has inscrito</h4>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-x-3 h-10 hover:bg-primary-hover hover:rounded-r-full">
                <PiBookOpenText size={24} className="ml-6" />
                <h4 className="ml-3 h4">Tareas Pendientes</h4>
              </div>

              {/* Cursos mapeados */}
              {Array.isArray(courses) && courses.length > 0 && courses.map((course, index) => {
                return course.role === "student" ? (
                  <Link key={index} className="flex items-center gap-x-3 h-12 hover:bg-primary-hover hover:rounded-r-full" to={`/courses/${course.id}`}>
                    <img
                      src={course.creator?.photo}
                      alt={course.course_name.split(' ')[0]}
                      width={32}
                      height={32}
                      className="ml-6 rounded-full"
                    />
                    <div className="ml-3">
                      <h4 className="h4">{course.course_name}</h4>
                      {course.description && (
                        <h4 className="text-[#5F6368] text-sm">{course.description}</h4>
                      )}
                    </div>
                  </Link>
                ) : null;
              })}

            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Otras opciones */}
      <div className="py-2">
        <div className="flex items-center gap-x-3 h-10 hover:bg-primary-hover hover:rounded-r-full">
          <HiMiniInboxArrowDown size={24} className="text-second ml-6" />
          <h4 className="h4 ml-3">Clases archivadas</h4>
        </div>
        <div className="flex items-center gap-x-3 h-10 hover:bg-primary-hover hover:rounded-r-full">
          <IoSettingsOutline size={24} className="text-second ml-6" />
          <h4 className="h4 ml-3">Ajustes</h4>
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
