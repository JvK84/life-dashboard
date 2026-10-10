import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Dashboard } from "./dashboard";

describe("Dashboard", () => {
  it("renders the daily summary and main modules", () => {
    // Arrange
    render(<Dashboard />);

    // Act
    const summary = screen.getByText(/Buenos días, Jalonso/i);

    // Assert
    expect(summary).toBeInTheDocument();
    expect(screen.getByText("Mi agenda")).toBeInTheDocument();
    expect(screen.getByText("Bandeja de entrada")).toBeInTheDocument();
    expect(screen.getByText("Atajos rápidos")).toBeInTheDocument();
  });

  it("can add and complete a task", () => {
    // Arrange
    render(<Dashboard />);
    const input = screen.getByLabelText("Nueva tarea");

    // Act
    fireEvent.change(input, { target: { value: "Preparar demo" } });
    fireEvent.submit(input);

    // Assert
    expect(screen.getByText("Preparar demo")).toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByText("Preparar demo"));

    // Assert
    expect(screen.getByText("2 de 4 completadas.")).toBeInTheDocument();
  });

  it("ignores empty tasks", () => {
    // Arrange
    render(<Dashboard />);
    const input = screen.getByLabelText("Nueva tarea");

    // Act
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(input);

    // Assert
    expect(screen.queryByText("   ")).not.toBeInTheDocument();
    expect(screen.getByText("1 de 3 completadas.")).toBeInTheDocument();
  });

  it("can undo a completed task", () => {
    // Arrange
    render(<Dashboard />);
    const completedTask = screen.getByText("Revisar propuesta de producto");

    // Act
    fireEvent.click(completedTask);

    // Assert
    expect(screen.getByText("0 de 3 completadas.")).toBeInTheDocument();
  });

  it("can archive the inbox", () => {
    // Arrange
    render(<Dashboard />);

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Archivar correos" }));

    // Assert
    expect(screen.getByText("Todo al día.")).toBeInTheDocument();
    expect(screen.getByText("Inbox limpia")).toBeInTheDocument();
    expect(screen.queryByText("3 correos esperan.")).not.toBeInTheDocument();
  });
});
