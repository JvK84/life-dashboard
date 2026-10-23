import type { DashboardTask } from "@/src/types/task";

let nextTaskId = 4;

export function createTask(label: string): DashboardTask {
  return { id: `task-${nextTaskId++}`, label, done: false, tag: "Personal" };
}
