import { createApiClient } from "@/shared/api/api-client";
import { useAuthStore } from "@/modules/auth/state/auth.store";
import { followUsernameSchema } from "../domain/follows.schemas";

const getApi = () => {
  const accessToken = useAuthStore.getState().accessToken;
  const setAccessToken = useAuthStore.getState().setAccessToken;

  return createApiClient({
    getAccessToken: () => accessToken,
    setAccessToken,
  });
};

export const followUser = async (username: string): Promise<void> => {
  const parsed = followUsernameSchema.parse({ username });
  const api = getApi();

  await api.requestVoid(
    `/api/v1/users/${encodeURIComponent(parsed.username)}/follow`,
    {
      method: "POST",
      credentials: "include",
    },
  );
};

export const unfollowUser = async (username: string): Promise<void> => {
  const parsed = followUsernameSchema.parse({ username });
  const api = getApi();

  await api.requestVoid(
    `/api/v1/users/${encodeURIComponent(parsed.username)}/follow`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
};
