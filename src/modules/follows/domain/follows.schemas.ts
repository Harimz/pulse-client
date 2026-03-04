import { z } from "zod";

export const followUsernameSchema = z.object({
  username: z.string().trim().min(1),
});

export type FollowUsernameInput = z.infer<typeof followUsernameSchema>;
