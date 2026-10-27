"use client";

import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useToast, type ToastType } from "@/src/context/ToastContext";

const TOAST_STYLES: Record<ToastType, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: "border-lime-300 bg-lime-50 text-lime-950 dark:border-lime-700 dark:bg-lime-950/90 dark:text-lime-50" },
  error: { icon: TriangleAlert, className: "border-red-300 bg-red-50 text-red-950 dark:border-red-700 dark:bg-red-950/90 dark:text-red-50" },
  warning: { icon: TriangleAlert, className: "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-700 dark:bg-amber-950/90 dark:text-amber-50" },
  info: { icon: Info, className: "border-sky-300 bg-sky-50 text-sky-950 dark:border-sky-700 dark:bg-sky-950/90 dark:text-sky-50" },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-end gap-3 p-4 sm:left-auto sm:max-w-md">
      {toasts.map((toast) => {
        const { icon: Icon, className } = TOAST_STYLES[toast.type];
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            role={isError ? "alert" : "status"}
            aria-live={isError ? "assertive" : "polite"}
            aria-atomic="true"
            className={`flex w-full items-start gap-3 rounded-2xl border border-l-4 p-4 shadow-lg motion-safe:animate-[toast-in_180ms_ease-out] ${className}`}
          >
            <Icon aria-hidden="true" className="mt-0.5 shrink-0" size={20} />
            <p className="min-w-0 flex-1 text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              aria-label="Cerrar notificación"
              onClick={() => removeToast(toast.id)}
              className="-mr-1 -mt-1 rounded-full p-1 text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
