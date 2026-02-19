import { useQuery } from "@tanstack/react-query";
import { createApiClient } from "@/shared/api/api-client";
import { useAuthStore } from "../state/auth.store";
import { meResponseSchema, type MeResponse } from "../domain/auth.schemas";
import { authKeys } from "./auth.keys";

export const useMe = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const status = useAuthStore((s) => s.status);

  const api = createApiClient({
    getAccessToken: () => accessToken,
    setAccessToken,
  });

  return useQuery<MeResponse | null>({
    queryKey: authKeys.me(),
    enabled: status === "ready" && !!accessToken,
    queryFn: async () => {
      const data = await api.requestJson("/api/v1/auth/me", {
        method: "GET",
        credentials: "include",
      });
      return meResponseSchema.parse(data);
    },
    staleTime: 30_000,
    retry: (count, err: any) => {
      if (err?.status === 401) return false;
      return count < 2;
    },
  });
};
