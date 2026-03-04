import { z } from "zod";

export const notificationFromUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
});

export const notificationResponseSchema = z.object({
  id: z.string().uuid(),
  toUserId: z.string().uuid(),
  type: z.string(),
  payloadJson: z.string(),
  createdAt: z.string(),
  readAt: z.string().nullable(),
  fromUser: notificationFromUserSchema.nullable(),
});

export type NotificationResponse = z.infer<typeof notificationResponseSchema>;

export const notificationsCursorPageSchema = z.object({
  items: z.array(notificationResponseSchema),
  nextCursor: z.string().nullable().optional(),
});

export type NotificationsCursorPage = z.infer<
  typeof notificationsCursorPageSchema
>;

export const unreadCountSchema = z.number().int().nonnegative();
