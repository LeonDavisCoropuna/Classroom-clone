import CourseCard from "@/components/CourseCard";
import { useCourses } from "@/context/CourseContext";

export default function Home() {
  const { courses } = useCourses();
  return (
    <div className="p-6 grid grid-cols-4 gap-7">
      {Array.isArray(courses) && courses.length > 0 && courses.map((item, index) => (
        <CourseCard course={item} key={index} />
      ))}
    </div>
  );
}