import { z } from "zod";

// Schema for creating a new post
export const CreatePostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  status: z.enum(["draft", "published"]),
  content: z.any(),
  author: z.string().min(1, "Author is required"),
  thumbnail: z.string().optional(),
  categoryIds: z.array(z.string()).optional().default([]),
});

// Schema for updating a post (all fields optional)
export const UpdatePostSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  status: z.enum(["draft", "published"]).optional(),
  content: z.any().optional(),
  author: z.string().min(1).optional(),
  thumbnail: z.string().optional(),
  categoryIds: z.array(z.string()).optional().default([]),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
