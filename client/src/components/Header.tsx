import { useEffect, useState } from 'react'
import { IoMdMenu } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { CgMenuGridO } from "react-icons/cg";
import UserInfo from './UserInfo';
import CreateRoom from './CreateRoom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import JoinRoom from './JoinRoom';
import { Link, useLocation } from 'react-router-dom';
import { useCourses } from '@/context/CourseContext';
import { Course } from '@/schemas/course.schema';

const Header = () => {
  const [joinIsOpen, setJoinIsOpen] = useState(false);
  const [createIsOpen, setCreateIsOpen] = useState(false);
  const location = useLocation()
  const { fetchCourseById } = useCourses()
  const [course, setCourse] = useState<Course | null>();
  useEffect(() => {
    const idCourse = location.pathname.split("/")[2]
    const courseFi = fetchCourseById(parseInt(idCourse))
    setCourse(courseFi)
  }, [location])
  return (
    <header className='flex justify-between py-3 px-[1.45em] border-b border-third '>
      <div className='flex justify-center items-center gap-x-6'>
        <IoMdMenu className='text-second' size={24} />
        <div className='flex justify-center items-center gap-x-2'>
          <img src="/classroom-logo.png" alt='Logo' width={26} height={26} />
          <Link to="/" className="h2 text-second hover:text-[#1E8E3E] hover:border-b-2 hover:border-b-[#1E8E3E] leading-none">
            Classroom
          </Link>
          {course &&
            <Link to={`/courses/${course.id}`} className='flex items-center leading-4 group cursor-pointer'>
              <svg className='fill-gray-600' focusable="false" width="18" height="18" viewBox="0 0 24 24"><path d="M7.59 18.59L9 20l8-8-8-8-1.41 1.41L14.17 12"></path></svg>
              <div className="ml-3 overflow-hidden">
                <h4 className="h3 truncate group-hover:text-aux border-b border-transparent group-hover:border-b group-hover:border-b-aux leading-none inline-block">{course.course_name}</h4>
                {course.description && (
                  <h4 className="text-[#5F6368] h4 truncate group-hover:text-aux group-hover:border group-hover:border-b-aux leading-none">{course.description}</h4>
                )}
              </div>
            </Link>}
        </div>
      </div>
      <div className='flex justify-center items-center gap-x-3 '>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="p-2 hover:bg-third rounded-full">
              <AiOutlinePlus className="text-primary" size={24} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white flex flex-col w-full py-2 px-0">
            {/* Dialog para Unirse a una clase */}
            <Dialog open={joinIsOpen} onOpenChange={setJoinIsOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <button className="h3 hover:bg-primary-hover w-40 px-3 py-3 text-left">
                    Unirse a una clase
                  </button>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="rounded-md bg-white">
                {/* Join Room */}
                <JoinRoom setOpen={setJoinIsOpen} />
              </DialogContent>
            </Dialog>
            <Dialog open={createIsOpen} onOpenChange={setCreateIsOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <button className="h3 hover:bg-primary-hover w-40 px-3 py-3 text-left">
                    Crear sala
                  </button>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="rounded-md bg-white">
                {/* Create Room */}
                <CreateRoom setOpen={setCreateIsOpen} />
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className='p-2 hover:bg-third rounded-full'>
          <CgMenuGridO className='text-primary' size={24} />
        </div>
        <UserInfo />
      </div>
    </header>
  )
}

export default Header