import Announcesomething from "@/components/Announcesomething";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { IoMdClose } from "react-icons/io";
import { useAnnounces } from "@/hooks/useAnnounces";
import { useParams } from 'react-router-dom';
import { useUser } from "@/context/UserContext";
import { useCourses } from "@/context/CourseContext";
import { useEffect } from "react";

const BoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { singleCourse: course, fetchCourseById, fetchTopics } = useCourses()
  useEffect(() => {
    if (id) {
      fetchCourseById(parseInt(id))
      fetchTopics(parseInt(id))
    }
  }, [id])
  const { announces } = useAnnounces(id ?? "");
  const { user } = useUser()

  return (
    <section className="w-full px-[18.5em] flex flex-col">
      <div
        className="rounded-lg relative h-[14.8em] my-7 flex flex-col justify-end border border-third"
        style={{
          backgroundImage: `url('/themes/classroom-themes-${id && parseInt(id) % 6}.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2 className="h1 text-white px-8 capitalize">{course?.course_name}</h2>
      </div>
      <div className="flex gap-6">
        {course?.creator_id === user?.id ? <div className="flex border border-third flex-col rounded-md w-60 p-3">

          Code class: {course?.code_class}
        </div>
          :
          <div className="flex border border-third flex-col rounded-md w-60 p-3">
            <h4 className="h4 font-medium text-primary">Proximas entregas</h4>
            <h4 className="h4 font-light py-2">¡Yuju! ¡No tienes que entregar nada pronto!</h4>
            <button className="h4 text-end text-[#2962FF] font-medium">Ver todo</button>
          </div>}

        <div className="flex flex-col w-full gap-6">
          <div className="border border-third shadow-md  w-full rounded-md px-5 py-4 flex gap-x-5 items-center">
            <Announcesomething />
          </div>
          {announces ? announces.map((item, index) => (
            <div key={index} className="border border-third shadow-md  w-full rounded-md px-5 py-4 gap-x-5 items-center">
              <div className="flex items-center">
                <img src={item.creator.photo || "/user-profile.png"} alt="img" width={40} height={40} />
                <div className="px-5">
                  <h4 className="text-primary font-medium h4">{item.creator.name}</h4>
                  <h4 className="text-primary font-light h4">{item.createdAt.toString()}</h4>
                </div>
              </div>
              <h4 className="h4">{item.text}</h4>
              <div className="flex flex-col space-y-3 pt-3">
                {item.announce_files.map((file, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <div className="w-[21em] cursor-pointer group border-third border rounded-md h-20 flex flex-row gap-x-3">
                        <img
                          src={file.thumbnailLink}
                          width={24}
                          height={24}
                          alt="img"
                          className="min-w-24 h-20 border-r border-third bg-cover"
                        />
                        <div className="leading-6 h-full w-full flex flex-col justify-center items-start overflow-hidden text-left">
                          <h4 className="h3 font-medium group-hover:text-aux truncate">{file.name}</h4>
                          <h4 className="h4 text-second">{file.type}</h4>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="h-screen w-full flex flex-col justify-between p-0 gap-0">
                      <DialogTitle className=" bg-[#1e1e1f] text-white flex justify-between w-full items-center px-8 py-3 overflow-hidden">
                        <div className="truncate">
                          {file.name}
                        </div>
                        <div className="h-full flex justify-center items-center">
                          <DialogClose className="h-full hover:bg-second w-full justify-center items-center rounded-full">
                            <IoMdClose size={36} className="p-2" />
                          </DialogClose>
                        </div>
                      </DialogTitle>

                      <iframe
                        src={file.url.replace("view", "preview")}
                        className="w-full h-full"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          )) : <p>No hay anuncion publicados</p>}
        </div>
      </div>
    </section >
  );
}

export default BoardPage