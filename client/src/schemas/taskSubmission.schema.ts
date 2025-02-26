import { z } from "zod";

export const taskSubmissionFilesSchema = z.object({
  id: z.number().int().positive(), // @id @default(autoincrement())
  id_task_submission: z.number().int().positive(), // id_task_submission Int
  url: z.string(), // url String
  thumbnailLink: z.string(), // thumbnailLink String
  id_file: z.string(), // id_file String
  name: z.string(), // name String
  type: z.string(), // type String
});

export const taskSubmissionSchema = z.object({
  id: z.number().int().positive(), // @id @default(autoincrement())
  score: z.number().int().nullable(), // score Int? (puede ser null)
  id_task: z.number().int().positive(), // id_task Int
  id_creator: z.number().int().positive(), // id_creator Int
  createdAt: z.date().optional(), // createdAt DateTime @default(now())
  updatedAt: z.date().optional(), // updatedAt DateTime @default(now()) @updatedAt
  task_submission_files: z.array(taskSubmissionFilesSchema)
});


// Inferir el tipo TypeScript a partir del esquema Zod
// Inferir el tipo TypeScript a partir del esquema Zod
export type TaskSubmission = z.infer<typeof taskSubmissionSchema>;
export type TaskSubmissionFiles = z.infer<typeof taskSubmissionFilesSchema>;