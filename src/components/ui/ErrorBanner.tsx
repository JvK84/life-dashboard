"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import { useGlobalError } from "@/src/context/ErrorContext";

const AUTO_DISMISS_MS = 5000;

export function ErrorBanner() {
  const { error, clearError } = useGlobalError();

  useEffect(() => {
    if (!error || error.persistent) return undefined;

    const timeoutId = window.setTimeout(clearError, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timeoutId);
  }, [clearError, error]);

  useEffect(() => {
    if (!error) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") clearError();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearError, error]);

  if (!error) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="mx-auto flex max-w-3xl items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-950 shadow-lg dark:border-red-900/80 dark:bg-red-950/90 dark:text-red-50"
      >
        <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-red-600 dark:text-red-300" size={20} />
        <p className="min-w-0 flex-1 text-sm font-medium">{error.message}</p>
        <button
          type="button"
          aria-label="Cerrar mensaje de error"
          onClick={clearError}
          className="-mr-1 -mt-1 rounded-full p-1 text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <X aria-hidden="true" size={18} />
        </button>
      </div>
    </div>
  );
}
