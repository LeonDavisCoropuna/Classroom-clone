import { z } from "zod"
export const courseUsersSchema = z.object({
  id: z.number().int().optional(),
  id_course: z.number().int(),
  id_user: z.number(),
  role: z.string(),
  createdAt: z.date().optional(),
  code_class: z.string().length(6, 'Los códigos de clase tienen entre 5 y 7 caracteres, incluidas letras y números, y no incluyen espacios ni símbolos.')
});

export type CourseUsers = z.infer<typeof courseUsersSchema>;
