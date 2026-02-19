import { createApiClient } from "@/shared/api/api-client";
import { exploreFeedPageSchema } from "../domain/feed.schemas";
import { useAuthStore } from "@/modules/auth/state/auth.store";

export const fetchExplorePage = async (args: {
  cursor?: string | null;
  limit: number;
}) => {
  const { cursor, limit } = args;

  const accessToken = useAuthStore.getState().accessToken;
  const setAccessToken = useAuthStore.getState().setAccessToken;

  const api = createApiClient({
    getAccessToken: () => accessToken,
    setAccessToken,
  });

  const qs = new URLSearchParams();
  qs.set("limit", String(limit));
  if (cursor) qs.set("cursor", cursor);

  const data = await api.requestJson(`/api/v1/feed/explore?${qs.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  return exploreFeedPageSchema.parse(data);
};
