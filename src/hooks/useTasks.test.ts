import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { readStoredTasks, TASKS_STORAGE_KEY, useTasks, type TaskDraft } from "./useTasks";
import type { Task } from "@/src/types/task";

const baseTask: Task = {
  id: "task-1",
  title: "Review inbox",
  completed: false,
  priority: "high",
  dueDate: "2026-10-23T09:00:00.000Z",
  tags: ["work", "focus"],
  archived: false,
};

const secondTask: Task = {
  id: "task-2",
  title: "Read book",
  completed: true,
  priority: "low",
  tags: ["personal"],
  archived: false,
};

describe("useTasks", () => {
  it("uses the fallback during server rendering", () => {
    // Arrange
    const fallback = [baseTask];
    vi.stubGlobal("window", undefined);

    // Act
    const tasks = readStoredTasks(TASKS_STORAGE_KEY, fallback);

    // Assert
    expect(tasks).toEqual(fallback);
    vi.unstubAllGlobals();
  });

  it("restores valid tasks and filters corrupt stored entries", () => {
    // Arrange
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([baseTask, { ...baseTask, completed: "yes" }]));

    // Act
    const { result } = renderHook(() => useTasks());

    // Assert
    expect(result.current.tasks).toEqual([baseTask]);
    expect(result.current.activeTasks).toEqual([baseTask]);
  });

  it("falls back to initial tasks when storage contains invalid JSON", () => {
    // Arrange
    const initialTasks = [baseTask];
    localStorage.setItem(TASKS_STORAGE_KEY, "{invalid");

    // Act
    const { result } = renderHook(() => useTasks({ initialTasks }));

    // Assert
    expect(result.current.tasks).toEqual(initialTasks);
  });

  it("falls back to initial tasks when storage access throws", () => {
    // Arrange
    const initialTasks = [baseTask];
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    // Act
    const { result } = renderHook(() => useTasks({ initialTasks }));

    // Assert
    expect(result.current.tasks).toEqual(initialTasks);
    getItem.mockRestore();
  });

  it("derives completed, archived, and tag-based task lists", () => {
    // Arrange
    const archivedTask = { ...baseTask, id: "task-3", archived: true };
    const initialTasks = [baseTask, secondTask, archivedTask];

    // Act
    const { result } = renderHook(() => useTasks({ initialTasks }));

    // Assert
    expect(result.current.completedTasks).toEqual([secondTask]);
    expect(result.current.archivedTasks).toEqual([archivedTask]);
    expect(result.current.tasksByTag.work).toEqual([baseTask, archivedTask]);
    expect(result.current.filterByTag("personal")).toEqual([secondTask]);
  });

  it("adds a task with an injectable stable identifier", () => {
    // Arrange
    const newTask: TaskDraft = {
      title: baseTask.title,
      completed: baseTask.completed,
      priority: baseTask.priority,
      dueDate: baseTask.dueDate,
      tags: baseTask.tags,
      archived: baseTask.archived,
    };
    const { result } = renderHook(() => useTasks({ generateId: () => "task-new" }));

    // Act
    let addedTask: Task | undefined;
    act(() => {
      addedTask = result.current.addTask(newTask);
    });

    // Assert
    expect(addedTask).toEqual({ ...newTask, id: "task-new" });
    expect(result.current.tasks).toContainEqual({ ...newTask, id: "task-new" });
  });

  it("updates and archives a task using functional state updates", () => {
    // Arrange
    const { result } = renderHook(() => useTasks({ initialTasks: [baseTask] }));

    // Act
    act(() => {
      result.current.updateTask(baseTask.id, { title: "Updated inbox", tags: ["focus"] });
      result.current.toggleArchiveTask(baseTask.id);
    });

    // Assert
    expect(result.current.tasks[0]).toEqual({ ...baseTask, title: "Updated inbox", tags: ["focus"], archived: true });
    expect(result.current.archivedTasks).toHaveLength(1);
  });

  it("ignores updates for unknown task IDs", () => {
    // Arrange
    const { result } = renderHook(() => useTasks({ initialTasks: [baseTask] }));

    // Act
    act(() => result.current.updateTask("missing", { title: "Should not exist" }));

    // Assert
    expect(result.current.tasks).toEqual([baseTask]);
  });

  it("ignores archive toggles for unknown task IDs", () => {
    // Arrange
    const { result } = renderHook(() => useTasks({ initialTasks: [baseTask] }));

    // Act
    act(() => result.current.toggleArchiveTask("missing"));

    // Assert
    expect(result.current.tasks).toEqual([baseTask]);
  });

  it("deletes a task", () => {
    // Arrange
    const { result } = renderHook(() => useTasks({ initialTasks: [baseTask, secondTask] }));

    // Act
    act(() => result.current.deleteTask(baseTask.id));

    // Assert
    expect(result.current.tasks).toEqual([secondTask]);
  });

  it("keeps state in memory when persistence fails", () => {
    // Arrange
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    const { result } = renderHook(() => useTasks());

    // Act
    act(() => result.current.addTask({
      title: baseTask.title,
      completed: baseTask.completed,
      priority: baseTask.priority,
      dueDate: baseTask.dueDate,
      tags: baseTask.tags,
      archived: baseTask.archived,
    }));

    // Assert
    expect(result.current.tasks).toHaveLength(1);
    setItem.mockRestore();
  });
});
