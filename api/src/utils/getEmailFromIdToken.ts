import { oauth2Client } from "./googleClient";

// Función para obtener el email del id_token
export const getEmailFromIdToken = async (idToken: string) => {
  const ticket = await oauth2Client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload?.email || null;
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await oauth2Client.refreshAccessToken();
    return credentials.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};