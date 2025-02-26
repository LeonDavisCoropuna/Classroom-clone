import FileItemAssignments from "@/components/FileItemAssignments";
import { FileItem } from "@/components/TaskItem";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import UploadImage from "@/components/UploadFile";
import axios from "@/config/axios";
import { useTasks } from "@/context/TaskContext";
import { useUser } from "@/context/UserContext";
import { Comment } from "@/schemas/comment.schema";
import { TaskSubmission } from "@/schemas/taskSubmission.schema";
import { formatDate } from "@/utils/formateDate";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useParams } from "react-router-dom";

const AssignmentsPage = () => {
  const { id: taskId } = useParams<{ id: string }>(); // Obtener el taskId de la URL
  const { fetchTaskById } = useTasks(); // Obtener la función del contexto
  const { user } = useUser()

  const task = fetchTaskById(parseInt(taskId ?? ""))
  const [uploadFiles, setUploadedFiles] = useState<File[]>([])
  const [taskSubmission, setTaskSubmission] = useState<TaskSubmission | null>();
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await axios.post(`/comment/get-comments`, {
        id_task: taskId,
        userId: user?.id
      })
      setComments(data)
    }
    const fetchSubmission = async () => {
      const { data } = await axios.post(`/submission/get-submission`, {
        id_task: taskId,
        id_creator: user?.id
      });
      setTaskSubmission(data)
    }
    fetchComments()
    fetchSubmission()
  }, [user])
  const handleNewComment = async () => {
    try {
      // Llamada al endpoint para unirse a la clase
      const res = await axios.post('/comment', {
        text: newComment, taskId: task?.id, isPrivate: false, recipientId: null, creatorId: user?.id
      });
      console.log('Clase unida exitosamente:', res.data);

      // Cierra el modal después de unirse a la clase
      setNewComment("");
    } catch (error) {
      console.error('Error al unirse a la clase:', error);
    }
  }


  const [addComment, setAddComment] = useState(false)

  const handleSubmit = async () => {

    const formData = new FormData()

    formData.append("score", "null")
    formData.append("id_task", taskId?.toString() || "")
    formData.append("id_creator", user?.id.toString() || "")

    uploadFiles.forEach((file) => formData.append("files", file))
    try {
      const res = await axios.post('/submission', formData);
      if (res.status === 201) {
        alert("SIUUUU")
      }
    } catch (error) {
      alert("ZZZZZZZZZ")
    }
  }

  return (
    <div className="w-full justify-center px-5 py-3 gap-5 flex items-baseline">
      <div className="flex justify-center p-2 rounded-full bg-orange-500">
        <svg className="fill-white rounded-full" focusable="false" width="26" height="26" viewBox="0 0 24 24">
          <path d="M7 15h7v2H7zm0-4h10v2H7zm0-4h10v2H7z"></path>
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04a2.008 2.008 0 0 0-1.44 1.19c-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"></path>
        </svg>
      </div>
      <div className="max-w-[47.5em]">
        <div className="w-full flex justify-between items-center">
          <div className="flex w-full items-center gap-5">
            <div className="flex w-full justify-between items-center">
              <h1 className="h1">{task?.title}</h1>
              <div className="p-2 rounded-full hover:bg-primary-hover shrink-0 cursor-pointer">
                <svg className="" focusable="false" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="leading-none text-[#5F6368] h4">
          <span>{task?.creator?.name}</span> • <span>{formatDate(task?.createdAt || "")}</span>
        </div>

        <div className="pb-4 border-b border-third w-full">
          <span className="h4 font-medium">{task?.points} puntos</span>
        </div>
        {task?.instructions &&
          <div className="text-sm mt-3">
            {task?.instructions}
          </div>}
        {task && task.task_files.length > 0 && <div className="grid grid-cols-2 gap-4 mt-3">
          {task?.task_files.map((task_file) => (
            <FileItem key={task_file.id} task_file={task_file} />
          ))}
        </div>}

        <div className="flex gap-x-3 mt-6">
          <svg className="fill-gray-600" focusable="false" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 8c0-1.42-.5-2.73-1.33-3.76.42-.14.86-.24 1.33-.24 2.21 0 4 1.79 4 4s-1.79 4-4 4c-.43 0-.84-.09-1.23-.21-.03-.01-.06-.02-.1-.03A5.98 5.98 0 0 0 15 8zm1.66 5.13C18.03 14.06 19 15.32 19 17v3h4v-3c0-2.18-3.58-3.47-6.34-3.87zM9 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 9c-2.7 0-5.8 1.29-6 2.01V18h12v-1c-.2-.71-3.3-2-6-2M9 4c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 9c2.67 0 8 1.34 8 4v3H1v-3c0-2.66 5.33-4 8-4z"></path></svg>
          <span className="h4 font-medium">{comments.length > 0 ? `${comments.length} comentarios de la clase` : "Comentarios de la clase"}</span>
        </div>
        {comments.length === 0 ?
          <div className="w-full" onClick={() => setAddComment(true)}>
            {!addComment ?
              <h4 className="text-aux hover:bg-primary-hover mt-2 font-medium hover:text-blue-700 py-1 cursor-pointer inline-block h4 ">Agregar comentarios de la clase</h4>
              :
              <div className="flex gap-3 items-center w-full my-4">
                <img
                  src={user?.photo || "/user-profile.png'"} alt='img'
                  width={36} height={36}
                  className='rounded-full hover:bg-third'
                />
                <Input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Agregar comentario para la clase" className="py-2 px-3 rounded-xl border border-third" />
                <div className="p-2 hover:bg-third rounded-full cursor-pointer flex items-center"

                  onClick={handleNewComment}>
                  <svg className={`${newComment.length > 0 ? "fill-black" : "fill-gray-400"}`} focusable="false" width="24" height="24" viewBox="0 0 24 24"><path d="M2 3v18l20-9L2 3zm2 11l9-2-9-2V6.09L17.13 12 4 17.91V14z"></path></svg>
                </div>
              </div>}</div>
          :
          <div className="mt-4 flex flex-col gap-3">
            {comments.filter(comment => !comment.is_private).map((comment) =>
              <div key={comment.id} className="flex gap-3 items-center w-full ">
                <div className='p-1 hover:bg-third rounded-full'>
                  <img
                    src={user?.photo || "/user-profile.png'"} alt='img'
                    width={36} height={36}
                    className='rounded-full hover:bg-third'
                  />
                </div>
                <div>
                  <div className="flex gap-3 leading-3">
                    <span className="h4 font-medium">{comment.sender?.name}</span>
                    <span className="h4 text-[#5F6368]">{formatDate(comment.createdAt?.toString() || "")}</span>
                  </div>
                  <h4 className="h4">{comment.text}</h4>
                </div>
              </div>)}
            <div className="flex gap-x-2 items-center w-full ">
              <div className='p-1 hover:bg-third rounded-full'>
                <img
                  src={user?.photo || "/user-profile.png'"} alt='img'
                  width={44} height={44}
                  className='rounded-full hover:bg-third'
                />
              </div>
              <Input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Agregar comentario para la clase" className="py-2 px-3 rounded-xl border border-third" />
              <div className="p-2 hover:bg-third rounded-full cursor-pointer flex items-center"

                onClick={handleNewComment}>
                <svg className={`${newComment.length > 0 ? "fill-black" : "fill-gray-400"}`} focusable="false" width="24" height="24" viewBox="0 0 24 24"><path d="M2 3v18l20-9L2 3zm2 11l9-2-9-2V6.09L17.13 12 4 17.91V14z"></path></svg>
              </div>
            </div>
          </div>
        }
      </div>
      <div className="min-w-[18.75em] flex flex-col border border-third rounded-md shadow-md p-6">
        <div className="flex justify-between items-center w-full">
          <h4 className="text-xl">Tu trabajo</h4>
          <h4 className={`text-sm font-medium ${taskSubmission ? "" : "text-[#1E8E3E]"}`}>{taskSubmission ? "Entregada" : "Asignada"}</h4>
        </div>
        <div className="w-full">
          {task && task.task_files.length > 0 &&
            <div className="grid grid-cols-1 gap-2 mt-3 max-w-64">
              {taskSubmission?.task_submission_files.map((task_file) => (
                <FileItemAssignments key={task_file.id} task_file={task_file} file={null} />
              ))}
            </div>}
          {uploadFiles && uploadFiles.length > 0 &&
            <div className="grid grid-cols-1 gap-2 mt-3 max-w-64">
              {uploadFiles.map((file, index) => (
                <FileItemAssignments key={index} task_file={null} file={file} />
              ))}
            </div>}
        </div>
        {taskSubmission ?
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="flex justify-center items-center border border-third rounded-sm text-aux font-medium gap-1 h4 mt-4 py-1 hover:bg-primary-hover">
              <AiOutlinePlus size={18} />
              <h4>Anular entrega</h4>
            </DialogTrigger>
            <DialogContent className="flex flex-col bg-white rounded-lg leading-5 min-w-64 max-w-[35em] pt-6">
              <h4 className="font-medium">¿Anular la entrega?</h4>
              <h4 className="text-[#5F6368] text-sm px-6 ">Anula la entrega para agregar o cambiar archivos adjuntos. No olvides volver a entregarla una vez que termines.</h4>
              <div className="text-aux  flex w-full justify-end gap-2 mt-4 text-sm font-medium">
                <button className="hover:bg-primary-hover px-2 py-1">Cancelar</button>
                <button className="hover:bg-primary-hover px-2 py-1">Anular la entrega</button>
              </div>
            </DialogContent>
          </Dialog>
          :
          <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger className="flex justify-center items-center border border-third rounded-sm text-aux font-medium gap-1 h4 mt-4 py-1 hover:bg-primary-hover">
                <AiOutlinePlus size={18} />
                <h4>Agregar o crear</h4>
              </DialogTrigger>
              <UploadImage setIsDialogOpen={setIsDialogOpen} setUploadedFiles={setUploadedFiles} />
            </Dialog>
            <div
              className="flex justify-center items-center rounded-sm bg-aux text-white font-medium gap-1 h4 mt-4 py-1 hover:bg-blue-600 cursor-pointer"
              onClick={handleSubmit}
            >
              <h4>Entregar</h4>
            </div>
          </>
        }

      </div>
    </div >
  );
};

export default AssignmentsPage;