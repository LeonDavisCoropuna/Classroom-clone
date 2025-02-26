import express from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import courseRoutes from "./routes/course.routes"
import taskRoutes from "./routes/task.routes"
import topicRoutes from "./routes/topic.routes"
import commentRoutes from "./routes/comment.routes"
import submissionRoutes from "./routes/submission.routes"

import cors from "cors"; // Importa el paquete cors
import cookieParser from 'cookie-parser';
import { refreshTokenMiddleware } from "./middleware/refreshTokenMiddleware";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Dirección permitida
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  credentials: true, // Para permitir el envío de cookies o credenciales
};

app.use(cors(corsOptions)); // Aplicar las opciones de CORSapp.use(cookieParser());
app.use(cookieParser());

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/course", refreshTokenMiddleware, courseRoutes);
app.use("/api/task", refreshTokenMiddleware, taskRoutes);
app.use("/api/comment", refreshTokenMiddleware, commentRoutes);
app.use("/api/topic", refreshTokenMiddleware, topicRoutes);
app.use("/api/submission", refreshTokenMiddleware, submissionRoutes);

// Ruta raíz
app.get("/", (_, res) => {
  res.status(200).json({
    message: "Server is up and running!",
    success: true,
  });
});

export default app;
