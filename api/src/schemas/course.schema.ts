import { z } from "zod";

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
});

// Inferir la interfaz de TypeScript
export type Course = z.infer<typeof courseSchema>;
