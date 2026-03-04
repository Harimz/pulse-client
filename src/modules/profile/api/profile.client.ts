import {
  publicUserProfileResponseSchema,
  type PublicUserProfileResponse,
} from "../domain/profile.schemas";
import { useAuthStore } from "@/modules/auth/state/auth.store";
import {
  cursorPageResponseSchema,
  type CursorPageResponse,
} from "@/modules/feeds/domain/feed.schemas";
import { createApiClient } from "@/shared/api/api-client";

export const getPublicProfile = async (
  username: string,
  opts?: { cookie?: string },
) => {
  const accessToken = useAuthStore.getState().accessToken;
  const setAccessToken = useAuthStore.getState().setAccessToken;

  const api = createApiClient({
    getAccessToken: () => accessToken,
    setAccessToken,
    cookie: opts?.cookie,
  });

  const data = await api.requestJson<PublicUserProfileResponse>(
    `/api/v1/users/${encodeURIComponent(username)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return publicUserProfileResponseSchema.parse(data);
};

export const getProfilePosts = async (username: string, limit = 10) => {
  const accessToken = useAuthStore.getState().accessToken;
  const setAccessToken = useAuthStore.getState().setAccessToken;

  const api = createApiClient({
    getAccessToken: () => accessToken,
    setAccessToken,
  });

  const data = await api.requestJson<CursorPageResponse>(
    `/api/v1/users/${encodeURIComponent(username)}/posts?limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return cursorPageResponseSchema.parse(data);
};
