export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string;
  tags: string[];
  archived: boolean;
};

/**
 * Legacy shape used by the current dashboard widget until TASK-303 migrates
 * its presentation and interactions to the extended task model.
 */
export type DashboardTask = {
  id: string;
  label: string;
  done: boolean;
  tag: string;
};
