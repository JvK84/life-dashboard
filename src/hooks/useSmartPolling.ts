"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SmartPollingOptions<T> = {
  fetcher: () => Promise<T>;
  intervalMs: number;
  enabled?: boolean;
  maxBackoffMs?: number;
};

export type SmartPollingResult<T> = {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => Promise<void>;
};

const DEFAULT_MAX_BACKOFF_MS = 300_000;

type ErrorWithStatus = Error & { status?: number; statusCode?: number };

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error("Polling request failed");
}

function isRetryableError(error: Error): boolean {
  const candidate = error as ErrorWithStatus;
  const status = candidate.status ?? candidate.statusCode;
  return status === undefined || status === 429;
}

export function useSmartPolling<T>({
  fetcher,
  intervalMs,
  enabled = true,
  maxBackoffMs = DEFAULT_MAX_BACKOFF_MS,
}: SmartPollingOptions<T>): SmartPollingResult<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isRefetching, setIsRefetching] = useState(false);
  const fetcherRef = useRef(fetcher);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const enabledRef = useRef(enabled);
  const baseIntervalRef = useRef(intervalMs);
  const currentIntervalRef = useRef(intervalMs);
  const maxBackoffRef = useRef(maxBackoffMs);
  const hasDataRef = useRef(false);

  fetcherRef.current = fetcher;
  enabledRef.current = enabled;
  baseIntervalRef.current = intervalMs;
  maxBackoffRef.current = Math.max(maxBackoffMs, intervalMs);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback((delay: number, request: () => Promise<void>) => {
    clearTimer();
    if (!mountedRef.current || !enabledRef.current || document.hidden) return;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      void request();
    }, delay);
  }, [clearTimer]);

  const performFetch = useCallback(async () => {
    if (!mountedRef.current || !enabledRef.current || document.hidden) return;

    setIsLoading(!hasDataRef.current);
    setIsRefetching(hasDataRef.current);

    try {
      const nextData = await fetcherRef.current();
      if (!mountedRef.current) return;
      setData(nextData);
      setError(null);
      hasDataRef.current = true;
      currentIntervalRef.current = baseIntervalRef.current;
    } catch (value: unknown) {
      if (!mountedRef.current) return;
      const nextError = toError(value);
      setError(nextError);
      if (isRetryableError(nextError)) {
        currentIntervalRef.current = Math.min(currentIntervalRef.current * 2, maxBackoffRef.current);
      }
    } finally {
      if (!mountedRef.current) return;
      setIsLoading(false);
      setIsRefetching(false);
      scheduleNext(currentIntervalRef.current, performFetch);
    }
  }, [scheduleNext]);

  const refetch = useCallback(async () => {
    clearTimer();
    await performFetch();
  }, [clearTimer, performFetch]);

  useEffect(() => {
    mountedRef.current = true;
    if (!enabled) {
      clearTimer();
      setIsLoading(false);
      setIsRefetching(false);
      return () => {
        mountedRef.current = false;
        clearTimer();
      };
    }

    currentIntervalRef.current = baseIntervalRef.current;
    void performFetch();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimer();
        return;
      }
      currentIntervalRef.current = baseIntervalRef.current;
      void refetch();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      mountedRef.current = false;
      clearTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [clearTimer, enabled, performFetch, refetch]);

  return { data, error, isLoading, isRefetching, refetch };
}
