"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export type AddToastOptions = {
  type: ToastType;
  message: string;
  duration?: number;
};

export type Toast = AddToastOptions & { id: number };

type ToastContextValue = {
  toasts: Toast[];
  addToast: (options: AddToastOptions) => number;
  removeToast: (id: number) => void;
};

const DEFAULT_DURATION_MS = 4000;
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, number>());

  const removeToast = useCallback((id: number) => {
    const timerId = timers.current.get(id);
    if (timerId !== undefined) {
      window.clearTimeout(timerId);
      timers.current.delete(id);
    }

    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((options: AddToastOptions) => {
    const id = nextId.current;
    nextId.current += 1;
    const duration = options.duration ?? DEFAULT_DURATION_MS;
    const toast = { ...options, duration, id };

    setToasts((currentToasts) => [...currentToasts, toast]);

    if (duration > 0) {
      const timerId = window.setTimeout(() => removeToast(id), duration);
      timers.current.set(id, timerId);
    }

    return id;
  }, [removeToast]);

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [addToast, removeToast, toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) throw new Error("useToast debe utilizarse dentro de ToastProvider");

  return context;
}

export function useOptionalToast(): ToastContextValue | undefined {
  return useContext(ToastContext);
}
