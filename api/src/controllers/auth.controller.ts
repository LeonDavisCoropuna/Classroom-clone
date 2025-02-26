import { type Request, type Response } from "express";
import { oauth2Client, scopes } from "../utils/googleClient";
import axios from "axios";
import { setCommonHeaders } from "../utils/setHeaders"; // Importa la función
import prisma from "../lib/db";
import { google } from "googleapis";
import jwt from "jsonwebtoken"; // Asegúrate de importar JwtPayload

export const getUserData = async (req: Request, res: Response): Promise<void> => {
  setCommonHeaders(res);

  try {
    const accessToken = req.cookies.access_token; // Obtener el token de la cookie

    if (!accessToken) {
      res.status(401).json({ error: 'Access token is required' });
      return;
    }

    // Solicitar los datos del usuario a la API de Google
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Pasar el token de acceso en el header
      },
    });

    const { sub, name, email, picture, given_name, family_name } = response.data;

    // Validar si el usuario ya existe en la base de datos
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Si el usuario no existe, crearlo en la base de datos
    if (!user) {
      // Autenticación con Google Drive
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken }); // Usar el token del usuario para autenticación

      const drive = google.drive({ version: "v3", auth });

      // Crear la carpeta "Classroom clone" en Google Drive
      const folderResponse = await drive.files.create({
        requestBody: {
          name: "Classroom clone",
          mimeType: "application/vnd.google-apps.folder",
        },
        fields: "id",
      });

      const folderId = folderResponse.data.id || "";

      // Crear el nuevo usuario en la base de datos con el folder_id
      user = await prisma.user.create({
        data: {
          sub,
          name,
          email,
          given_name,
          family_name,
          photo: picture,
          folder_id: folderId, // Almacenar el folder_id en la tabla user
        },
      });

      console.log('Nuevo usuario creado:', user);
    } else {
      console.log('Usuario existente encontrado:', user);
    }

    // Enviar el usuario de la base de datos (incluyendo el id y el folder_id) al frontend
    res.status(200).json(user);
    return;
  } catch (error) {
    console.error('Error obteniendo los datos del usuario:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};


export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.query.code as string;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Almacenar el refresh_token en la base de datos
    let userEmail: string | null = null;

    if (tokens.id_token) {
      const decodedToken = jwt.decode(tokens.id_token);

      // Verificar si decodedToken es un objeto (JwtPayload) y tiene la propiedad email
      if (decodedToken && typeof decodedToken === "object" && "email" in decodedToken) {
        userEmail = decodedToken.email;
      }
    }

    if (userEmail && tokens.refresh_token) {
      await prisma.user.update({
        where: { email: userEmail },
        data: { refresh_token: tokens.refresh_token },
      });
    }

    const maxAge = tokens.expiry_date ? tokens.expiry_date - Date.now() : 3600000;

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge,
      sameSite: 'strict',
    });

    if (userEmail && tokens.refresh_token) {
      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días o lo que necesites
        sameSite: 'strict',
      });
    }

    res.redirect(`http://localhost:5173`);  // Redirige al cliente
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to authenticate" });
  }
};


export const googleUrl = async (req: Request, res: Response) => {
  setCommonHeaders(res)

  // Generate the url that will be used for the consent dialog.
  const authorizeUrl = await oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  res.json({ url: authorizeUrl })

};

export const logout = async (req: Request, res: Response) => {
  setCommonHeaders(res)
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: true, // Asegúrate de usar esto en producción
    sameSite: 'strict', // Opcional, según tu caso
  });
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: true, // Asegúrate de usar esto en producción
    sameSite: 'strict', // Opcional, según tu caso
  });
  res.status(200).send({ message: 'Logout successful' });
};