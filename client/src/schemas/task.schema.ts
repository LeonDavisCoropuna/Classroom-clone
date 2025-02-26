import { z } from 'zod';
import { userSchema } from './user.schema';


// Definimos el schema para el objeto "topic"
export const topicSchema = z.object({
  id: z.number(),
  id_course: z.number(),
  name: z.string(),
});

export const taskFilesSchema = z.object({
  id: z.number().int().positive(), // @id @default(autoincrement())
  id_task: z.number().int().positive(), // id_task Int
  url: z.string(), // url String
  thumbnailLink: z.string(), // thumbnailLink String
  id_file: z.string(), // id_file String
  name: z.string(), // name String
  type: z.string(), // type String
});

// Definimos el schema para el objeto principal
export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  deadline: z.string().datetime().nullable(),
  points: z.number(),
  id_course: z.number(),
  creator_id: z.number(),
  topic_id: z.number().or(z.null()),
  lockSubmissions: z.boolean(),
  instructions: z.string(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  task_files: z.array(taskFilesSchema), // Puedes ajustar esto según la estructura real de los archivos
  files: z.array(z.any()),
  topic: topicSchema.optional(),
  creator: userSchema.optional(),
});

// Inferimos la interfaz TypeScript a partir del schema
export type Task = z.infer<typeof taskSchema>;
export type Topic = z.infer<typeof topicSchema>;
export type Task_files = z.infer<typeof taskFilesSchema>