import axiosBase from "axios";

const axios = axiosBase.create({
  baseURL: "http://localhost:3000/api",
  timeout: 60000,
  withCredentials: true
})

axios.interceptors.response.use(
  (response) => response,  // Si la respuesta es exitosa, se pasa normalmente
  async (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Si el token ha expirado o el usuario no está autenticado
      console.log('Token expirado o no autorizado. Redirigiendo al login.');

      try {
        const { data: url } = await axios.post('/auth/google');  // Solicitar el URL de autenticación
        window.location.href = url.url;  // Redirigir al flujo de autenticación
      } catch (err) {
        console.error('Error al obtener la URL de autenticación:', err);
      }
    }

    // Si el error no es 401/403, se propaga el error
    return Promise.reject(error);
  }
);


export default axios