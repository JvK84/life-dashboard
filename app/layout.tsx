import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ErrorBoundary } from "@/src/components/error/ErrorBoundary";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import { ToastContainer } from "@/src/components/ui/ToastContainer";
import { ErrorProvider } from "@/src/context/ErrorContext";
import { ToastProvider } from "@/src/context/ToastContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Dashboard",
  description: "Tu día, en un solo lugar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body><ErrorProvider><ToastProvider><ErrorBoundary>{children}</ErrorBoundary><ErrorBanner /><ToastContainer /></ToastProvider></ErrorProvider><SpeedInsights /></body>
    </html>
  );
}
