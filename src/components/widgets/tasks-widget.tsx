"use client";

import { Archive, Check, Circle, Pencil, Plus, RotateCcw, Send } from "lucide-react";
import { useState } from "react";
import type { Task, TaskPriority } from "@/src/types/task";
import type { TaskDraft } from "@/src/hooks/useTasks";

type TaskFilter = "all" | "active" | "completed" | "archived";
type TasksWidgetProps = {
  tasks: Task[];
  allTasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  archivedTasks: Task[];
  onToggle: (id: string) => void;
  onAdd: (task: TaskDraft) => Task;
  onUpdate: (id: string, updates: Partial<TaskDraft>) => void;
  onArchive: (id: string) => void;
};

const priorityLabels: Record<TaskPriority, string> = { low: "Baja", medium: "Media", high: "Alta" };

export function TasksWidget({ tasks, allTasks, activeTasks, completedTasks, archivedTasks, onToggle, onAdd, onUpdate, onArchive }: TasksWidgetProps) {
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingPriority, setEditingPriority] = useState<TaskPriority>("medium");
  const filteredTasks = filter === "all" ? tasks : filter === "active" ? tasks.filter((task) => activeTasks.some((item) => item.id === task.id)) : filter === "completed" ? tasks.filter((task) => completedTasks.some((item) => item.id === task.id)) : tasks.filter((task) => archivedTasks.some((item) => item.id === task.id));
  const completed = allTasks.filter((task) => task.completed).length;
  const tabs: Array<{ id: TaskFilter; label: string; count: number }> = [{ id: "all", label: "Todas", count: allTasks.length }, { id: "active", label: "Pendientes", count: activeTasks.length }, { id: "completed", label: "Completadas", count: completedTasks.length }, { id: "archived", label: "Archivadas", count: archivedTasks.length }];

  function submitTask(event: React.FormEvent) {
    event.preventDefault();
    const title = newTask.trim();
    if (!title) return;
    onAdd({ title, completed: false, priority: newPriority, tags: [], archived: false });
    setNewTask("");
  }

  function startEditing(task: Task) {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setEditingPriority(task.priority);
  }

  function saveEditing(event: React.FormEvent, task: Task) {
    event.preventDefault();
    const title = editingTitle.trim();
    if (!title) return;
    onUpdate(task.id, { title, priority: editingPriority });
    setEditingId(null);
  }

  return <section id="dashboard-tasks" aria-label="Tareas de hoy" className="rounded-[28px] bg-lavender p-6 shadow-soft lg:col-span-7 lg:p-8">
    <div className="mb-5 flex items-start justify-between"><div><div className="mb-3 flex items-center gap-2 text-sm text-ink/55"><Check size={16} /> Enfoque de hoy</div><h2 className="text-2xl font-semibold tracking-tight">{completed} de {allTasks.length} completadas.</h2></div><span className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium">{allTasks.length === 0 ? 0 : Math.round((completed / allTasks.length) * 100)}%</span></div>
    <div role="tablist" aria-label="Filtrar tareas" className="mb-5 flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={filter === tab.id} onClick={() => setFilter(tab.id)} className="rounded-full px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink aria-selected:bg-ink aria-selected:text-white">{tab.label} ({tab.count})</button>)}</div>
    <div role="tabpanel" aria-label={`Tareas ${tabs.find((tab) => tab.id === filter)?.label.toLocaleLowerCase()}`} className="space-y-3">{filteredTasks.length > 0 ? filteredTasks.map((task) => editingId === task.id ? <form key={task.id} onSubmit={(event) => saveEditing(event, task)} className="flex flex-wrap items-center gap-2 rounded-xl bg-white/50 p-2"><input aria-label={`Editar ${task.title}`} value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} className="min-w-0 flex-1 rounded px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink" /><select aria-label="Prioridad de edición" value={editingPriority} onChange={(event) => setEditingPriority(event.target.value as TaskPriority)} className="rounded px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">{Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button type="submit" aria-label="Guardar cambios" className="rounded px-2 py-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">Guardar</button></form> : <div key={task.id} className="flex items-center gap-2"><button type="button" aria-pressed={task.completed} onClick={() => onToggle(task.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"><span className={`grid size-5 place-items-center rounded-full border ${task.completed ? "border-ink bg-ink text-white" : "border-ink/25"}`}>{task.completed ? <Check size={12} /> : <Circle size={8} className="text-transparent" />}</span><span className={`flex-1 text-sm ${task.completed ? "text-black/35 line-through" : "font-medium"}`}>{task.title}</span><span className={`rounded-full px-2 py-0.5 text-xs ${task.priority === "high" ? "bg-red-100 text-red-800" : task.priority === "medium" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{priorityLabels[task.priority]}</span></button><button type="button" aria-label="Editar tarea" onClick={() => startEditing(task)} className="rounded p-1 text-ink/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"><Pencil size={14} /></button><button type="button" aria-label={task.archived ? "Desarchivar tarea" : "Archivar tarea"} onClick={() => onArchive(task.id)} className="rounded p-1 text-ink/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">{task.archived ? <RotateCcw size={14} /> : <Archive size={14} />}</button></div>) : <p role="status" className="py-4 text-sm text-ink/60">No hay tareas en este filtro. No hay tareas que coincidan con tu búsqueda.</p>}</div>
    <form onSubmit={submitTask} className="mt-6 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-4"><Plus size={17} className="text-ink/50" /><input aria-label="Nueva tarea" value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Añade una tarea..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/35 focus-visible:ring-2 focus-visible:ring-ink" /><select aria-label="Prioridad de nueva tarea" value={newPriority} onChange={(event) => setNewPriority(event.target.value as TaskPriority)} className="rounded px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">{Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button type="submit" aria-label="Añadir tarea" className="text-ink/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"><Send size={16} /></button></form>
  </section>;
}
