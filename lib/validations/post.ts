import { z } from "zod";

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  status: z.enum(["draft", "published"]),
  content: z.any(),
  authorId: z.string(),
  publishedAt: z.string().optional(),
  updatedAt: z.string(),
});

export type Post = z.infer<typeof PostSchema>;
