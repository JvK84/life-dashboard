import type { Task } from "@/src/types/task";

export const initialTasks: Task[] = [
  { id: "task-1", title: "Revisar propuesta de producto", completed: true, priority: "high", tags: ["Trabajo"], archived: false },
  { id: "task-2", title: "Comprar ingredientes para la cena", completed: false, priority: "medium", tags: ["Personal"], archived: false },
  { id: "task-3", title: "30 min de lectura", completed: false, priority: "low", tags: ["Bienestar"], archived: false },
];

export const events = [
  { time: "10:00", title: "Daily de producto", color: "bg-lavender", duration: "30 min" },
  { time: "12:30", title: "Almuerzo con Ana", color: "bg-lime", duration: "1 h" },
  { time: "16:00", title: "Deep work", color: "bg-white", duration: "2 h" },
];

export const dashboardSnapshot = {
  date: "Jueves, 9 de octubre de 2026",
  weather: "19º · San Francisco",
  time: "09:42 AM",
};
