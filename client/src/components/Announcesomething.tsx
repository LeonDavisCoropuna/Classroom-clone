import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Textarea } from './ui/textarea';
import { RiUpload2Line } from "react-icons/ri";
import { IoMdLink } from "react-icons/io";
import { useState } from 'react';
import { LuTrash2 } from "react-icons/lu";

import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUser } from '@/context/UserContext';
import axios from '@/config/axios';
import { useLocation } from 'react-router-dom';
import { getFileIcon } from '@/utils/getFileIcon';
import UploadImage from './UploadFile';
const Announcesomething = () => {
  const { user: session } = useUser();
  const [text, setText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // Estado para guardar los archivos
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado para el diálogo
  const [accordionOpen, setAccordionOpen] = useState(false); // Controla si el Accordion está abierto o cerrado

  const { pathname } = useLocation()
  const handlePublish = async () => {
    if (text === "" && uploadedFiles.length === 0) {
      alert("Debe añadir texto o archivos antes de publicar.");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("creator_id", session?.id.toString() || "");
    formData.append("creator_name", session?.name || "");
    formData.append("creator_email", session?.email || "");
    formData.append("creator_photo", session?.photo || "");
    formData.append("id_course", pathname.split("/")[2]);

    uploadedFiles.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post("/course/announces", formData);
      if (response.status === 201) {
        alert("Anuncio publicado con éxito.");
        setText("");
        setUploadedFiles([]);
      } else {
        throw new Error("Error al publicar el anuncio.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al publicar el anuncio.");
    }
  };


  return (
    <div className="w-full">
      <Accordion type="single" value={accordionOpen ? "item-1" : ""} onValueChange={(value) => setAccordionOpen(value === "item-1")}>
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex">
            <img src={session?.photo || "/google-logo.png"} alt="img" width={40} height={40} className="rounded-full" />
            <h4 className="h4 font-light">Anuncia algo a tu clase</h4>
          </AccordionTrigger>
          <AccordionContent>
            <Textarea className="w-full min-h-[100px]" onChange={(e) => setText(e.target.value)} value={text} />
            <div className="mt-4">
              {uploadedFiles.length > 0 && (
                <div className="border-t border-gray-300 pt-4">
                  <ul className="space-y-3 w-full">
                    {uploadedFiles.map((file: File, index) => (
                      <li key={index} className="gap-x-2 border border-third w-full rounded-lg flex items-center justify-between px-8">
                        <div className='flex items-center gap-6 overflow-hidden'>
                          <div className='py-4 pr-8 border-r border-third '>
                            {getFileIcon(file)}
                          </div>
                          <span className="h4 truncate">{file.name}</span>
                        </div>
                        <LuTrash2 size={48} onClick={() => {
                          setUploadedFiles(uploadedFiles.filter((_, index_file) => index_file !== index));
                        }} className='cursor-pointer rounded-full hover:bg-third p-2' />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <div className="flex gap-x-3 px-3">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger>
                    <div className="p-2 hover:bg-third rounded-full cursor-pointer"><RiUpload2Line size={24} /></div>
                  </DialogTrigger>
                  <UploadImage setIsDialogOpen={setIsDialogOpen} setUploadedFiles={setUploadedFiles} />
                </Dialog>
                <button className="p-2 hover:bg-third rounded-full"><IoMdLink size={27} /></button>
              </div>
              <div className="flex gap-x-4">
                <button className="px-8" onClick={() => setAccordionOpen(false)}>Cancelar</button>
                <button className="px-8 bg-[#0277bd] text-white rounded-sm" onClick={handlePublish}>Publicar</button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div >
  );
};

export default Announcesomething;
