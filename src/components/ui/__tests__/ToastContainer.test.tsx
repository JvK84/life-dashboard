import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "@/src/context/ToastContext";
import { ToastContainer } from "../ToastContainer";

function ToastControls() {
  const { addToast } = useToast();

  return (
    <div>
      <button type="button" onClick={() => addToast({ type: "success", message: "Operación completada", duration: 1000 })}>Éxito</button>
      <button type="button" onClick={() => addToast({ type: "error", message: "No se pudo guardar", duration: 0 })}>Error</button>
      <button type="button" onClick={() => addToast({ type: "info", message: "Hay una actualización", duration: 0 })}>Info</button>
    </div>
  );
}

function renderToasts() {
  return render(<ToastProvider><ToastControls /><ToastContainer /></ToastProvider>);
}

describe("ToastContainer", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders nothing when there are no toasts", () => {
    // Arrange
    renderToasts();

    // Act
    const notification = screen.queryByRole("status");

    // Assert
    expect(notification).not.toBeInTheDocument();
  });

  it("renders success and error toasts with the correct live regions", () => {
    // Arrange
    renderToasts();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Éxito" }));
    fireEvent.click(screen.getByRole("button", { name: "Error" }));

    // Assert
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
    expect(screen.getByText("Operación completada")).toBeInTheDocument();
    expect(screen.getByText("No se pudo guardar")).toBeInTheDocument();
  });

  it("stacks multiple toasts and closes only the selected toast", () => {
    // Arrange
    renderToasts();
    fireEvent.click(screen.getByRole("button", { name: "Info" }));
    fireEvent.click(screen.getByRole("button", { name: "Error" }));

    // Act
    const closeButtons = screen.getAllByRole("button", { name: "Cerrar notificación" });
    fireEvent.click(closeButtons[0]);

    // Assert
    expect(screen.queryByText("Hay una actualización")).not.toBeInTheDocument();
    expect(screen.getByText("No se pudo guardar")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Cerrar notificación" })).toHaveLength(1);
  });

  it("auto-dismisses a toast after its duration", () => {
    // Arrange
    vi.useFakeTimers();
    renderToasts();
    fireEvent.click(screen.getByRole("button", { name: "Éxito" }));

    // Act
    act(() => vi.advanceTimersByTime(1000));

    // Assert
    expect(screen.queryByText("Operación completada")).not.toBeInTheDocument();
  });
});
