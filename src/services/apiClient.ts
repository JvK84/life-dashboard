export type AppError = {
  message: string;
  code: string;
  status?: number;
};

export type ErrorReporter = (error: AppError) => void;
export type ApiRequestOptions = RequestInit & { timeoutMs?: number };
type Fetcher = typeof fetch;
type ApiRequestTarget = RequestInfo | URL;

const DEFAULT_TIMEOUT_MS = 10_000;

export class ApiClientError extends Error implements AppError {
  readonly code: string;
  readonly status?: number;

  constructor(error: AppError) {
    super(error.message);
    this.name = "ApiClientError";
    this.code = error.code;
    this.status = error.status;
  }
}

function isRetryableStatus(status: number): boolean {
  return status >= 500 && status <= 599;
}

function normalizeException(error: unknown): AppError {
  if (error instanceof ApiClientError) return { message: error.message, code: error.code, status: error.status };
  if (error instanceof DOMException && error.name === "AbortError") {
    return { message: "La petición ha agotado el tiempo de espera.", code: "TIMEOUT" };
  }
  if (error instanceof Error) return { message: error.message || "No se pudo completar la petición.", code: "NETWORK_ERROR" };
  return { message: "No se pudo completar la petición.", code: "NETWORK_ERROR" };
}

async function getResponseError(response: Response): Promise<AppError> {
  let message = `La petición falló con el estado ${response.status}.`;

  try {
    const payload = (await response.clone().json()) as { error?: unknown; message?: unknown };
    const responseMessage = typeof payload.error === "string" ? payload.error : payload.message;
    if (typeof responseMessage === "string" && responseMessage.trim()) message = responseMessage;
  } catch {
    // Some providers return an empty or non-JSON error response.
  }

  return { message, code: `HTTP_${response.status}`, status: response.status };
}

async function fetchWithTimeout(
  url: ApiRequestTarget,
  options: ApiRequestOptions,
  fetcher: Fetcher,
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...requestInit } = options;
  const controller = new AbortController();
  const abortFromCaller = () => controller.abort();
  signal?.addEventListener("abort", abortFromCaller, { once: true });
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetcher(url, { ...requestInit, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortFromCaller);
  }
}

export async function fetchWithRetry(
  url: ApiRequestTarget,
  options: ApiRequestOptions = {},
  maxRetries = 2,
  reportError?: ErrorReporter,
  fetcher: Fetcher = fetch,
): Promise<Response> {
  let attempt = 0;

  while (true) {
    try {
      const response = await fetchWithTimeout(url, options, fetcher);
      if (response.ok) return response;

      const appError = await getResponseError(response);
      if (!isRetryableStatus(response.status) || attempt >= maxRetries) {
        reportError?.(appError);
        throw new ApiClientError(appError);
      }
      attempt += 1;
    } catch (error) {
      if (error instanceof ApiClientError) throw error;
      const appError = normalizeException(error);
      const retryable = appError.code === "TIMEOUT" || appError.code === "NETWORK_ERROR" || Boolean(appError.status && isRetryableStatus(appError.status));
      if (!retryable || attempt >= maxRetries) {
        reportError?.(appError);
        throw new ApiClientError(appError);
      }
      attempt += 1;
    }
  }
}
