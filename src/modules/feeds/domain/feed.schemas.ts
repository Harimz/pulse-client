import { postResponseSchema } from "@/modules/posts/domain/posts.schemas";
import { z } from "zod";

export const cursorPageSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    nextCursor: z.string().nullable().optional(),
  });

export const cursorPageResponseSchema = cursorPageSchema(postResponseSchema);
export type CursorPageResponse = z.infer<typeof cursorPageResponseSchema>;
