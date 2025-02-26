import type { Request, Response, NextFunction } from "express";
import { oauth2Client } from "../utils/googleClient";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  // Si no hay accessToken ni refreshToken, se responde con 401 y se termina el flujo
  if (!accessToken && !refreshToken) {
    res.status(401).json({ error: "Access token and refresh token are required" });
    return; // Detenemos el flujo aquí, evitando retornar un Response
  }

  try {
    // Si existe access token, validarlo
    if (accessToken) {
      // const tokenInfo = await oauth2Client.getTokenInfo(accessToken);
      // console.log(tokenInfo);

      // if (tokenInfo) {
      //   return next(); // Si el token es válido, continuamos al siguiente middleware
      // }
      return next()
    }

    // Aquí va el proceso de refrescar el token si es necesario
    if (!refreshToken) {
      res.status(401).json({ error: "Refresh token is missing" });
      return; // Detenemos el flujo si no hay refreshToken
    }

    // Renovar el token de acceso
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { token } = await oauth2Client.getAccessToken();

    if (!token) {
      res.status(401).json({ error: "Failed to refresh access token" });
      return; // Detenemos el flujo si no se pudo obtener el token
    }

    // Actualizar el access_token en las cookies
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Asegúrate de que se usa HTTPS en producción
      maxAge: 3600000, // 1 hora
      sameSite: "strict",
    });

    // Propagar el token actualizado en la request
    req.cookies.access_token = token;

    return next(); // Llamamos a next() para pasar al siguiente middleware
  } catch (error) {
    console.error("Error validando o refrescando el token:", error);
    res.status(500).json({ error: "Token validation or refresh failed" });
  }
};
