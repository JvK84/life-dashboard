import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "../ToastContext";

function ToastControls() {
  const { addToast, toasts } = useToast();

  return (
    <div>
      <button type="button" onClick={() => addToast({ type: "success", message: "Guardado" })}>Añadir toast</button>
      <button type="button" onClick={() => addToast({ type: "info", message: "Información", duration: 0 })}>Añadir persistente</button>
      <p>{toasts.length}</p>
    </div>
  );
}

describe("ToastContext", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("adds a toast and removes it after its configured duration", () => {
    // Arrange
    vi.useFakeTimers();
    render(<ToastProvider><ToastControls /></ToastProvider>);

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Añadir toast" }));

    // Assert
    expect(screen.getByText("1")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("keeps a toast when its duration is zero", () => {
    // Arrange
    vi.useFakeTimers();
    render(<ToastProvider><ToastControls /></ToastProvider>);

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Añadir persistente" }));
    act(() => vi.advanceTimersByTime(10000));

    // Assert
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("rejects use outside the provider", () => {
    // Arrange
    const renderOutsideProvider = () => render(<ToastControls />);

    // Act
    // Assert
    expect(renderOutsideProvider).toThrow("useToast debe utilizarse dentro de ToastProvider");
  });
});
