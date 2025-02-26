import { z } from "zod";
import { userSchema } from "./user.schema";

export const CommentSchema = z.object({
  id: z.number().int().positive().optional(), // ID autoincremental
  text: z.string().min(1, "El texto no puede estar vacío"), // Texto del comentario
  id_creator: z.number().int().positive(), // ID del creador (requerido)
  id_recipient: z.number().int().positive().nullable(), // ID del receptor (opcional)
  id_task: z.number().int().positive(), // ID de la tarea asociada (requerido)
  is_private: z.boolean(), // Indica si el comentario es privado
  createdAt: z.date().optional(), // Fecha de creación
  updatedAt: z.date().optional(), // Fecha de actualización
  sender: userSchema.optional(),
  recipient: userSchema.optional()
});

// Inferir el tipo TypeScript a partir del esquema Zod
export type Comment = z.infer<typeof CommentSchema>;