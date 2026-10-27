"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type GlobalError = {
  message: string;
  code?: string;
  persistent: boolean;
};

export type ShowErrorOptions = {
  code?: string;
  persistent?: boolean;
};

type ErrorContextValue = {
  error: GlobalError | null;
  showError: (message: string, options?: ShowErrorOptions) => void;
  clearError: () => void;
};

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<GlobalError | null>(null);

  const showError = useCallback((message: string, options: ShowErrorOptions = {}) => {
    setError({ message, code: options.code, persistent: options.persistent ?? false });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({ error, showError, clearError }), [clearError, error, showError]);

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
}

export function useGlobalError(): ErrorContextValue {
  const context = useContext(ErrorContext);

  if (!context) throw new Error("useGlobalError debe utilizarse dentro de ErrorProvider");

  return context;
}
