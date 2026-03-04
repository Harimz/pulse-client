import { describe, expect, it } from "vitest";
import {
  commentsCursorPageResponseSchema,
  createCommentRequestSchema,
} from "../domain/posts.schemas";

describe("posts schemas", () => {
  it("parses comments cursor page payload", () => {
    const parsed = commentsCursorPageResponseSchema.parse({
      items: [
        {
          id: "11111111-1111-4111-8111-111111111111",
          postId: "22222222-2222-4222-8222-222222222222",
          author: {
            id: "33333333-3333-4333-8333-333333333333",
            username: "alice",
            avatarUrl: null,
          },
          body: "hello",
          createdAt: "2026-03-03T00:00:00Z",
        },
      ],
      nextCursor: null,
    });

    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0].author.username).toBe("alice");
  });

  it("rejects empty comment body", () => {
    const result = createCommentRequestSchema.safeParse({ body: "   " });
    expect(result.success).toBe(false);
  });
});
