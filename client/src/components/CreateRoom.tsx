import React, { useState } from 'react'
import { DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { courseSchema } from '@/schemas/course.schema';
import { useUser } from '@/context/UserContext';
import axios from '@/config/axios';

interface CreateRoomProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateRoom = ({ setOpen }: CreateRoomProps) => {
  const { user: session } = useUser();

  const [courseData, setCourseData] = useState({
    course_name: "",
    code_class: "",
    description: "",
    section: "",
    subject: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCourse = async () => {
    const { course_name, code_class, description, section, subject } = courseData;
    // Validar los datos con Zod
    const validation = courseSchema.safeParse({
      creator_id: session?.id,
      creator_email: session?.email,
      creator_photo: session?.photo,
      creator_name: session?.name,
      role: "teacher",
      course_name,
      code_class,
      description,
      section,
      subject,
      id: 0
    });
    if (!validation.success) {
      console.error("Invalid input data:", validation.error.errors);
      return;
    }
    try {
      await axios.post("/course", validation.data);

      setOpen(false);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <p className="h3 font-medium py-2">Crear clase</p>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-6">
        <div className="bg-third border-b border-black focus:border-blue-800 rounded-none py-1 px-3 w-[32em] group hover:border-aux">
          <p className="h4 group-hover:border-aux group-hover:text-aux">
            Nombre de la clase (obligatorio)
          </p>
          <Input
            className="bg-transparent group-hover:border-aux group-hover:text-aux group-hover:placeholder:text-aux"
            name="course_name"
            placeholder="Nombre de la clase"
            value={courseData.course_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="bg-third border-b border-black focus:border-blue-800 rounded-none py-1 px-3 w-[32em] group hover:border-aux">
          <p className="h4 group-hover:border-aux group-hover:text-aux">Sección</p>
          <Input
            className="bg-transparent group-hover:border-aux group-hover:text-aux group-hover:placeholder:text-aux"
            name="section"
            placeholder="Sección"
            value={courseData.section}
            onChange={handleInputChange}
          />
        </div>
        <div className="bg-third border-b border-black focus:border-blue-800 rounded-none py-1 px-3 w-[32em] group hover:border-aux">
          <p className="h4 group-hover:border-aux group-hover:text-aux">Asignatura</p>
          <Input
            className="bg-transparent group-hover:border-aux group-hover:text-aux group-hover:placeholder:text-aux"
            name="subject"
            placeholder="Asignatura"
            value={courseData.subject}
            onChange={handleInputChange}
          />
        </div>
        <div className="bg-third border-b border-black focus:border-blue-800 rounded-none py-1 px-3 w-[32em] group hover:border-aux">
          <p className="h4 group-hover:border-aux group-hover:text-aux">Descripción</p>
          <Input
            className="bg-transparent group-hover:border-aux group-hover:text-aux group-hover:placeholder:text-aux"
            name="description"
            placeholder="Descripción del curso"
            value={courseData.description}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="flex w-full justify-end">
        <button
          className="mt-6 py-2 px-4 text-aux hover:bg-third rounded-md"
        >
          Cancelar
        </button>
        <button
          onClick={handleCreateCourse}
          className="mt-6 py-2 px-4 text-aux hover:bg-third rounded-md"
        >
          Crear
        </button>
      </div>
    </>
  )
}

export default CreateRoom