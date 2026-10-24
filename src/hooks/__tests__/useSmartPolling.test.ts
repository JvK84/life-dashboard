import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSmartPolling } from "../useSmartPolling";

function setDocumentHidden(hidden: boolean): void {
  Object.defineProperty(document, "hidden", { configurable: true, value: hidden });
}

describe("useSmartPolling", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setDocumentHidden(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fetches initially and repeats at the configured interval", async () => {
    const fetcher = vi.fn().mockResolvedValue("today");

    const { result } = renderHook(() => useSmartPolling({ fetcher, intervalMs: 1_000 }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.data).toBe("today");

    await act(async () => {
      vi.advanceTimersByTime(1_000);
    });

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("pauses polling while the document is hidden", async () => {
    const fetcher = vi.fn().mockResolvedValue("today");
    renderHook(() => useSmartPolling({ fetcher, intervalMs: 1_000 }));

    await act(async () => {
      await Promise.resolve();
      setDocumentHidden(true);
      document.dispatchEvent(new Event("visibilitychange"));
      vi.advanceTimersByTime(5_000);
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("refetches immediately and resumes after visibility is restored", async () => {
    const fetcher = vi.fn().mockResolvedValue("today");
    renderHook(() => useSmartPolling({ fetcher, intervalMs: 1_000 }));

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      setDocumentHidden(true);
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(fetcher).toHaveBeenCalledTimes(1);

    await act(async () => {
      setDocumentHidden(false);
      document.dispatchEvent(new Event("visibilitychange"));
      await Promise.resolve();
    });

    expect(fetcher).toHaveBeenCalledTimes(2);

    await act(async () => {
      vi.advanceTimersByTime(1_000);
    });

    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("applies exponential backoff up to the configured maximum after a 429", async () => {
    const rateLimitError = Object.assign(new Error("Too many requests"), { status: 429 });
    const fetcher = vi.fn().mockRejectedValue(rateLimitError);
    renderHook(() => useSmartPolling({ fetcher, intervalMs: 1_000, maxBackoffMs: 3_000 }));

    await act(async () => {
      await Promise.resolve();
      vi.advanceTimersByTime(1_999);
    });
    expect(fetcher).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(fetcher).toHaveBeenCalledTimes(2);

    await act(async () => {
      vi.advanceTimersByTime(3_000);
    });
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("restores the base interval after a successful request", async () => {
    const fetcher = vi.fn()
      .mockRejectedValueOnce(new Error("Network unavailable"))
      .mockResolvedValue("recovered");
    renderHook(() => useSmartPolling({ fetcher, intervalMs: 1_000 }));

    await act(async () => {
      await Promise.resolve();
      vi.advanceTimersByTime(1_999);
    });
    expect(fetcher).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(1);
      await Promise.resolve();
    });
    expect(fetcher).toHaveBeenCalledTimes(2);

    await act(async () => {
      vi.advanceTimersByTime(999);
    });
    expect(fetcher).toHaveBeenCalledTimes(2);

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("does not poll when disabled and cleans up its disabled state", () => {
    const fetcher = vi.fn().mockResolvedValue("today");

    const { result, unmount } = renderHook(() => useSmartPolling({ fetcher, intervalMs: 1_000, enabled: false }));
    expect(result.current.isLoading).toBe(false);

    unmount();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("reports non-rate-limit HTTP errors without increasing the interval", async () => {
    const serverError = Object.assign(new Error("Server unavailable"), { status: 500 });
    const fetcher = vi.fn().mockRejectedValue(serverError);
    const { result } = renderHook(() => useSmartPolling({ fetcher, intervalMs: 1_000 }));

    await act(async () => {
      await Promise.resolve();
      vi.advanceTimersByTime(1_000);
      await Promise.resolve();
    });

    expect(result.current.error).toBe(serverError);
    expect(fetcher).toHaveBeenCalledTimes(2);

    await act(async () => {
      vi.advanceTimersByTime(1_000);
    });

    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("normalizes unknown rejection values into an Error", async () => {
    const fetcher = vi.fn().mockRejectedValue("offline");
    const { result } = renderHook(() => useSmartPolling({ fetcher, intervalMs: 1_000 }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.error).toEqual(new Error("Polling request failed"));
  });
});
