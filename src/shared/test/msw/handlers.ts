import { env } from "@/shared/config/env";
import { http, HttpResponse } from "msw";

let cookieSession = false;

export const handlers = [
  http.post(`${env.API_URL}/api/v1/auth/login`, async () => {
    cookieSession = true;
    return HttpResponse.json({ accessToken: "access-token-1" });
  }),

  http.post(`${env.API_URL}/api/v1/auth/register`, async () => {
    cookieSession = true;
    return HttpResponse.json({ accessToken: "access-token-1" });
  }),

  http.post(`${env.API_URL}/api/v1/auth/refresh`, async () => {
    if (!cookieSession) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json({ accessToken: "access-token-refreshed" });
  }),

  http.post(`${env.API_URL}/api/v1/auth/logout`, async () => {
    cookieSession = false;
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${env.API_URL}/api/v1/auth/me`, async ({ request }) => {
    const auth = request.headers.get("authorization") ?? "";
    if (!auth.startsWith("Bearer "))
      return new HttpResponse(null, { status: 401 });

    return HttpResponse.json({
      id: "u1",
      username: "test",
      email: "test@test.com",
    });
  }),
];
