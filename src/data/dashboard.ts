import type { Task } from "@/src/types/task";

export const initialTasks: Task[] = [
  { id: "task-1", label: "Revisar propuesta de producto", done: true, tag: "Trabajo" },
  { id: "task-2", label: "Comprar ingredientes para la cena", done: false, tag: "Personal" },
  { id: "task-3", label: "30 min de lectura", done: false, tag: "Bienestar" },
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
