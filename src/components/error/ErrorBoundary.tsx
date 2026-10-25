"use client";

import { Component, type ReactNode } from "react";

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

type ErrorBoundaryFallback = ReactNode | ((error: Error, reset: () => void) => ReactNode);

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ErrorBoundaryFallback;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught an error", error);
  }

  private reset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (!this.state.hasError || !this.state.error) return this.props.children;

    const fallback = this.props.fallback;
    if (typeof fallback === "function") return fallback(this.state.error, this.reset);
    if (fallback) return fallback;

    return (
      <section role="alert" aria-labelledby="error-boundary-title" className="rounded-[28px] bg-white p-6 text-ink shadow-soft dark:bg-[#1c1c20] dark:text-white">
        <h2 id="error-boundary-title" className="text-lg font-semibold">Algo no ha salido bien</h2>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">No hemos podido mostrar esta sección.</p>
        <button type="button" onClick={this.reset} className="mt-4 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
          Reintentar
        </button>
      </section>
    );
  }
}
