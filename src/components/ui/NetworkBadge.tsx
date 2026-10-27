"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useRef } from "react";
import { useOptionalToast } from "@/src/context/ToastContext";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";

export function NetworkBadge() {
  const isOnline = useNetworkStatus();
  const previousOnlineState = useRef(isOnline);
  const toast = useOptionalToast();

  useEffect(() => {
    if (!previousOnlineState.current && isOnline && toast) {
      toast.addToast({ type: "success", message: "Conexión restablecida" });
    }

    previousOnlineState.current = isOnline;
  }, [isOnline, toast]);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-label="Sin conexión"
      aria-live="polite"
      className="flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-950 dark:border-amber-700 dark:bg-amber-950/80 dark:text-amber-50"
    >
      <WifiOff aria-hidden="true" size={15} />
      <span>Sin conexión</span>
    </div>
  );
}
