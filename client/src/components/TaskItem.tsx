import { Task, Task_files } from "@/schemas/task.schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "./ui/dropdown-menu";

import { formatDate } from "@/utils/formateDate";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import CreateTask from "./CreateTask";
import { useTasks } from "@/context/TaskContext";
import { useCourses } from "@/context/CourseContext";
import { useUser } from "@/context/UserContext";
import { Link } from "react-router-dom";

// Componente reutilizable para mostrar una tarea
interface TaskItemProps {
  taskId: number
}

export const TaskItem: React.FC<TaskItemProps> = ({ taskId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [action, setAction] = useState<"update" | "delete">("delete")
  const { topics } = useCourses()

  const { fetchTaskById, deleteTask } = useTasks();
  const { user } = useUser()

  const task = fetchTaskById(taskId) as Task;
    
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="item-1" className="flex-col w-full  justify-between cursor-pointer border-b hover:border-x rounded-md border-third hover:border-third items-center">
            <AccordionTrigger className="w-full flex items-center justify-between  py-3 px-4">
              <div className="flex flex-row w-full items-center justify-between mx-2">
                <div className="flex items-center justify-between gap-x-3">
                  <div className="flex justify-center p-2 rounded-full bg-orange-500 shrink-0">
                    <svg className="fill-white justify-stretch rounded-full" focusable="false" width="26" height="26" viewBox="0 0 24 24">
                      <path d="M7 15h7v2H7zm0-4h10v2H7zm0-4h10v2H7z"></path>
                      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04a2.008 2.008 0 0 0-1.44 1.19c-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"></path>
                    </svg>
                  </div>
                  <h3>{task?.title}</h3>
                </div>
                <h4 className="text-[#5F6368] h4">Fecha límite: {formatDate(task?.deadline || "")}</h4>
              </div>

              <DropdownMenuTrigger asChild>
                <div className="p-2 rounded-full hover:bg-primary-hover shrink-0">
                  <svg className="" focusable="false" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                  </svg>
                </div>
              </DropdownMenuTrigger>

            </AccordionTrigger>

            <AccordionContent className="px-4 py-2 gap-5 flex flex-col cursor-default">
              <h4 className="text-[#0000008c] h4">Publicado: {formatDate(task?.createdAt ?? "")}</h4>
              <div className="flex justify-between gap-5">
                <h4 className="text-primary">{task?.instructions}</h4>
                <div className="flex gap-x-5">
                  <div className="border-l border-third px-5 leading-8">
                    <h1 className="h1 font-medium">0</h1>
                    <h4>Entregadas</h4>
                  </div>
                  <div className="border-l border-third px-5 leading-8">
                    <h1 className="h1 font-medium">0</h1>
                    <h4>Asignadas</h4>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {task?.task_files.map((task_file) => (
                  <FileItem key={task_file.id} task_file={task_file} />
                ))}
              </div>
              <div className=" w-full flex justify-between h4 font-medium">
                <Link to={`/courses/${task?.id_course}/entregas/${task?.id}`} className="text-aux py-1 px-5 rounded-sm hover:bg-primary-hover cursor-pointer"
                >Ver instrucciones</Link>
                {task?.creator?.id === user?.id && <div className="bg-aux text-white py-1 px-5 rounded-sm hover:bg-blue-600 cursor-pointer">Revisar trabajo</div>}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <DropdownMenuContent className="bg-white flex flex-col w-full py-2 px-0">
          {task?.creator?.id === user?.id && <>
            <DialogTrigger className="w-full">
              <DropdownMenuItem className=" hover:bg-primary-hover w-full cursor-pointer py-2 px-4" onClick={() => setAction("update")}>Editar</DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem className=" hover:bg-primary-hover w-full cursor-pointer">
              <DialogTrigger className="w-full">
                <DropdownMenuItem className=" hover:bg-primary-hover w-full cursor-pointer py-2 px-4" onClick={() => setAction("delete")}>Borrar</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuItem>
          </>}
          <DropdownMenuItem className="py-2 hover:bg-primary-hover w-full px-4 cursor-pointer">Copiar vínculo</DropdownMenuItem>
        </DropdownMenuContent>
        <DialogContent>
          {action === "delete" ? <div className="rounded-md bg-white flex flex-col max-w-96">
            <div className="pt-4 p-4 leading-6">
              <h4 className="font-medium h3">¿Deseas eliminar la tarea?</h4>
              <h4 className="font-light h3 mt-3">También se borrarán las calificaciones y los comentarios</h4>
            </div>
            <div className=" flex justify-end gap-x-2">
              <button className="text-aux font-medium h4 p-2 rounded-md hover:bg-primary-hover" onClick={() => setIsDialogOpen(false)} >Cancelar</button>
              <button className="text-aux font-medium h4 p-2 rounded-md bg-primary-hover"
                onClick={() => deleteTask(task ? task.id : 0)}>Borrar</button>
            </div>
          </div> :
            <div className="h-screen w-screen flex flex-col justify-between p-0 gap-0 bg-white px-4">
              <CreateTask topics={topics} setOpen={setIsDialogOpen} taskId={task?.id || null} courseId={task?.id_course} />
            </div>}
        </DialogContent>
      </DropdownMenu>
    </Dialog>

  );
}

// Componente reutilizable para mostrar un archivo
export const FileItem = ({ task_file }: { task_file: Task_files }) => (
  <Dialog>
    <DialogTrigger>
      <div className="gap-x-2 border border-third w-full rounded-lg flex items-center justify-between group ">
        <div className="flex items-center justify-between w-full">
          <div>
            <img src={task_file.thumbnailLink} alt="img" className="cursor-pointer border-r border-third h-[4.4em] w-[6.5em]" />
          </div>
          <div className="overflow-hidden px-4 w-full text-left">
            <h4 className="h3 truncate group-hover:text-aux font-medium">{task_file.name}</h4>
            <h4 className="h4">{task_file.type}</h4>
          </div>
        </div>
      </div>
    </DialogTrigger>
    <DialogContent className="h-screen w-full flex flex-col justify-between p-0 gap-0">
      <DialogTitle className="bg-[#1e1e1f] text-white flex justify-between w-full items-center px-8 py-3">
        <div>{task_file.name}</div>
        <div className="h-full flex justify-center items-center">
          <DialogClose className="h-full hover:bg-second w-full justify-center items-center rounded-full">
            <IoMdClose size={36} className="p-2" />
          </DialogClose>
        </div>
      </DialogTitle>
      <iframe src={task_file.url.replace("view", "preview")} className="w-full h-full" />
    </DialogContent>
  </Dialog>
);