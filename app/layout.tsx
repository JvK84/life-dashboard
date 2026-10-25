import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ErrorBoundary } from "@/src/components/error/ErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Dashboard",
  description: "Tu día, en un solo lugar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body><ErrorBoundary>{children}</ErrorBoundary><SpeedInsights /></body>
    </html>
  );
}
