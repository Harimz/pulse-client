import { requestJson } from "@/shared/api/http";
import {
  type AuthResponse,
  authResponseSchema,
  type MeResponse,
  meResponseSchema,
} from "../domain/auth.schemas";
import { env } from "@/shared/config/env";

export const refreshAuth = async (opts: { cookie?: string }) => {
  const data = await requestJson<AuthResponse>("/api/v1/auth/refresh", {
    baseUrl: env.API_URL,
    method: "POST",
    cookie: opts.cookie,
  });
  return authResponseSchema.parse(data);
};

export const getme = async (opts: { accessToken: string; cookie?: string }) => {
  const data = await requestJson<MeResponse>("/api/v1/auth/me", {
    baseUrl: env.API_URL,
    method: "GET",
    accessToken: opts.accessToken,
    cookie: opts.cookie,
    retryOnUnauthorized: false,
  });

  return meResponseSchema.parse(data);
};
