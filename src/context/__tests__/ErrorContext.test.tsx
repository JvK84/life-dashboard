import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorProvider, useGlobalError } from "../ErrorContext";

function ErrorControls() {
  const { error, clearError, showError } = useGlobalError();

  return (
    <div>
      <p>{error?.message ?? "Sin errores"}</p>
      <button type="button" onClick={() => showError("Error de red", { code: "NETWORK", persistent: true })}>Mostrar error</button>
      <button type="button" onClick={clearError}>Limpiar error</button>
    </div>
  );
}

describe("ErrorContext", () => {
  it("stores error details through the public API", () => {
    // Arrange
    render(<ErrorProvider><ErrorControls /></ErrorProvider>);

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Mostrar error" }));

    // Assert
    expect(screen.getByText("Error de red")).toBeInTheDocument();
  });

  it("clears the current error through the public API", () => {
    // Arrange
    render(<ErrorProvider><ErrorControls /></ErrorProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Mostrar error" }));

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Limpiar error" }));

    // Assert
    expect(screen.getByText("Sin errores")).toBeInTheDocument();
  });

  it("rejects use outside the provider", () => {
    // Arrange
    const renderOutsideProvider = () => render(<ErrorControls />);

    // Act
    // Assert
    expect(renderOutsideProvider).toThrow("useGlobalError debe utilizarse dentro de ErrorProvider");
  });
});
