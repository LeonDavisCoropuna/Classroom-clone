import { Course } from '@/schemas/course.schema';
import { BsPersonVideo2 } from "react-icons/bs";
import { FaRegFolder } from "react-icons/fa";
import { Link } from 'react-router-dom';

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <Link to={`/courses/${course.id}`} className='w-[18.75em] h-[18.375em] rounded-md border border-third relative flex justify-between flex-col'>
      {/* header */}
      <div
        className="h-24 rounded-t-md p-4 flex flex-col justify-between"
        style={{
          backgroundImage: `url('/themes/classroom-themes-${course.id % 6}.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <h2 className='h2 overflow-hidden text-ellipsis whitespace-nowrap'>
          {course.course_name}
        </h2>
        <h4 className='text-primary h4 max-w-[15em] overflow-hidden text-ellipsis whitespace-nowrap'>
          {course.creator?.name}
        </h4>
      </div>

      <img src={course.creator?.photo} alt='Photo' width={72} height={72} className='absolute top-[60px] right-[20px] rounded-full' />

      <div className='flex justify-end w-full border border-third gap-x-7 py-4'>
        <BsPersonVideo2 size={24} />
        <FaRegFolder size={24} className='mr-5' />
      </div>
    </Link>

  )
}

export default CourseCard