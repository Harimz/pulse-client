import { z } from "zod";

export const postResponseSchema = z.object({
  id: z.string().uuid(),

  author: z.object({
    id: z.string().uuid(),
    username: z.string(),
    avatar: z.string().nullable(),
    displayName: z.string(),
  }),

  body: z.string(),

  createdAt: z.string(),

  mentions: z.array(z.string()),

  likesCount: z.number(),
  commentCount: z.number(),

  likedByMe: z.boolean().optional(),
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

export const commentAuthorSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
});

export type CommentAuthor = z.infer<typeof commentAuthorSchema>;

export const commentResponseSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  author: commentAuthorSchema,
  body: z.string(),
  createdAt: z.string(),
});

export type CommentResponse = z.infer<typeof commentResponseSchema>;

export const commentsCursorPageResponseSchema = z.object({
  items: z.array(commentResponseSchema),
  nextCursor: z.string().nullable().optional(),
});

export type CommentsCursorPageResponse = z.infer<
  typeof commentsCursorPageResponseSchema
>;

export const createCommentRequestSchema = z.object({
  body: z.string().trim().min(1, "Comment cannot be empty"),
});

export type CreateCommentRequest = z.infer<typeof createCommentRequestSchema>;
