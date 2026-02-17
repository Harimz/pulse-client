export type BackendApiError = {
  message?: string;
  code?: string;
  details?: unknown;
};

export type ApiErrorPayload = unknown;

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  code?: string;
  details?: unknown;

  constructor(status: number, message: string, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;

    const p = payload as BackendApiError | undefined;
    if (p && typeof p === "object") {
      if (typeof p.code === "string") this.code = p.code;
      if (p.details !== undefined) this.details = p.details;
    }
  }
}

export const isApiError = (err: unknown): err is ApiError =>
  err instanceof ApiError;
