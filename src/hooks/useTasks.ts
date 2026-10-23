import { useEffect, useMemo, useState } from "react";
import { parseTasks } from "@/src/lib/validations/task";
import type { Task } from "@/src/types/task";

export const TASKS_STORAGE_KEY = "life-dashboard.tasks";

export type TaskDraft = Omit<Task, "id">;

export type UseTasksOptions = {
  storageKey?: string;
  initialTasks?: Task[];
  generateId?: () => string;
};

export type UseTasksResult = {
  tasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  archivedTasks: Task[];
  tasksByTag: Record<string, Task[]>;
  filterByTag: (tag: string) => Task[];
  addTask: (task: TaskDraft) => Task;
  updateTask: (id: string, updates: Partial<TaskDraft>) => void;
  deleteTask: (id: string) => void;
  toggleArchiveTask: (id: string) => void;
};

const defaultGenerateId = () => crypto.randomUUID();

export function readStoredTasks(storageKey: string, fallback: Task[]): Task[] {
  if (typeof window === "undefined") return fallback;

  try {
    const storedTasks = window.localStorage.getItem(storageKey);
    if (!storedTasks) return fallback;

    return parseTasks(JSON.parse(storedTasks));
  } catch {
    return fallback;
  }
}

export function useTasks(options: UseTasksOptions = {}): UseTasksResult {
  const { storageKey = TASKS_STORAGE_KEY, initialTasks = [], generateId = defaultGenerateId } = options;
  const [tasks, setTasks] = useState<Task[]>(() => readStoredTasks(storageKey, initialTasks));

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch {
      // LocalStorage can be unavailable or full; in-memory state remains usable.
    }
  }, [storageKey, tasks]);

  const activeTasks = useMemo(() => tasks.filter((task) => !task.completed && !task.archived), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed && !task.archived), [tasks]);
  const archivedTasks = useMemo(() => tasks.filter((task) => task.archived), [tasks]);
  const tasksByTag = useMemo(
    () =>
      tasks.reduce<Record<string, Task[]>>((groups, task) => {
        task.tags.forEach((tag) => {
          groups[tag] = [...(groups[tag] ?? []), task];
        });
        return groups;
      }, {}),
    [tasks],
  );

  function filterByTag(tag: string): Task[] {
    return tasks.filter((task) => task.tags.includes(tag));
  }

  function addTask(task: TaskDraft): Task {
    const newTask = { ...task, id: generateId() };
    setTasks((previousTasks) => [...previousTasks, newTask]);
    return newTask;
  }

  function updateTask(id: string, updates: Partial<TaskDraft>): void {
    setTasks((previousTasks) => previousTasks.map((task) => task.id === id ? { ...task, ...updates } : task));
  }

  function deleteTask(id: string): void {
    setTasks((previousTasks) => previousTasks.filter((task) => task.id !== id));
  }

  function toggleArchiveTask(id: string): void {
    setTasks((previousTasks) => previousTasks.map((task) => task.id === id ? { ...task, archived: !task.archived } : task));
  }

  return { tasks, activeTasks, completedTasks, archivedTasks, tasksByTag, filterByTag, addTask, updateTask, deleteTask, toggleArchiveTask };
}
