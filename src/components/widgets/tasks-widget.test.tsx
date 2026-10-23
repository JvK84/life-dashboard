import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TasksWidget } from "./tasks-widget";
import type { Task } from "@/src/types/task";

const activeTask: Task = { id: "active", title: "Preparar informe", completed: false, priority: "high", tags: ["Trabajo"], archived: false };
const completedTask: Task = { id: "completed", title: "Leer correo", completed: true, priority: "low", tags: ["Personal"], archived: false };
const archivedTask: Task = { id: "archived", title: "Tarea archivada", completed: false, priority: "medium", tags: [], archived: true };

function renderWidget(tasks: Task[] = [activeTask, completedTask, archivedTask]) {
  const callbacks = { onToggle: vi.fn(), onAdd: vi.fn(() => activeTask), onUpdate: vi.fn(), onArchive: vi.fn() };
  render(<TasksWidget tasks={tasks} allTasks={tasks} activeTasks={tasks.filter((task) => !task.completed && !task.archived)} completedTasks={tasks.filter((task) => task.completed && !task.archived)} archivedTasks={tasks.filter((task) => task.archived)} {...callbacks} />);
  return callbacks;
}

describe("TasksWidget", () => {
  it("filters tasks through accessible tabs", () => {
    // Arrange
    renderWidget();

    // Act
    fireEvent.click(screen.getByRole("tab", { name: /Completadas/ }));

    // Assert
    expect(screen.getByText("Leer correo")).toBeInTheDocument();
    expect(screen.queryByText("Preparar informe")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Completadas/ })).toHaveAttribute("aria-selected", "true");
  });

  it("filters pending tasks", () => {
    // Arrange
    renderWidget();

    // Act
    fireEvent.click(screen.getByRole("tab", { name: /Pendientes/ }));

    // Assert
    expect(screen.getByText("Preparar informe")).toBeInTheDocument();
    expect(screen.queryByText("Leer correo")).not.toBeInTheDocument();
  });

  it("adds a task with the selected priority", () => {
    // Arrange
    const callbacks = renderWidget();
    fireEvent.change(screen.getByLabelText("Nueva tarea"), { target: { value: "Nueva tarea" } });

    // Act
    fireEvent.change(screen.getByLabelText("Prioridad de nueva tarea"), { target: { value: "high" } });
    fireEvent.submit(screen.getByLabelText("Nueva tarea"));

    // Assert
    expect(callbacks.onAdd).toHaveBeenCalledWith({ title: "Nueva tarea", completed: false, priority: "high", tags: [], archived: false });
    expect(screen.getByLabelText("Nueva tarea")).toHaveValue("");
  });

  it("edits a task title and priority", () => {
    // Arrange
    const callbacks = renderWidget([activeTask]);
    fireEvent.click(screen.getByRole("button", { name: "Editar tarea" }));

    // Act
    fireEvent.change(screen.getByRole("textbox", { name: "Editar Preparar informe" }), { target: { value: "Informe final" } });
    fireEvent.change(screen.getByLabelText("Prioridad de edición"), { target: { value: "low" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    // Assert
    expect(callbacks.onUpdate).toHaveBeenCalledWith("active", { title: "Informe final", priority: "low" });
  });

  it("does not save an empty edited title", () => {
    // Arrange
    const callbacks = renderWidget([activeTask]);
    fireEvent.click(screen.getByRole("button", { name: "Editar tarea" }));

    // Act
    fireEvent.change(screen.getByRole("textbox", { name: "Editar Preparar informe" }), { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    // Assert
    expect(callbacks.onUpdate).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: "Editar Preparar informe" })).toBeInTheDocument();
  });

  it("toggles completion and archive actions", () => {
    // Arrange
    const callbacks = renderWidget([activeTask, archivedTask]);

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Preparar informe Alta" }));
    fireEvent.click(screen.getByRole("button", { name: "Archivar tarea" }));
    fireEvent.click(screen.getByRole("button", { name: "Desarchivar tarea" }));

    // Assert
    expect(callbacks.onToggle).toHaveBeenCalledWith("active");
    expect(callbacks.onArchive).toHaveBeenNthCalledWith(1, "active");
    expect(callbacks.onArchive).toHaveBeenNthCalledWith(2, "archived");
  });

  it("shows an empty state for a filter with no matching tasks", () => {
    // Arrange
    renderWidget([activeTask]);

    // Act
    fireEvent.click(screen.getByRole("tab", { name: /Archivadas/ }));

    // Assert
    expect(screen.getByRole("status")).toHaveTextContent("No hay tareas en este filtro.");
  });

  it("shows zero progress when there are no tasks", () => {
    // Arrange
    renderWidget([]);

    // Act
    const progress = screen.getByText("0%", { selector: "span" });

    // Assert
    expect(progress).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("No hay tareas en este filtro.");
  });
});
