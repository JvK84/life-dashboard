import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ErrorProvider, useGlobalError } from "@/src/context/ErrorContext";
import { ErrorBanner } from "../ErrorBanner";

function ShowErrorButton({ persistent = true }: { persistent?: boolean }) {
  const { showError } = useGlobalError();
  return <button type="button" onClick={() => showError("No se pudieron cargar los datos", { persistent })}>Mostrar error</button>;
}

function renderBanner(persistent = true) {
  return render(
    <ErrorProvider>
      <ShowErrorButton persistent={persistent} />
      <ErrorBanner />
    </ErrorProvider>,
  );
}

describe("ErrorBanner", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("stays hidden when there is no global error", () => {
    // Arrange
    renderBanner();

    // Act
    const banner = screen.queryByRole("alert");

    // Assert
    expect(banner).not.toBeInTheDocument();
  });

  it("shows the global error message with assertive alert semantics", () => {
    // Arrange
    renderBanner();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Mostrar error" }));

    // Assert
    const banner = screen.getByRole("alert");
    expect(banner).toHaveTextContent("No se pudieron cargar los datos");
    expect(banner).toHaveAttribute("aria-live", "assertive");
  });

  it("clears the error when the dismiss button is pressed", () => {
    // Arrange
    renderBanner();
    fireEvent.click(screen.getByRole("button", { name: "Mostrar error" }));

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Cerrar mensaje de error" }));

    // Assert
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("clears the error when Escape is pressed", () => {
    // Arrange
    renderBanner();
    fireEvent.click(screen.getByRole("button", { name: "Mostrar error" }));

    // Act
    fireEvent.keyDown(window, { key: "Escape" });

    // Assert
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("auto-dismisses non-persistent errors", () => {
    // Arrange
    vi.useFakeTimers();
    renderBanner(false);
    fireEvent.click(screen.getByRole("button", { name: "Mostrar error" }));

    // Act
    act(() => vi.advanceTimersByTime(5000));

    // Assert
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
