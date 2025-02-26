import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AiOutlinePlus } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateTask from "@/components/CreateTask";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreateTopic from "@/components/CreateTopic";
import { TaskItem } from "@/components/TaskItem";
import { useTasks } from "@/context/TaskContext";
import { useCourses } from "@/context/CourseContext";
import { useUser } from "@/context/UserContext";

const WorkPage = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const { user } = useUser()
  const { singleCourse: course, fetchCourseById, topics, fetchTopics } = useCourses()
  useEffect(() => {
    if (courseId) {
      fetchCourseById(parseInt(courseId))
      fetchTopics(parseInt(courseId))
    }
  }, [courseId])
  const [openTask, setOpenTask] = useState(false)
  const [openTopic, setOpenTopic] = useState(false)

  const { tasks } = useTasks();
  const [selectedTopic, setSelectedTopic] = useState<string>("none");

  const filteredTasks = selectedTopic === "none"
    ? tasks.filter((task) => task.topic_id === null)
    : tasks.filter((task) => task.topic_id === parseInt(selectedTopic));

  // Filtrar temas
  const filteredTopics = selectedTopic === "none"
    ? topics
    : topics.filter((topic) => topic.id === parseInt(selectedTopic));


  return (
    <section className="w-full flex flex-col items-center py-3">
      <div className="w-[47.5em] flex flex-col gap-3">
        {course?.creator?.id === user?.id && selectedTopic === "none" && <DropdownMenu>
          <DropdownMenuTrigger className="max-w-28">
            <div className="rounded-full w-28 bg-[#1a73e8] cursor-pointer hover:bg-blue-600 flex gap-3 py-4 h-12 items-center justify-center px-4 text-white">
              <AiOutlinePlus color="white" className="pl-1" size={24} />
              <h2 className="pr-2">Crear</h2>
            </div>  
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white flex flex-col w-full py-2 px-0">
            <Dialog open={openTask} onOpenChange={setOpenTask}>
              <DialogTrigger asChild>
                <div className="flex items-center gap-3 w-64 hover:bg-neutral-100 px-4 cursor-pointer py-3">
                  <svg focusable="false" width="24" height="24" viewBox="0 0 24 24"><path d="M7 15h7v2H7zm0-4h10v2H7zm0-4h10v2H7z"></path><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04a2.008 2.008 0 0 0-1.44 1.19c-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"></path></svg>
                  <span>Tarea</span>
                </div>
              </DialogTrigger>
              <DialogContent className="h-screen w-full flex flex-col justify-between p-0 gap-0 bg-white px-4">
                <CreateTask topics={topics} setOpen={setOpenTask} taskId={null} courseId={course?.id} />
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-3 w-64 hover:bg-neutral-100 px-4 cursor-pointer py-3">
              <svg focusable="false" width="24" height="24" viewBox="0 0 24 24"><path d="M7 15h7v2H7zm0-4h10v2H7zm0-4h10v2H7z"></path><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04a2.008 2.008 0 0 0-1.44 1.19c-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"></path></svg>
              <span>Tarea con cuestionario</span>
            </div>
            <div className="w-full border border-third" />
            <Dialog open={openTopic} onOpenChange={setOpenTopic}>
              <DialogTrigger asChild>
                <div className="flex items-center gap-3 w-64 hover:bg-neutral-100 px-4 cursor-pointer py-3">
                  <svg focusable="false" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"></rect><path d="M3,5v14h18V5H3z M7,7v2H5V7H7z M5,13v-2h2v2H5z M5,15h2v2H5V15z M19,17H9v-2h10V17z M19,13H9v-2h10V13z M19,9H9V7h10V9z"></path></svg>
                  <span>Crear un tema</span>
                </div>
              </DialogTrigger>
              <DialogContent className="flex flex-col justify-between p-0 gap-0 bg-white">
                <CreateTopic open={openTopic} setOpen={setOpenTopic} courseId={parseInt(courseId?.toString() || "")} />
              </DialogContent>
            </Dialog>

          </DropdownMenuContent>
        </DropdownMenu>}

        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger className="w-1/2 h-12 h3">
            <SelectValue placeholder="Todos los temas" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none" className="h3 bg-[#e8f0fe] cursor-pointer hover:bg-primary-hover px-3 py-3 text-left w-full">Todos los temas</SelectItem>
              {topics.map(({ name, id }) => (
                <SelectItem key={id} value={id.toString()} className="h3 cursor-pointer hover:bg-primary-hover px-3 py-3 text-left w-full">
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="w-full flex flex-col gap-y-5">
          {selectedTopic === "none" &&
            filteredTasks.map((task) => <TaskItem key={task.id} taskId={task.id} />)
          }
          {filteredTopics.map((topic) => (
            <div className="flex flex-col" key={topic.id}>
              <div className="group flex justify-between items-center px-4 py-3 border-b border-third cursor-pointer">
                <h4 className="h1 group-hover:border-b-4 group-hover:text-aux group-hover:border-b-aux leading-none">{topic.name}</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 rounded-full hover:bg-primary-hover">
                    <svg className="" focusable="false" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                    </svg>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white flex flex-col w-full py-2 px-0">
                    {course?.creator?.id === user?.id && <>
                      <DropdownMenuItem className="py-2 hover:bg-primary-hover w-full px-4 cursor-pointer">Editar</DropdownMenuItem>
                      <DropdownMenuItem className="py-2 hover:bg-primary-hover w-full px-4 cursor-pointer">Borrar</DropdownMenuItem>
                    </>}
                    <DropdownMenuItem className="py-2 hover:bg-primary-hover w-full px-4 cursor-pointer">Copiar vínculo</DropdownMenuItem>
                    <DropdownMenuItem className="border border-third w-full  cursor-pointer"></DropdownMenuItem>
                    <DropdownMenuItem className="py-2 hover:bg-primary-hover w-full px-4 cursor-pointer">Mover hacia arriba</DropdownMenuItem>
                    <DropdownMenuItem className="py-2 hover:bg-primary-hover w-full px-4 cursor-pointer">Mover hacia abajo</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>              </div>
              <div className="flex flex-col w-full items-center ">
                {tasks.filter((topic_task) => topic_task.topic_id === topic.id).map((task) =>
                  <TaskItem key={task.id} taskId={task.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkPage