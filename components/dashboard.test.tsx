import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  it("keeps consecutive task additions", () => {
    // Arrange
    render(<Dashboard />);
    const input = screen.getByLabelText("Nueva tarea");

    // Act
    fireEvent.change(input, { target: { value: "Primera tarea" } });
    fireEvent.submit(input);
    fireEvent.change(input, { target: { value: "Segunda tarea" } });
    fireEvent.submit(input);

    // Assert
    expect(screen.getByText("Primera tarea")).toBeInTheDocument();
    expect(screen.getByText("Segunda tarea")).toBeInTheDocument();
    expect(screen.getByText("1 de 5 completadas.")).toBeInTheDocument();
  });

  it("restores tasks from local storage", async () => {
    // Arrange
    localStorage.setItem(
      "life-dashboard.tasks",
      JSON.stringify([{ id: "saved-1", label: "Tarea guardada", done: true, tag: "Trabajo" }]),
    );

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(screen.getByText("Tarea guardada")).toBeInTheDocument());
    expect(screen.getByText("1 de 1 completadas.")).toBeInTheDocument();
  });

  it("falls back to initial tasks when local storage is invalid", async () => {
    // Arrange
    localStorage.setItem("life-dashboard.tasks", "{invalid json");

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(screen.getByText("1 de 3 completadas.")).toBeInTheDocument());
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

  it("exposes accessible names, states, links, and keyboard focus", () => {
    // Arrange
    render(<Dashboard />);
    const searchButton = screen.getByRole("button", { name: "Buscar" });
    const firstTask = screen.getByRole("button", { name: /Revisar propuesta de producto/i });

    // Act
    searchButton.focus();

    // Assert
    expect(searchButton).toHaveFocus();
    expect(screen.getByRole("button", { name: "Más opciones de agenda" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Añadir atajo" })).toBeInTheDocument();
    expect(firstTask).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: "Ver calendario" })).toHaveAttribute("href", "#calendar");
    expect(screen.getByRole("link", { name: "Abrir Gmail" })).toHaveAttribute("href", "#gmail");
  });

  it("toggles and persists the selected theme", async () => {
    // Arrange
    render(<Dashboard />);
    const toggle = screen.getByRole("button", { name: "Activar modo oscuro" });

    // Act
    fireEvent.click(toggle);

    // Assert
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    expect(localStorage.getItem("life-dashboard.theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Activar modo claro" })).toBeInTheDocument();
  });

  it("restores a previously selected theme", async () => {
    // Arrange
    localStorage.setItem("life-dashboard.theme", "dark");

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    expect(screen.getByRole("button", { name: "Activar modo claro" })).toBeInTheDocument();
  });

  it("restores the light theme when it is explicitly saved", async () => {
    // Arrange
    localStorage.setItem("life-dashboard.theme", "light");

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(document.documentElement).not.toHaveClass("dark"));
    expect(screen.getByRole("button", { name: "Activar modo oscuro" })).toBeInTheDocument();
  });
});
