import { z } from "zod";

export const postResponseSchema = z.object({
  id: z.string().uuid(),

  author: z.object({
    id: z.string().uuid(),
    username: z.string(),
    avatar: z.string().nullable(),
  }),

  body: z.string(),

  createdAt: z.string(),

  mentions: z.array(z.string()),

  likesCount: z.number(),
  commentCount: z.number(),
});

export type PostResponse = z.infer<typeof postResponseSchema>;

export const createPostRequestSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Post cannot be empty")
    .max(2000, "Max 2000 characters"),
});

export type CreatePostRequest = z.infer<typeof createPostRequestSchema>;
