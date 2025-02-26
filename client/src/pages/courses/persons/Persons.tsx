import { usePersons } from "@/hooks/usePersons";
import { useParams } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";

const PersonsPage = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const { persons } = usePersons(courseId || "")
  return (
    <section className="flex flex-col items-center py-4">
      <div className="w-[47.5em]">
        <h1 className="h1 w-full px-4">Profesores</h1>
        <div className="border-b border-third w-full" />
        {persons.map((person) => {
          if (person.role === "teacher")
            return (
              <>
                <article key={person.user.id} className="flex justify-between items-center w-full px-4">
                  <div className="flex gap-4 py-4">
                    <img
                      src={person.user?.photo || "/user-profile.png'"} alt='img'
                      width={32} height={32}
                      className='rounded-full hover:bg-third'
                    />
                    <h4>{person.user.name}</h4>
                  </div>
                  <div className="p-2 cursor-pointer rounded-full hover:bg-third">
                    <MdOutlineEmail size={24} color="black" />
                  </div>                </article>
                <div className="border-b border-third w-full" />
              </>
            ) 
        })}
        <h1 className="h1 mt-5  w-full px-4">Compañeros de clase</h1>
        <div className="border-b border-third w-full" />
        {persons.map((person) => {
          if (person.role === "student")
            return (
              <>
                <article key={person.user.id} className="flex justify-between items-center w-full px-4">
                  <div className="flex gap-4 py-4">
                    <img
                      src={person.user?.photo || "/user-profile.png'"} alt='img'
                      width={32} height={32}
                      className='rounded-full hover:bg-third'
                    />
                    <h4>{person.user.name}</h4>
                  </div>
                  <div className="p-2 cursor-pointer rounded-full hover:bg-third">
                    <MdOutlineEmail size={24} color="black" />
                  </div>
                </article>
                <div className="border-b border-third w-full" />
              </>
            )
        })}
      </div>
    </section>
  );
};

export default PersonsPage