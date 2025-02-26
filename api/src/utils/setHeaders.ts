import { type Response } from "express";

// Función para configurar los encabezados
export const setCommonHeaders = (res: Response) => {
  res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header("Referrer-Policy", "no-referrer-when-downgrade");
};
