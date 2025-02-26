import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GoPencil } from "react-icons/go";
import { useUser } from "@/context/UserContext";
import SignOutButton from "./LogoutButton";

const UserInfo = () => {
  const { user: session } = useUser()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='p-1 hover:bg-third rounded-full'>
            <img
              src={session?.photo || "/user-profile.png'"} alt='img'
              width={32} height={32}
              className='rounded-full hover:bg-third'
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='bg-slate-200 mt-2 mr-3 rounded-3xl w-[25em] flex flex-col items-center justify-center'>
          <DropdownMenuLabel><h4 className='h4'>{session?.email}</h4></DropdownMenuLabel>
          <DropdownMenuLabel>
            <div
              className="bg-cover bg-no-repeat h-[80px] w-[80px] rounded-full hover:bg-third relative group"
              style={{
                backgroundImage: `url(${session?.photo || "/user-profile.png'"})`,
              }}
            >
              <button>
                <GoPencil size={24}
                  className='absolute p-1 rounded-full right-0 top-12 bg-white group-hover:bg-primary-hover group-hover:text-blue-600' />
              </button>

            </div>

          </DropdownMenuLabel>
          <DropdownMenuLabel><h2 className='h2 font-normal'>¡Hola, {session?.given_name}!</h2></DropdownMenuLabel>
          <DropdownMenuLabel><button className='h3 py-2 px-4 rounded-xl hover:bg-third bg-transparent border border-black font-normal text-blue-700'>Gestionar tu cuenta de Google</button></DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu >

    </>


  )
}

export default UserInfo
