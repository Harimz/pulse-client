import { ApiError } from "./api-error";

type RequestVoidOptions = RequestInit & {
  baseUrl: string;
};

export async function requestVoid(
  path: string,
  opts: RequestVoidOptions,
): Promise<void> {
  const url = path.startsWith("http") ? path : `${opts.baseUrl}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...opts,
      credentials: "include",
    });
  } catch (err) {
    throw new ApiError(0, "Network error", { cause: err });
  }

  await throwIfNotOk(res);
}

const readText = async (res: Response) => {
  try {
    return await res.text();
  } catch {
    return "";
  }
};

export const readJsonSafely = async <T = unknown>(
  res: Response,
): Promise<T | null> => {
  const text = await readText(res);
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

export const errorMessageFromPayload = (payload: any, fallback: string) => {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (typeof payload?.message === "string") return payload.message;
  if (typeof payload?.error === "string") return payload.error;

  if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
    const first = payload.errors[0];
    if (typeof first === "string") return first;
    if (typeof first?.message === "string") return first.message;
  }

  return fallback;
};

export const throwIfNotOk = async (res: Response) => {
  if (res.ok) return;

  const payload = await readJsonSafely(res);
  const fallback = res.statusText || "Request Failed";
  const msg = errorMessageFromPayload(payload, fallback);

  throw new ApiError(res.status, msg, payload);
};

type RequestJsonOptions = RequestInit & {
  baseUrl: string;
  accessToken?: string | null;
  cookie?: string;
  retryOnUnauthorized?: boolean;
  onUnauthorized?: () => Promise<string | null>;
};

export async function requestJson<T>(
  path: string,
  opts: RequestJsonOptions,
): Promise<T> {
  const {
    baseUrl,
    accessToken,
    cookie,
    retryOnUnauthorized = true,
    onUnauthorized,
    ...init
  } = opts;

  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const doFetch = async (token: string | null) => {
    const headers = new Headers(init.headers);

    if (!headers.has("Content-Type") && init.body) {
      headers.set("Content-Type", "application/json");
    }

    if (token) headers.set("Authorization", `Bearer ${token}`);

    if (cookie) headers.set("cookie", cookie);

    let res: Response;
    try {
      res = await fetch(url, {
        ...init,
        headers,
        credentials: "include",
      });
    } catch (err) {
      throw new ApiError(0, "Network error", { cause: err });
    }

    return res;
  };

  let res = await doFetch(accessToken ?? null);

  if (
    retryOnUnauthorized &&
    (res.status === 401 || res.status === 403) &&
    onUnauthorized
  ) {
    const newToken = await onUnauthorized();
    if (newToken) {
      res = await doFetch(newToken);
    }
  }

  await throwIfNotOk(res);

  const payload = await readJsonSafely<T>(res);
  if (payload == null) throw new ApiError(res.status, "Empty response body");

  return payload;
}
