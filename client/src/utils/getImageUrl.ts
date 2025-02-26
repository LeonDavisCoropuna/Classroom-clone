export const getImageUrl = async (url: string) => {
  // Primero, verificamos si la imagen ya está en el caché
  const cachedImage = localStorage.getItem(url);
  if (cachedImage) {
    console.log("cached")
    return cachedImage; // Si la imagen está cacheada, la retornamos
  }
  
  // Si no está en caché, descargamos la imagen
  console.log("noooooo")

  try {
    const response = await fetch(url);
    const blob = await response.blob(); // Obtener los datos binarios de la imagen
    
    // Crear la URL del Blob
    const imageUrl = URL.createObjectURL(blob);
    
    // Almacenar el Blob en el localStorage (ten en cuenta que localStorage solo puede almacenar cadenas)
    localStorage.setItem(url, imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error("Error al obtener la imagen:", error);
    return url; // En caso de error, retornamos la URL original
  }
};
