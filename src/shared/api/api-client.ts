import { refreshAuth } from "@/modules/auth/api/auth.client";
import { requestJson } from "./http";
import { env } from "../config/env";

type ApiClientRuntime = {
  getAccessToken: () => string | null | undefined;
  setAccessToken: (t: string | null) => void;
  cookie?: string;
};

let refreshPromise: Promise<string | null> | null = null;

export const createApiClient = (rt: ApiClientRuntime) => {
  const onUnauthorized = async () => {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const res = await refreshAuth({ cookie: rt.cookie });
          rt.setAccessToken(res.accessToken);
          return res.accessToken;
        } catch {
          rt.setAccessToken(null);
          return null;
        } finally {
          refreshPromise = null;
        }
      })();
    }
    return refreshPromise;
  };

  return {
    requestJson: <T>(path: string, init: RequestInit = {}) =>
      requestJson<T>(path, {
        baseUrl: env.API_URL,
        ...init,
        accessToken: rt.getAccessToken(),
        cookie: rt.cookie,
        onUnauthorized,
      }),

    ensureAccessToken: async () => {
      const t = rt.getAccessToken();
      if (t) return t;
      return await onUnauthorized();
    },
  };
};
