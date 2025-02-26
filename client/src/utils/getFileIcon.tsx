import { Task_files } from "@/schemas/task.schema";

// Función para obtener la URL de la imagen
export const getImageUrl = async (url: string) => {
  const cachedImage = localStorage.getItem(url);
  if (cachedImage) {
    return cachedImage;  // Si la imagen está en el localStorage, devuelve la URL
  }

  try {
    const response = await fetch(url);  // Si no está en cache, realiza la solicitud
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);  // Crea una URL del blob
    localStorage.setItem(url, imageUrl);  // Guarda la URL en el localStorage para futuras referencias
    return imageUrl;
  } catch (error) {
    console.error("Error al obtener la imagen:", error);
    return url;  // Si hay un error, retorna la URL original (de Google Drive, por ejemplo)
  }
};

export const getFileIcon = (file: File | Task_files) => {
  if (file.type.includes("image")) {
    const imageUrl = file instanceof File ? URL.createObjectURL(file) : file.url || file.thumbnailLink;
    return (
      <img 
        src={imageUrl} 
        alt={file.name} 
        className="w-32 h-16 object-contain rounded-l-md rounded-md" 
      />
    );
  }

  // Default para otros tipos de archivo
  return (
    <div className="w-32 flex items-center justify-center">
      <img src="/drive-logo.png" alt="default-icon" className="text-gray-500" />
    </div>
  );
};

export const getAssignmentFile = (file: File | Task_files) => {
  if (file.type.includes("image")) {
    const imageUrl = file instanceof File ? URL.createObjectURL(file) : file.url || file.thumbnailLink;
    return (
      <img 
        src={imageUrl} 
        alt={file.name} 
        className="h-[3.4em] w-[3.5em] object-contain rounded-l-md rounded-md" 
      />
    );
  }

  // Default para otros tipos de archivo
  return (
    <div className="w-[3.2em] flex items-center justify-center">
      <img src="/drive-logo.png" alt="default-icon" className="text-gray-500" />
    </div>
  );
};