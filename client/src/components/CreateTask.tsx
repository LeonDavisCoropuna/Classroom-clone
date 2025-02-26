import { IoMdClose, } from "react-icons/io"
import { Dialog, DialogClose, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { AiOutlinePlus } from "react-icons/ai"
import { format } from "date-fns"
import { Checkbox } from "./ui/checkbox"
import { Button } from "./ui/button"
import axios from "@/config/axios"
import { useUser } from "@/context/UserContext"
import { Task, Topic } from "@/schemas/task.schema"
import { getFileIcon } from "@/utils/getFileIcon"
import { useTasks } from "@/context/TaskContext"
import { useCourses } from "@/context/CourseContext"
import UploadImage from "./UploadFile"

interface TaskPorps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  topics: Topic[]
  taskId: number | null
  courseId: number | undefined
}


const CreateTask = ({ topics, setOpen, taskId, courseId }: TaskPorps) => {
  const { user: session } = useUser()
  const { singleTask, fetchTaskById, updateTaskById } = useTasks()
  const { singleCourse: course, fetchCourseById } = useCourses()
  const [form, setForm] = useState<Task>({
    id: 0,
    title: "",
    deadline: "",
    points: 100,
    id_course: courseId ?? 0,
    creator_id: session?.id || 0,
    topic_id: null,
    lockSubmissions: false,
    instructions: "",
    task_files: [], // Puedes ajustar esto según la estructura real de los archivos
    files: []
  })


  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado para el diálogo
  const [selectedTopic, setSelectedTopic] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  if (taskId) {
    fetchTaskById(taskId || 0)
    fetchCourseById(form.id_course)
    setForm({ ...form, ...singleTask })
    setSelectedTopic(singleTask?.topic_id?.toString() ?? "")
  }


  const handleSubmit = async () => {
    if (form.title === "") {
      alert("El título es obligatorio.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("instructions", form.instructions);
    formData.append("id_course", form.id_course.toString());
    formData.append("points", form.points.toString());
    formData.append("deadline", form.deadline ? form.deadline : "");
    formData.append("lockSubmissions", form.lockSubmissions.toString());
    formData.append("creator_id", session?.id.toString() || "");
    formData.append("topic_id", selectedTopic);

    formData.append("task_files", JSON.stringify(form.task_files));
    uploadedFiles.forEach((file: any) => formData.append("files", file));
    try {
      if (taskId) {
        const response = await axios.put(`/task/${taskId}`, formData);
        if (response.status === 201 || response.status === 200) {
          alert("Anuncio publicado con éxito.");
          setOpen(false);
          updateTaskById(response.data)
        } else {
          throw new Error("Error al publicar el anuncio.");
        }
      } else {
        const response = await axios.post("/task", formData);
        if (response.status === 201 || response.status === 200) {
          alert("Anuncio actualizado con éxito.");
          setOpen(false);
        } else {
          throw new Error("Error al publicar el anuncio.");
        }
      }
    } catch (error) {
      console.log(error);
      alert("Error al publicar el anuncio.");
    }

  };

  return (
    <>
      <DialogTitle className="bg-white text-primary border-b border-third flex w-full items-center p-3 justify-between">
        <div className="flex items-center">
          <div className="h-full flex justify-center items-center">
            <DialogClose className="h-full w-full hover:bg-primary-hover justify-center items-center rounded-full p-2">
              <IoMdClose size={24} className="" />
            </DialogClose>
          </div>
          <div className="flex items-center gap-x-4 px-7 cursor-pointer">
            <svg className="fill-orange-500 w-full" focusable="false" width="26" height="26" viewBox="0 0 24 24"><path d="M7 15h7v2H7zm0-4h10v2H7zm0-4h10v2H7z"></path><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04a2.008 2.008 0 0 0-1.44 1.19c-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"></path></svg>
            <h1 className="h2 font-light">Tarea</h1>
          </div>
        </div>
        <div className="rounded-md flex items-center px-2">
          {form.title.length > 0 ?
            <Button
              onClick={handleSubmit}
              className="h3 font-normal rounded-l-md rounded-r-none border-r-2 border-r-white bg-aux w-full flex items-center justify-center px-8 h-11">{taskId ? "Guardar" : "Asignar"}</Button>
            :
            <Button disabled className="h3 font-normal rounded-l-md bg-third w-full flex items-center justify-center px-8 h-11">Asignar</Button>}
          <div className="bg-aux flex items-center justify-center rounded-r-md">
            <svg className="fill-white bg-aux p-2 rounded-r-md" focusable="false" width="44" height="44" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z"></path></svg>
          </div>
        </div>
      </DialogTitle>
      <div className="flex text-primary w-full h-full justify-between">
        <div className="w-full bg-[#F8F9FA] flex items-center justify-center">
          <div className="h-full  w-[66.6em] mt-8 ">
            <form>
              <div className="w-full mt-5 bg-white p-6 rounded-md border border-third">
                <Input
                  placeholder="Título"
                  className="h3 bg-[#f1f3f4] rounded-none p-5 border-b border-black focus:border-aux focus:border-b-[3px]"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <Textarea rows={7}
                  placeholder="Instrucciones (opcional)"
                  className="h3 bg-[#F8F9FA] rounded-none p-5 border-b border-black mt-5 focus:border-aux focus:border-b-[3px]"
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                />
                {form.task_files.length > 0 &&
                  <ul className="space-y-3 mt-5 w-full">
                    {form.task_files && form.task_files.map((file, index) => (
                      <li key={index} className="border border-third w-full rounded-lg flex items-center justify-between pr-4">
                        <div className='flex items-center h-full'>
                          {getFileIcon(file)}
                          <div className="px-3  border-l border-third h-full">
                            <h4 className="h3 font-medium">{file.name}</h4>
                            <h4 className="h3 font-light">{file.type}</h4>
                          </div>
                        </div>
                        <div className="p-2 hover:bg-third cursor-pointer rounded-full"
                          onClick={() => {
                            setForm({ ...form, task_files: form.task_files.filter((_, index_file) => index_file !== index) })
                          }}>
                          <svg
                            focusable="false"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          ><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
                        </div>
                      </li>
                    ))}
                  </ul>}
                <ul className="space-y-3 mt-5 w-full">
                  {uploadedFiles && uploadedFiles.map((file: File, index) => (
                    <li key={index} className="border border-third w-full rounded-lg flex items-center justify-between pr-4">
                      <div className='flex items-center h-full'>
                        {getFileIcon(file)}
                        <div className="px-3  border-l border-third h-full">
                          <h4 className="h3 font-medium">{file.name}</h4>
                          <h4 className="h3 font-light">{file.type}</h4>
                        </div>
                      </div>
                      <div className="p-2 hover:bg-third cursor-pointer rounded-full"
                        onClick={() => {
                          setUploadedFiles(uploadedFiles.filter((_, index_file) => index_file !== index))
                        }}>
                        <svg
                          focusable="false"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        ><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>


              <div className="w-full mt-8 bg-white p-5 rounded-md border border-third">
                <h4>Adjuntar</h4>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger className="flex justify-center items-center w-full">
                    <div className="flex items-center justify-center gap-x-10">
                      <div className="flex flex-col items-center justify-center font-medium gap-y-2">
                        <div className="p-3 rounded-full border border-third">
                          <img src="https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v10/192px.svg" alt="drive"
                            width={24} height={24}
                          />
                        </div>
                        <h4>Drive</h4>

                      </div>
                      <div className="flex flex-col items-center justify-center font-medium gap-y-2">
                        <div className="p-3 rounded-full border border-third">
                          <img src="https://fonts.gstatic.com/s/i/productlogos/youtube/v9/192px.svg" alt="youtube"
                            width={24} height={24}
                          />
                        </div>
                        <h4>Youtube</h4>
                      </div>

                      <div className="flex flex-col items-center justify-center font-medium gap-y-2">
                        <div className="p-2 rounded-full border border-third">
                          <svg width="32" height="32" viewBox="0 0 36 36"><path fill="#34A853" d="M16 16v14h4V20z"></path><path fill="#4285F4" d="M30 16H20l-4 4h14z"></path><path fill="#FBBC05" d="M6 16v4h10l4-4z"></path><path fill="#EA4335" d="M20 16V6h-4v14z"></path><path fill="none" d="M0 0h36v36H0z"></path></svg>
                        </div>
                        <h4>Crear</h4>
                      </div>

                      <div className="flex flex-col items-center justify-center font-medium gap-y-2">
                        <div className="p-3 rounded-full border border-third">
                          <svg focusable="false" width="24" height="24" viewBox="0 0 24 24"><path d="M4 15h2v3h12v-3h2v3c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2m4.41-7.59L11 7.83V16h2V7.83l2.59 2.59L17 9l-5-5-5 5 1.41 1.41z"></path></svg>
                        </div>
                        <h4>Subir</h4>
                      </div>

                      <div className="flex flex-col items-center justify-center font-medium gap-y-2">
                        <div className="p-3 rounded-full border border-third">
                          <svg focusable="false" width="24" height="24" viewBox="0 0 24 24"><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2z"></path><path d="M8 11h8v2H8z"></path></svg>
                        </div>
                        <h4>Vínculo</h4>
                      </div>
                    </div>
                  </DialogTrigger>
                  <UploadImage setIsDialogOpen={setIsDialogOpen} setUploadedFiles={setUploadedFiles} />
                </Dialog>
              </div>
            </form>
          </div>
        </div>
        <div className="bg-white h-full min-w-[25em] p-5 gap-y-7 flex flex-col">
          <div>
            <h4>Para</h4>
            <Select disabled>
              <SelectTrigger className="bg-[#F8F9FA] h-12 border border-third rounded-none">
                <SelectValue
                  placeholder={course?.course_name} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Courses</SelectLabel>
                  <SelectItem value="curso">Some course</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h4>Asignar a</h4>
            <div className="flex gap-x-3 items-center justify-center border border-third h-12">
              <svg className="fill-aux" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><g><path d="M0,0h24v24H0V0z" fill="none" /></g><g><g><circle cx="10" cy="8" r="4" /><path d="M10.67,13.02C10.45,13.01,10.23,13,10,13c-2.42,0-4.68,0.67-6.61,1.82C2.51,15.34,2,16.32,2,17.35V20h9.26 C10.47,18.87,10,17.49,10,16C10,14.93,10.25,13.93,10.67,13.02z" /><path d="M20.75,16c0-0.22-0.03-0.42-0.06-0.63l1.14-1.01l-1-1.73l-1.45,0.49c-0.32-0.27-0.68-0.48-1.08-0.63L18,11h-2l-0.3,1.49 c-0.4,0.15-0.76,0.36-1.08,0.63l-1.45-0.49l-1,1.73l1.14,1.01c-0.03,0.21-0.06,0.41-0.06,0.63s0.03,0.42,0.06,0.63l-1.14,1.01 l1,1.73l1.45-0.49c0.32,0.27,0.68,0.48,1.08,0.63L16,21h2l0.3-1.49c0.4-0.15,0.76-0.36,1.08-0.63l1.45,0.49l1-1.73l-1.14-1.01 C20.72,16.42,20.75,16.22,20.75,16z M17,18c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S18.1,18,17,18z" /></g></g></svg>              <h4 className="text-aux">Todos los estudiantes</h4>
            </div>
          </div>
          <div>
            <h4>Puntos</h4>
            <Input
              className="h-12 h3 p-5 border border-third text-lg"
              value={form.points}
              onChange={(e) => setForm({ ...form, points: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <h4>Fecha límite</h4>
            <Popover modal={false}>
              <PopoverTrigger className="bg-[#F8F9FA] h-12 border border-third rounded-none w-full">
                <h4 className="px-3 py-2 h-12 flex items-center w-full border border-third">{form.deadline ? format(form.deadline, "PPP") : "Sin fecha límite"}</h4>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={form.deadline ? new Date(form.deadline) : undefined}
                  onSelect={(deadline) => setForm({ ...form, deadline: deadline ? deadline.toISOString() : "" })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {form.deadline &&
              <div className="w-full flex items-center gap-x-2 leading-4 my-3">
                <Checkbox
                  checked={form.lockSubmissions}
                  onCheckedChange={(check) => setForm({ ...form, lockSubmissions: check as boolean })}
                />
                <h4>Dejar de recibir archivos después de la fecha límite</h4>
              </div>
            }
          </div>
          <div>
            <h4>Tema</h4>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="bg-[#F8F9FA] h-12 border border-third rounded-none">
                <SelectValue placeholder="Sin tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="0" className="h-12 hover:bg-[#f1f3f4]">
                    Sin tema
                  </SelectItem>
                  <div className="w-full border border-third" />
                  {topics.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()} className="h-12 hover:bg-[#f1f3f4]">
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

          </div>
          <div>
            <h4>Rúbrica</h4>
            <Select disabled>
              <SelectTrigger className="bg-[#F8F9FA] h-12 border border-third rounded-none justify-start gap-x-3">
                <AiOutlinePlus size={24} />
                <SelectValue
                  placeholder="Rúbrica" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none" className="h-12 hover:bg-[#f1f3f4]">Sin tema</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div >
    </>
  )
}

export default CreateTask