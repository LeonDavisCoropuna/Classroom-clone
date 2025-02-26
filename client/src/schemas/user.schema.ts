import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  sub: z.string(),
  name: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  email: z.string().email(),
  photo: z.string().url(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
// Inferir la interfaz de TypeScript
export type User = z.infer<typeof userSchema>;
