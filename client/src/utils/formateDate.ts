export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    return ""; // Retorna una cadena vacía si la fecha es inválida
  }

  // Opciones para formatear la fecha
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  // Formatear la fecha en español
  return date.toLocaleDateString("es-ES", options);
};