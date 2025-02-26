import { IoMdClose } from "react-icons/io"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog"
import { getAssignmentFile } from "@/utils/getFileIcon"
import { TaskSubmissionFiles } from "@/schemas/taskSubmission.schema"

interface Props {
  task_file: TaskSubmissionFiles | null
  file: File | null
}

const FileItemAssignments = ({ task_file, file }: Props) => {

  return <Dialog>
    <DialogTrigger>
      <div className="gap-x-2 border border-third w-full rounded-lg flex items-center justify-between group">
        <div className="flex items-center justify-between w-full leading-5 gap-2 px-2">
          <div className="min-w-[3.5em] min-h-[3.5em]">
            {file ? getAssignmentFile(file)
              :
              <img src={task_file?.thumbnailLink} alt="img" className="cursor-pointer border-r border-third h-[3.4em] w-[3.5em]" />
            }
          </div>
          <div className="overflow-hidden w-full text-left">
            <h4 className="h4 truncate group-hover:text-aux font-medium">{task_file ? task_file.name : file?.name}</h4>
            <h4 className="h4 text-[#5F6368] ">{task_file ? task_file.type : file?.type}</h4>
          </div>
          <div className="p-2 hover:bg-third rounded-full">
            <svg focusable="false" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
          </div>
        </div>
      </div>
    </DialogTrigger>
    {task_file &&
      <DialogContent className="h-screen w-full flex flex-col justify-between p-0 gap-0">
        <DialogTitle className="bg-[#1e1e1f] text-white flex justify-between w-full items-center px-8 py-3">
          <div>{task_file?.name}</div>
          <div className="h-full flex justify-center items-center">
            <DialogClose className="h-full hover:bg-second w-full justify-center items-center rounded-full">
              <IoMdClose size={36} className="p-2" />
            </DialogClose>
          </div>
        </DialogTitle>
        <iframe src={task_file?.url.replace("view", "preview")} className="w-full h-full" />
      </DialogContent>}

  </Dialog>
}

export default FileItemAssignments