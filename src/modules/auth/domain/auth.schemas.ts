import { z } from "zod";

export const authResponseSchema = z.object({
  accessToken: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const registerRequestSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const loginRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const meResponseSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  profile: z.object({
    displayName: z.string().nullable(),
    bio: z.string().nullable(),
    avatarUrl: z.string().url().nullable(),
  }),
});

export type MeResponse = z.infer<typeof meResponseSchema>;
