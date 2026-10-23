import { describe, expect, it } from "vitest";
import { parseTasks, taskSchema } from "./task";

describe("taskSchema", () => {
  it("accepts a complete task", () => {
    // Arrange
    const task = {
      id: "task-1",
      title: "Review inbox",
      completed: false,
      priority: "high" as const,
      dueDate: "2026-10-23T09:00:00.000Z",
      tags: ["work", "focus"],
      archived: false,
    };

    // Act
    const result = taskSchema.safeParse(task);

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects an empty title and invalid priority", () => {
    // Arrange
    const task = {
      id: "task-1",
      title: "   ",
      completed: false,
      priority: "urgent",
      tags: [],
      archived: false,
    };

    // Act
    const result = taskSchema.safeParse(task);

    // Assert
    expect(result.success).toBe(false);
  });

  it("rejects an invalid optional due date", () => {
    // Arrange
    const task = {
      id: "task-1",
      title: "Review inbox",
      completed: false,
      priority: "low",
      dueDate: "tomorrow",
      tags: [],
      archived: false,
    };

    // Act
    const result = taskSchema.safeParse(task);

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("parseTasks", () => {
  it("returns valid tasks and filters corrupt entries", () => {
    // Arrange
    const validTask = {
      id: "task-1",
      title: "Review inbox",
      completed: false,
      priority: "medium",
      tags: ["work"],
      archived: false,
    };
    const corruptTask = { ...validTask, completed: "no" };

    // Act
    const tasks = parseTasks([validTask, corruptTask]);

    // Assert
    expect(tasks).toEqual([validTask]);
  });

  it("returns an empty list for non-array input", () => {
    // Arrange
    const input: unknown = { tasks: [] };

    // Act
    const tasks = parseTasks(input);

    // Assert
    expect(tasks).toEqual([]);
  });

  it("returns an empty list for null input", () => {
    // Arrange
    const input: unknown = null;

    // Act
    const tasks = parseTasks(input);

    // Assert
    expect(tasks).toEqual([]);
  });
});
