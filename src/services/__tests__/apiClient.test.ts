import { describe, expect, it, vi } from "vitest";
import { ApiClientError, fetchWithRetry, type AppError } from "../apiClient";

describe("fetchWithRetry", () => {
  it("returns a successful response", async () => {
    const response = new Response(JSON.stringify({ ok: true }), { status: 200 });
    const fetcher = vi.fn().mockResolvedValue(response);

    const result = await fetchWithRetry("/api/data", {}, 2, undefined, fetcher);

    expect(result).toBe(response);
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it("retries server failures up to maxRetries", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));

    const result = await fetchWithRetry("/api/data", {}, 2, undefined, fetcher);

    expect(result.status).toBe(200);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("reports a normalized error after retries are exhausted", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "Servicio no disponible" }), { status: 503 }));
    const reportError = vi.fn<(error: AppError) => void>();

    const promise = fetchWithRetry("/api/data", {}, 2, reportError, fetcher);

    await expect(promise).rejects.toMatchObject({ message: "Servicio no disponible", code: "HTTP_503", status: 503 });
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(reportError).toHaveBeenCalledWith({ message: "Servicio no disponible", code: "HTTP_503", status: 503 });
  });

  it("retries network failures and normalizes the final exception", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("offline"));
    const reportError = vi.fn<(error: AppError) => void>();

    const promise = fetchWithRetry("/api/data", {}, 1, reportError, fetcher);

    await expect(promise).rejects.toBeInstanceOf(ApiClientError);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(reportError).toHaveBeenCalledWith({ message: "offline", code: "NETWORK_ERROR" });
  });

  it("retries timeout failures", async () => {
    const fetcher = vi.fn().mockRejectedValue(new DOMException("Timed out", "AbortError"));
    const reportError = vi.fn<(error: AppError) => void>();

    const promise = fetchWithRetry("/api/data", {}, 1, reportError, fetcher);

    await expect(promise).rejects.toMatchObject({ code: "TIMEOUT" });
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(reportError).toHaveBeenCalledWith({ message: "La petición ha agotado el tiempo de espera.", code: "TIMEOUT" });
  });

  it("does not retry client failures", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 401 }));

    await expect(fetchWithRetry("/api/data", {}, 2, undefined, fetcher)).rejects.toMatchObject({ code: "HTTP_401", status: 401 });
    expect(fetcher).toHaveBeenCalledOnce();
  });
});
