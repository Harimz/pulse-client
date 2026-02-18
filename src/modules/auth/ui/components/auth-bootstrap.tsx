import React, { useEffect } from "react";
import { useAuthStore } from "../../state/auth.store";
import { refresh } from "../../api/auth.client";
import { ApiError } from "@/shared/api/api-error";

export const AuthBootstrap = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setStatus = useAuthStore((s) => s.setStatus);

  useEffect(() => {
    if (accessToken) return;

    let cancelled = false;

    (async () => {
      setStatus("pending");

      try {
        const res = await refresh();
        if (!cancelled) setAccessToken(res.accessToken);
      } catch (err) {
        if (
          err instanceof ApiError &&
          (err.status === 401 || err.status === 403)
        ) {
          if (!cancelled) setAccessToken(null);
          return;
        }
        if (!cancelled) setAccessToken(null);
      } finally {
        if (!cancelled) setStatus("ready");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accessToken, setAccessToken]);

  return null;
};
