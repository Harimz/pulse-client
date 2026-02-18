import { requestJson, requestVoid } from "@/shared/api/http";
import {
  type AuthResponse,
  authResponseSchema,
  type LoginRequest,
  type MeResponse,
  meResponseSchema,
  type RegisterRequest,
} from "../domain/auth.schemas";
import { env } from "@/shared/config/env";

export const refresh = async (): Promise<AuthResponse> => {
  const data = await requestJson<AuthResponse>("/api/v1/auth/refresh", {
    baseUrl: env.API_URL,
    method: "POST",
    credentials: "include",
  });

  return authResponseSchema.parse(data);
};

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

export const login = async (input: LoginRequest): Promise<AuthResponse> => {
  const data = await requestJson<AuthResponse>("/api/v1/auth/login", {
    baseUrl: env.API_URL,
    method: "POST",
    body: JSON.stringify(input),
  });

  return authResponseSchema.parse(data);
};

export const logout = async () => {
  await requestVoid("/api/v1/auth/logout", {
    baseUrl: env.API_URL,
    method: "POST",
    credentials: "include",
  });
};

export const register = async (
  input: RegisterRequest,
): Promise<AuthResponse> => {
  const data = await requestJson<AuthResponse>("/api/v1/auth/register", {
    baseUrl: env.API_URL,
    method: "POST",
    body: JSON.stringify({
      username: input.username,
      email: input.email,
      password: input.password,
      displayName: input.displayName,
    }),
  });

  return authResponseSchema.parse(data);
};
