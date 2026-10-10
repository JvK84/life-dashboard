import { Check, Circle, Plus, Send } from "lucide-react";
import { useState } from "react";
import type { Task } from "@/src/types/task";

type TasksWidgetProps = { tasks: Task[]; onToggle: (id: string) => void; onAdd: (label: string) => void };

export function TasksWidget({ tasks, onToggle, onAdd }: TasksWidgetProps) {
  const [newTask, setNewTask] = useState("");
  const completed = tasks.filter((task) => task.done).length;

  function submitTask(event: React.FormEvent) {
    event.preventDefault();
    const label = newTask.trim();
    if (!label) return;
    onAdd(label);
    setNewTask("");
  }

  return (
    <section className="rounded-[28px] bg-lavender p-6 shadow-soft lg:col-span-7 lg:p-8"><div className="mb-7 flex items-start justify-between"><div><div className="mb-3 flex items-center gap-2 text-sm text-ink/55"><Check size={16} /> Enfoque de hoy</div><h2 className="text-2xl font-semibold tracking-tight">{completed} de {tasks.length} completadas.</h2></div><span className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium">{tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100)}%</span></div><div className="space-y-3">{tasks.map((task) => <button type="button" key={task.id} aria-pressed={task.done} onClick={() => onToggle(task.id)} className="flex w-full items-center gap-3 text-left"><span className={`grid size-5 place-items-center rounded-full border ${task.done ? "border-ink bg-ink text-white" : "border-ink/25"}`}>{task.done ? <Check size={12} /> : <Circle size={8} className="text-transparent" />}</span><span className={`flex-1 text-sm ${task.done ? "text-black/35 line-through" : "font-medium"}`}>{task.label}</span><span className="text-xs text-black/35">{task.tag}</span></button>)}</div><form onSubmit={submitTask} className="mt-6 flex items-center gap-2 border-t border-ink/10 pt-4"><Plus size={17} className="text-ink/50" /><input aria-label="Nueva tarea" value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Añade una tarea..." className="w-full bg-transparent text-sm outline-none placeholder:text-black/35" /><button type="submit" aria-label="Añadir tarea" className="text-ink/50"><Send size={16} /></button></form></section>
  );
}
