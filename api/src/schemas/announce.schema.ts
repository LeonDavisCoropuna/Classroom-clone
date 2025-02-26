import { z } from "zod";

// Esquema para los archivos asociados a un anuncio
export const announceFilesSchema = z.object({
  id: z.number(),
  id_announce: z.number(),
  url: z.string().url(),
  thumbnailLink: z.string().url(),
  id_file: z.string(),
  name: z.string(),
  type: z.string(),
});



// Esquema para un anuncio
export const announceSchema = z.object({
  id: z.number().optional(),
  creator_id: z.number(),
  id_course: z.number(),
  text: z.string(),
  createdAt: z.date().optional(),
});

// Inferencia de la interfaz para AnnounceFile
export type AnnounceFile = z.infer<typeof announceFilesSchema>;

// Inferencia de la interfaz para Announce
export type Announce = z.infer<typeof announceSchema>;
