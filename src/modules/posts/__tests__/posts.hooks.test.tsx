import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { env } from "@/shared/config/env";
import { server } from "@/shared/test/msw/server";
import { renderWithQuery } from "@/shared/test/utils/render";
import { usePostById, usePostComments } from "../api/posts.queries";
import { useCreatePostComment } from "../api/posts.mutations";
import { postsKeys } from "../api/posts.keys";
import type {
  CommentsCursorPageResponse,
  PostResponse,
} from "../domain/posts.schemas";

const postId = "22222222-2222-4222-8222-222222222222";

const QueryConsumer = () => {
  const post = usePostById(postId);
  const comments = usePostComments(postId, 20);

  return (
    <div>
      <div data-testid="post-body">{post.data?.body ?? ""}</div>
      <div data-testid="comments-count">{comments.data?.items.length ?? 0}</div>
    </div>
  );
};

const MutationConsumer = () => {
  const createComment = useCreatePostComment(postId, 20);

  return (
    <button onClick={() => createComment.mutate({ body: "new comment" })}>
      submit
    </button>
  );
};

describe("posts hooks", () => {
  it("loads post detail and first-page comments", async () => {
    server.use(
      http.get(`${env.API_URL}/api/v1/posts/${postId}`, async () => {
        return HttpResponse.json({
          id: postId,
          author: {
            id: "33333333-3333-4333-8333-333333333333",
            username: "alice",
            displayName: "Alice",
            avatar: null,
          },
          body: "post from backend",
          createdAt: "2026-03-03T00:00:00Z",
          mentions: [],
          likesCount: 0,
          commentCount: 1,
          likedByMe: false,
        } satisfies PostResponse);
      }),
      http.get(`${env.API_URL}/api/v1/posts/${postId}/comments`, async () => {
        return HttpResponse.json({
          items: [
            {
              id: "11111111-1111-4111-8111-111111111111",
              postId,
              author: {
                id: "33333333-3333-4333-8333-333333333333",
                username: "alice",
                avatarUrl: null,
              },
              body: "first comment",
              createdAt: "2026-03-03T00:00:00Z",
            },
          ],
          nextCursor: null,
        } satisfies CommentsCursorPageResponse);
      }),
    );

    renderWithQuery(<QueryConsumer />);

    await waitFor(() => {
      expect(screen.getByTestId("post-body")).toHaveTextContent(
        "post from backend",
      );
      expect(screen.getByTestId("comments-count")).toHaveTextContent("1");
    });
  });

  it("prepends new comment and increments detail count in cache", async () => {
    server.use(
      http.post(`${env.API_URL}/api/v1/posts/${postId}/comments`, async () => {
        return HttpResponse.json({
          id: "44444444-4444-4444-8444-444444444444",
          postId,
          author: {
            id: "33333333-3333-4333-8333-333333333333",
            username: "alice",
            avatarUrl: null,
          },
          body: "new comment",
          createdAt: "2026-03-03T00:00:00Z",
        });
      }),
    );

    const { queryClient } = renderWithQuery(<MutationConsumer />);

    queryClient.setQueryData(postsKeys.detail(postId), {
      id: postId,
      author: {
        id: "33333333-3333-4333-8333-333333333333",
        username: "alice",
        displayName: "Alice",
        avatar: null,
      },
      body: "post from backend",
      createdAt: "2026-03-03T00:00:00Z",
      mentions: [],
      likesCount: 0,
      commentCount: 1,
      likedByMe: false,
    } satisfies PostResponse);

    queryClient.setQueryData(postsKeys.comments(postId, 20), {
      items: [],
      nextCursor: null,
    } satisfies CommentsCursorPageResponse);

    await userEvent.click(screen.getByText("submit"));

    await waitFor(() => {
      const detail = queryClient.getQueryData<PostResponse>(
        postsKeys.detail(postId),
      );
      const comments = queryClient.getQueryData<CommentsCursorPageResponse>(
        postsKeys.comments(postId, 20),
      );

      expect(detail?.commentCount).toBe(2);
      expect(comments?.items[0]?.body).toBe("new comment");
    });
  });
});
