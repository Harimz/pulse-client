import { z } from "zod";

export const publicUserProfileResponseSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  displayName: z.string(),
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  isFollowing: z.boolean(),
  followers: z.number(),
  following: z.number(),
});

export type PublicUserProfileResponse = z.infer<
  typeof publicUserProfileResponseSchema
>;
