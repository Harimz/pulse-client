import { useAuthStore } from "@/modules/auth/state/auth.store";
import {
  commentResponseSchema,
  commentsCursorPageResponseSchema,
  createCommentRequestSchema,
  createPostRequestSchema,
  type CommentsCursorPageResponse,
  type CreateCommentRequest,
  postResponseSchema,
  type CommentResponse,
  type CreatePostRequest,
  type PostResponse,
} from "../domain/posts.schemas";
import { createApiClient } from "@/shared/api/api-client";

const getApi = () => {
  const accessToken = useAuthStore.getState().accessToken;
  const setAccessToken = useAuthStore.getState().setAccessToken;

  return createApiClient({
    getAccessToken: () => accessToken,
    setAccessToken,
  });
};

export const createPost = async (
  input: CreatePostRequest,
): Promise<PostResponse> => {
  const parsed = createPostRequestSchema.parse(input);
  const api = getApi();

  const data = await api.requestJson<PostResponse>("/api/v1/posts", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed),
  });

  return postResponseSchema.parse(data);
};

export const likePost = async (postId: string) => {
  const api = getApi();

  await api.requestVoid(`/api/v1/posts/${postId}/like`, {
    method: "POST",
    credentials: "include",
  });
};

export const unlikePost = async (postId: string) => {
  const api = getApi();

  await api.requestVoid(`/api/v1/posts/${postId}/like`, {
    method: "DELETE",
    credentials: "include",
  });
};

export const getPostById = async (postId: string): Promise<PostResponse> => {
  const api = getApi();

  const data = await api.requestJson<PostResponse>(`/api/v1/posts/${postId}`, {
    method: "GET",
    credentials: "include",
  });

  return postResponseSchema.parse(data);
};

export const getPostComments = async (args: {
  postId: string;
  cursor?: string | null;
  limit: number;
}): Promise<CommentsCursorPageResponse> => {
  const api = getApi();
  const qs = new URLSearchParams();
  qs.set("limit", String(args.limit));
  if (args.cursor) qs.set("cursor", args.cursor);

  const data = await api.requestJson<CommentsCursorPageResponse>(
    `/api/v1/posts/${args.postId}/comments?${qs.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return commentsCursorPageResponseSchema.parse(data);
};

export const createPostComment = async (args: {
  postId: string;
  body: string;
}): Promise<CommentResponse> => {
  const api = getApi();
  const parsed = createCommentRequestSchema.parse({
    body: args.body,
  } satisfies CreateCommentRequest);

  const data = await api.requestJson<CommentResponse>(
    `/api/v1/posts/${args.postId}/comments`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(parsed),
    },
  );

  return commentResponseSchema.parse(data);
};
