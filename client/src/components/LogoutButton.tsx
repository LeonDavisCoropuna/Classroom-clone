import axios from '@/config/axios';
import { useUser } from '@/context/UserContext';
import { MdOutlineLogout } from 'react-icons/md';

const SignOutButton = () => {
  const { setUser } = useUser()
  const handleSignOut = async () => {
    // Eliminar todas las cookies
    try {
      await axios.post("/auth/logout")
      localStorage.removeItem("user")
      setUser(null)
      window.location.reload()
    } catch (err) {
      console.error('Error al obtener la URL de autenticación:', err);
    }
    localStorage.removeItem("user")
  };

  return (
    <button
      className='flex items-center justify-center gap-x-2 py-3 px-6 border border-third bg-white hover:bg-third rounded-xl'
      onClick={handleSignOut}
    >
      Signout <MdOutlineLogout />
    </button>
  );
};

export default SignOutButton;
