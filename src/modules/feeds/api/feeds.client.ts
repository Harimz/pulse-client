import { createApiClient } from "@/shared/api/api-client";
import { cursorPageResponseSchema } from "../domain/feed.schemas";
import { useAuthStore } from "@/modules/auth/state/auth.store";

type FetchFeedPageArgs = {
  cursor?: string | null;
  limit: number;
};

const getApi = () => {
  const accessToken = useAuthStore.getState().accessToken;
  const setAccessToken = useAuthStore.getState().setAccessToken;

  return createApiClient({
    getAccessToken: () => accessToken,
    setAccessToken,
  });
};

const fetchFeedPage = async (path: string, args: FetchFeedPageArgs) => {
  const { cursor, limit } = args;

  const api = getApi();

  const qs = new URLSearchParams();
  qs.set("limit", String(limit));
  if (cursor) qs.set("cursor", cursor);

  const data = await api.requestJson(`${path}?${qs.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  return cursorPageResponseSchema.parse(data);
};

export const fetchExplorePage = async (args: FetchFeedPageArgs) => {
  return fetchFeedPage("/api/v1/feed/explore", args);
};

export const fetchFollowingPage = async (args: FetchFeedPageArgs) => {
  return fetchFeedPage("/api/v1/feed/following", args);
};
