import { type Request, type Response } from "express";
import { google } from "googleapis";
import { oauth2Client } from "../utils/googleClient";

export const getUserInfo = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
  }

  try {
    oauth2Client.setCredentials({ access_token: token });

    const oauth2 = google.oauth2("v2");
    const userInfo = await oauth2.userinfo.get({ auth: oauth2Client });

    res.status(200).json(userInfo.data);
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ error: "Failed to fetch user information" });
  }
};
