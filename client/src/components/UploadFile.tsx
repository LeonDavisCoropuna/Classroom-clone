import { useCallback } from 'react'
import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { FaGoogleDrive } from 'react-icons/fa'
import { IoSearchOutline } from 'react-icons/io5'
import { Input } from './ui/input'
import { IoMdOptions } from 'react-icons/io'
import { useDropzone } from 'react-dropzone'

interface UploadImageProps {
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadImage = ({ setIsDialogOpen, setUploadedFiles }: UploadImageProps) => {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setIsDialogOpen(false); // Cierra el diálogo después de subir archivos
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <DialogContent className="bg-white max-w-[67em] h-[40em] flex flex-col justify-between w-full">
      <DialogHeader>
        <DialogTitle>
          <div className="flex items-center w-full gap-x-4">
            <FaGoogleDrive size={36} />
            <h4 className="h3 font-medium">Insertar archivos con Google Drive</h4>
            <div className="flex items-center gap-x-3 ml-4 shadow-md px-4 border border-third rounded-md">
              <IoSearchOutline size={24} />
              <Input className="w-80 h3" placeholder="Buscar en Drive o pegar la URL"></Input>
              <div className="p-2">
                <IoMdOptions className="cursor-pointer rounded-full hover:bg-third p-2" size={40} />
              </div>
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>
      <nav className="h-12 border-b-third border-b flex items-center">
        <h4 className={`text-[14px] text-second hover:text-primary  h-full font-medium flex items-center pr-4 leading-none hover:bg-third`}>
          Reciente
        </h4>
        <h4 className={`text-[14px] hover:text-primary h-full font-medium flex items-center px-4 leading-none border-b-4 border-b-[#185ABC] text-[#185ABC] hover:bg-primary-hover`}>
          Subir
        </h4>
        <h4 className={`text-[14px] text-second hover:text-primary  h-full font-medium flex items-center px-4 leading-none hover:bg-third`}>
          Mi unidad
        </h4>
        <h4 className={`text-[14px] text-second hover:text-primary  h-full font-medium flex items-center px-4 leading-none hover:bg-third`}>
          Destacados
        </h4>
        <h4 className={`text-[14px] text-second hover:text-primary  h-full font-medium flex items-center px-4 leading-none hover:bg-third`}>
          Compartidos conmigo
        </h4>
      </nav>
      <div {...getRootProps()} className="h-full justify-center flex flex-col items-center group">
        <input {...getInputProps()} />
        <>
          <img src="/upload_background.png" alt="img" height={240} width={240} />
          <button className="px-6 bg-[#0277bd] text-white rounded-sm mt-8 group-hover:bg-blue-600">Examinar</button>
          <h4 className="h3">O arrastre los archivos aqui</h4>
        </>
      </div>
    </DialogContent>
  )
}

export default UploadImage