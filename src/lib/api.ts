/**
 * Thin fetch wrapper for the Hacknology API (Cloudflare Pages Functions).
 *
 * - Sends the session cookie via `credentials: "same-origin"`.
 * - Attaches the session-bound CSRF token to every state-changing request.
 * - Normalises error responses into a typed `ApiError`.
 */

let csrfToken: string | null = null;

/** Store the CSRF token returned by the server (set by the auth context). */
export function setCsrfToken(token: string | null): void {
  csrfToken = token;
}

export class ApiError extends Error {
  readonly status: number;
  readonly fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (method !== "GET" && csrfToken) headers["X-CSRF-Token"] = csrfToken;

  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method: method === "PUT" ? "PUT" : method,
      credentials: "same-origin",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Network error. Please check your connection.");
  }

  const raw = await res.text();
  let data: Record<string, unknown> = {};
  if (raw) {
    try {
      data = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      if (!res.ok) {
        throw new ApiError(res.status, "The server returned an unexpected response.");
      }
    }
  }

  if (!res.ok) {
    const message = typeof data.error === "string" ? data.error : "Request failed.";
    const fields =
      data.fields && typeof data.fields === "object"
        ? (data.fields as Record<string, string>)
        : undefined;
    throw new ApiError(res.status, message, fields);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  del: <T>(path: string, body?: unknown) => request<T>("DELETE", path, body),
  upload: async <T>(path: string, formData: FormData): Promise<T> => {
    const headers: Record<string, string> = {};
    if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
    const res = await fetch(`/api${path}`, {
      method: "POST",
      credentials: "same-origin",
      headers,
      body: formData,
    });
    const raw = await res.text();
    let data: Record<string, unknown> = {};
    if (raw) {
      try {
        data = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        if (!res.ok) throw new ApiError(res.status, "Unexpected server response.");
      }
    }
    if (!res.ok) {
      const message = typeof data.error === "string" ? data.error : "Upload failed.";
      throw new ApiError(res.status, message);
    }
    return data as T;
  },
};
