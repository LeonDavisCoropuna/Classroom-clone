import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "@/config/axios";

interface TaskPorps {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  courseId: number | undefined
}


const CreateTopic = ({ setOpen, courseId }: TaskPorps) => {
  const [topic, setTopic] = useState("")

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/topic/${courseId}`, { name: topic });
      if (response.status === 201) {
        alert("Tema creado con éxito.");
        setOpen(false)
      } else {
        throw new Error("Error al crear el tema.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al crear el tema.");
    }
  }
  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <div className="w-full flex justify-start mb-2">
        <h4 className="h3 font-medium">Agregar tema</h4>
      </div>
      <div className="bg-primary-hover border-b border-black focus:border-blue-800 rounded-none py-1 px-3 w-[16em] group hover:border-aux group-hover:border-4">
        <p className="h4 text-black group-hover:border-aux group-hover:text-aux group-focus:text-aux">
          Nombre del tema
        </p>
        <Input
          className="bg-transparent group-focus:text-aux group-hover:border-aux group-hover:text-aux group-hover:placeholder:text-aux"
          name="course_name"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      <div className="w-full flex justify-end gap-3">
        <button className="hover:bg-third text-aux rounded-md p-2 font-medium" onClick={() => setOpen(false)}>Cancelar</button>
        <Button
          onClick={handleSubmit}
          disabled={topic.length < 1}
          className={`font-medium h3 rounded-md bg-white  hover:bg-primary-hover border-r-white p-2 ${topic.length > 0 ? "text-aux" : "text-gray-700"}`}>Aceptar</Button>
      </div>
    </div>
  )
}

export default CreateTopic