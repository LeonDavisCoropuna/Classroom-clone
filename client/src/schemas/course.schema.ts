import { z } from "zod";
import { userSchema } from "./user.schema";

// Definir el esquema con Zod
export const courseSchema = z.object({
  id: z.number(),
  course_name: z.string(),
  creator_id: z.number(),
  code_class: z.string(),
  description: z.string(),
  section: z.string(),
  subject: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  role: z.string(),
  creator: userSchema.optional()
});

// Inferir la interfaz de TypeScript
export type Course = z.infer<typeof courseSchema>;
