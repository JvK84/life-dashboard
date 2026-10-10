import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Dashboard } from "./dashboard";

describe("Dashboard", () => {
  it("renders the daily summary and main modules", () => {
    render(<Dashboard />);
    expect(screen.getByText(/Buenos días, Jalonso/i)).toBeInTheDocument();
    expect(screen.getByText("Mi agenda")).toBeInTheDocument();
    expect(screen.getByText("Bandeja de entrada")).toBeInTheDocument();
  });

  it("can add and complete a task", () => {
    render(<Dashboard />);
    const input = screen.getByLabelText("Nueva tarea");
    fireEvent.change(input, { target: { value: "Preparar demo" } });
    fireEvent.submit(input);
    expect(screen.getByText("Preparar demo")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Preparar demo"));
    expect(screen.getByText("2 de 4 completadas.")).toBeInTheDocument();
  });
});
