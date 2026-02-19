import { useAuthStore } from "@/modules/auth/state/auth.store";
import {
  createPostRequestSchema,
  postResponseSchema,
  type CreatePostRequest,
  type PostResponse,
} from "../domain/posts.schemas";
import { createApiClient } from "@/shared/api/api-client";

export const createPost = async (
  input: CreatePostRequest,
): Promise<PostResponse> => {
  const parsed = createPostRequestSchema.parse(input);

  const accessToken = useAuthStore.getState().accessToken;
  const setAccessToken = useAuthStore.getState().setAccessToken;

  const api = createApiClient({
    getAccessToken: () => accessToken,
    setAccessToken,
  });

  const data = await api.requestJson<PostResponse>("/api/v1/posts", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed),
  });

  return postResponseSchema.parse(data);
};
