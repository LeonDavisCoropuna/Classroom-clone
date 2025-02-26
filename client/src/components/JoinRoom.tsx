import React, { useState } from 'react';
import { DialogHeader } from './ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Input } from './ui/input';
import { useUser } from '@/context/UserContext';
import axios from '@/config/axios';
import { Link } from 'react-router-dom';
import { courseUsersSchema } from '@/schemas/course_user.schema';

interface JoinRoomProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const JoinRoom = ({ setOpen }: JoinRoomProps) => {
  const { user: session } = useUser();
  const [codeClass, setCodeClass] = useState('');
  const [error, setError] = useState<string | null>(null);


  const handleJoinRoom = async () => {
    // Validación del código de la clase
    const validation = courseUsersSchema.safeParse({
      id: 0,
      id_course: 0,
      id_user: session?.id,
      role: "student",
      user_photo: session?.photo,
      user_email: session?.email,
      code_class: codeClass,
      
    });

    if (!validation.success) {
      console.log(validation.error.errors[0])
      setError(validation.error.errors[0].message);
      return;
    }
    console.log(validation.data)
    setError(null); // Limpia errores si la validación pasa

    try {
      // Llamada al endpoint para unirse a la clase
      const res = await axios.post('/course/join-room', validation.data);
      console.log('Clase unida exitosamente:', res.data);

      // Cierra el modal después de unirse a la clase
      setOpen(false);
    } catch (error) {
      console.error('Error al unirse a la clase:', error);
      setError('No se pudo unir a la clase. Por favor, verifica el código e inténtalo nuevamente.');
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <p className="h3 font-medium pt-2">Unirse a clase</p>
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col py-5 px-6 border border-third rounded-md max-w-[32em]">
        <h4 className="h3 text-primary font-light mb-3">Accediste como</h4>
        <div className="flex gap-x-4 w-full justify-center items-center">
          <img
            src={session?.photo || '/user-profile.png'}
            alt="img"
            className="rounded-full w-8 h-8"
            width={32}
            height={32}
          />
          <div className="leading-4">
            <div className="h4 font-medium m-0">{session?.name}</div>
            <div className="h4 m-0">{session?.email}</div>
          </div>
          <button className="ml-3 h4 font-medium hover:bg-primary-hover text-[#277be9] border border-third px-4 py-1 rounded-md">
            Cambiar de cuenta
          </button>
        </div>
      </div>

      <div className="flex flex-col py-5 border border-third rounded-md px-6 max-w-[32em]">
        <div className="leading-4 pb-6">
          <div className="h4 font-medium m-0">Código de la clase</div>
          <div className="h4 m-0">
            Pídele a tu profesor el código de la clase y, luego, ingrésalo aquí.
          </div>
          <Input
            placeholder="Código de la clase"
            className="py-4 w-auto rounded-sm border border-primary mt-4 px-4 placeholder:h3 h3"
            onChange={(e) => setCodeClass(e.target.value)}
            value={codeClass}
          />
          {error && <p className="text-red-500 mt-2 h4">{error}</p>}
        </div>
      </div>

      <div className="flex flex-col py-5 px-6 max-w-[32em]">
        <div className="h4 font-medium m-0">Para acceder con un código de la clase</div>
        <ul className="list-disc ml-5 leading-5">
          <li className="h5 my-3">Usa una cuenta autorizada.</li>
          <li className="h5">
            Usa un código de la clase que tenga exactamente 6 letras o números, sin espacios ni símbolos.
          </li>
        </ul>
        <h4 className="h5 leading-5 py-2">
          Si tienes problemas para unirte a la clase, consulta este{' '}
          <Link
            to="https://support.google.com/edu/classroom/answer/15605102?hl=es-419&authuser=0&visit_id=638723146179803456-2209826793&rd=1"
            className="text-aux leading-none border-b border-aux"
          >
            artículo del Centro de ayuda.
          </Link>
        </h4>
      </div>

      <div className="flex w-full justify-end gap-2">
        <button
          onClick={() => setOpen(false)}
          className="h5 px-4 hover:border-third rounded-md py-1"
        >
          Cancelar
        </button>
        <button
          onClick={handleJoinRoom}
          className="h5 text-aux hover:bg-third px-4 hover:border-third rounded-md py-1"
        >
          Unirte
        </button>
      </div>
    </>
  );
};

export default JoinRoom;
