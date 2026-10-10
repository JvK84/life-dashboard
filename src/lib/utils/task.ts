import type { Task } from "@/src/types/task";

let nextTaskId = 4;

export function createTask(label: string): Task {
  return { id: `task-${nextTaskId++}`, label, done: false, tag: "Personal" };
}
