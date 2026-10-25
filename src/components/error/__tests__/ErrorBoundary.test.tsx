import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "../ErrorBoundary";

function BrokenWidget() {
  if (typeof window === "object") throw new Error("Widget roto");
  return null;
}

function RecoverableWidget({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("Widget temporalmente roto");
  return <p>Widget recuperado</p>;
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("renders its children when no error is thrown", () => {
    // Arrange
    const content = "Contenido estable";

    // Act
    render(<ErrorBoundary><p>{content}</p></ErrorBoundary>);

    // Assert
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it("shows the accessible fallback when a child throws", () => {
    // Arrange
    // Act
    render(<ErrorBoundary><BrokenWidget /></ErrorBoundary>);

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent("Algo no ha salido bien");
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });

  it("resets the boundary and restores rendering after retry", () => {
    // Arrange
    const { rerender } = render(<ErrorBoundary><RecoverableWidget shouldThrow={true} /></ErrorBoundary>);
    rerender(<ErrorBoundary><RecoverableWidget shouldThrow={false} /></ErrorBoundary>);

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    // Assert
    expect(screen.getByText("Widget recuperado")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("supports a custom fallback with the boundary reset callback", () => {
    // Arrange
    const fallback = (error: Error, reset: () => void) => <div role="alert"><span>{error.message}</span><button type="button" onClick={reset}>Recuperar widget</button></div>;
    const { rerender } = render(<ErrorBoundary fallback={fallback}><RecoverableWidget shouldThrow={true} /></ErrorBoundary>);
    rerender(<ErrorBoundary fallback={fallback}><RecoverableWidget shouldThrow={false} /></ErrorBoundary>);

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Recuperar widget" }));

    // Assert
    expect(screen.getByText("Widget recuperado")).toBeInTheDocument();
  });

  it("keeps adjacent widgets available when one boundary catches an error", () => {
    // Arrange
    render(<><ErrorBoundary><BrokenWidget /></ErrorBoundary><ErrorBoundary><p>Widget adyacente</p></ErrorBoundary></>);

    // Act
    const adjacentWidget = screen.getByText("Widget adyacente");

    // Assert
    expect(adjacentWidget).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
