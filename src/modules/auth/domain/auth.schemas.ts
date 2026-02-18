import { z } from "zod";

export const authResponseSchema = z.object({
  accessToken: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const registerRequestSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(32, "Username cannot exceed 32 characters"),

    email: z.string().email("Must be a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password cannot exceed 72 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    displayName: z
      .string()
      .min(1, "Display name is required")
      .max(80, "Display name cannot exceed 80 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const loginRequestSchema = z.object({
  email: z.string().min(1, "Email is required"),

  password: z.string().min(1, "Password is required"),
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
