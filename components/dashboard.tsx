"use client";

import { useMemo, useState } from "react";
import {
  Archive, ArrowUpRight, CalendarDays, Check, Circle, Clock3, CloudSun,
  Mail, MoreHorizontal, Plus, Search, Send, Sparkles, Sun, Zap,
} from "lucide-react";

type Task = { id: number; label: string; done: boolean; tag: string };

const initialTasks: Task[] = [
  { id: 1, label: "Revisar propuesta de producto", done: true, tag: "Trabajo" },
  { id: 2, label: "Comprar ingredientes para la cena", done: false, tag: "Personal" },
  { id: 3, label: "30 min de lectura", done: false, tag: "Bienestar" },
];

const events = [
  { time: "10:00", title: "Daily de producto", color: "bg-lavender", duration: "30 min" },
  { time: "12:30", title: "Almuerzo con Ana", color: "bg-lime", duration: "1 h" },
  { time: "16:00", title: "Deep work", color: "bg-white", duration: "2 h" },
];

export function Dashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [archived, setArchived] = useState(false);
  const completed = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);

  function addTask(event: React.FormEvent) {
    event.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), label: newTask.trim(), done: false, tag: "Personal" }]);
    setNewTask("");
  }

  return (
    <main className="min-h-screen px-5 py-6 text-ink sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-ink text-lime"><Sparkles size={18} /></div><span className="font-semibold tracking-tight">life<span className="text-black/35">.</span></span></div>
          <div className="flex items-center gap-2"><button aria-label="Buscar" className="grid size-10 place-items-center rounded-full border border-black/10 bg-white/60"><Search size={17} /></button><div className="flex size-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">JA</div></div>
        </header>

        <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="mb-2 text-sm font-medium text-black/45">Jueves, 9 de octubre de 2026</p><h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Buenos días, Jalonso <span className="text-3xl">✦</span></h1></div>
          <div className="flex items-center gap-3 text-sm text-black/55"><span className="flex items-center gap-2"><CloudSun size={18} /> 19º · San Francisco</span><span className="h-4 w-px bg-black/15" /><span className="flex items-center gap-2"><Clock3 size={17} /> 09:42 AM</span></div>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <section className="rounded-[28px] bg-ink p-6 text-white shadow-soft lg:col-span-7 lg:p-8">
            <div className="mb-8 flex items-start justify-between"><div><div className="mb-3 flex items-center gap-2 text-sm text-white/50"><CalendarDays size={16} /> Mi agenda</div><h2 className="text-2xl font-semibold tracking-tight">Tu día, a vista de pájaro.</h2></div><button aria-label="Más opciones de agenda" className="text-white/45"><MoreHorizontal size={20} /></button></div>
            <div className="space-y-3">{events.map((event, index) => <div className="flex items-center gap-4" key={event.title}><span className="w-12 text-xs text-white/40">{event.time}</span><div className={`flex min-h-16 flex-1 items-center justify-between rounded-2xl px-4 text-ink ${event.color}`}><div className="flex items-center gap-3"><span className="size-2 rounded-full bg-ink/60" /><span className="font-medium">{event.title}</span></div><span className="text-xs text-ink/50">{event.duration}</span></div>{index === 0 && <span className="absolute ml-14 mt-20 h-3 w-3 rounded-full border-2 border-ink bg-lime" />}</div>)}</div>
            <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5"><span className="text-sm text-white/45">Próximo evento en <strong className="text-white">18 min</strong></span><button className="flex items-center gap-1 text-sm font-medium text-lime">Ver calendario <ArrowUpRight size={15} /></button></div>
          </section>

          <section className="rounded-[28px] bg-lime p-6 shadow-soft lg:col-span-5 lg:p-8"><div className="mb-8 flex items-start justify-between"><div><div className="mb-3 flex items-center gap-2 text-sm text-ink/55"><Zap size={16} /> Tu energía</div><h2 className="text-2xl font-semibold tracking-tight">Buen ritmo hoy.</h2></div><Sun size={28} className="text-ink/70" /></div><div className="mb-6 flex items-end gap-3"><span className="text-7xl font-semibold leading-none tracking-[-0.08em]">78</span><span className="pb-2 text-sm text-ink/55">/ 100</span></div><div className="mb-7 h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full w-[78%] rounded-full bg-ink" /></div><p className="max-w-xs text-sm leading-6 text-ink/65">Has dormido bien y tu mañana está despejada. Guarda tu foco para lo importante.</p></section>

          <section className="rounded-[28px] bg-white p-6 shadow-soft lg:col-span-5 lg:p-8"><div className="mb-7 flex items-start justify-between"><div><div className="mb-3 flex items-center gap-2 text-sm text-black/45"><Mail size={16} /> Bandeja de entrada</div><h2 className="text-2xl font-semibold tracking-tight">{archived ? "Todo al día." : "3 correos esperan."}</h2></div><button aria-label="Archivar correos" onClick={() => setArchived(true)} className="rounded-full bg-paper p-2 text-black/50 hover:text-ink"><Archive size={17} /></button></div>{archived ? <div className="grid min-h-36 place-items-center text-center text-sm text-black/45"><Check className="mb-2 text-green-600" /> Inbox limpia</div> : <div className="space-y-5"><div><p className="text-sm font-medium">Marta · Nuevo feedback del sprint</p><p className="mt-1 text-xs text-black/40">Hace 12 minutos</p></div><div><p className="text-sm font-medium">Linear · Tienes 2 tareas asignadas</p><p className="mt-1 text-xs text-black/40">Hace 1 hora</p></div><button className="flex items-center gap-1 text-sm font-medium text-black/60">Abrir Gmail <ArrowUpRight size={15} /></button></div>}</section>

          <section className="rounded-[28px] bg-lavender p-6 shadow-soft lg:col-span-7 lg:p-8"><div className="mb-7 flex items-start justify-between"><div><div className="mb-3 flex items-center gap-2 text-sm text-ink/55"><Check size={16} /> Enfoque de hoy</div><h2 className="text-2xl font-semibold tracking-tight">{completed} de {tasks.length} completadas.</h2></div><span className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium">{Math.round((completed / tasks.length) * 100)}%</span></div><div className="space-y-3">{tasks.map((task) => <button key={task.id} onClick={() => setTasks(tasks.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))} className="flex w-full items-center gap-3 text-left"><span className={`grid size-5 place-items-center rounded-full border ${task.done ? "border-ink bg-ink text-white" : "border-ink/25"}`}>{task.done ? <Check size={12} /> : <Circle size={8} className="text-transparent" />}</span><span className={`flex-1 text-sm ${task.done ? "text-black/35 line-through" : "font-medium"}`}>{task.label}</span><span className="text-xs text-black/35">{task.tag}</span></button>)}</div><form onSubmit={addTask} className="mt-6 flex items-center gap-2 border-t border-ink/10 pt-4"><Plus size={17} className="text-ink/50" /><input aria-label="Nueva tarea" value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Añade una tarea..." className="w-full bg-transparent text-sm outline-none placeholder:text-black/35" /><button aria-label="Añadir tarea" className="text-ink/50"><Send size={16} /></button></form></section>

          <section className="rounded-[28px] bg-white p-6 shadow-soft lg:col-span-12"><div className="mb-5 flex items-center justify-between"><div><div className="mb-2 flex items-center gap-2 text-sm text-black/45">Atajos rápidos</div><h2 className="text-xl font-semibold tracking-tight">Tu kit de herramientas</h2></div><button aria-label="Añadir atajo" className="grid size-9 place-items-center rounded-full bg-paper"><Plus size={17} /></button></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><a href="#notion" className="flex items-center justify-between rounded-2xl bg-paper p-4 text-sm font-medium transition hover:-translate-y-0.5"><span>Notion</span><ArrowUpRight size={15} className="text-black/35" /></a><a href="#github" className="flex items-center justify-between rounded-2xl bg-paper p-4 text-sm font-medium transition hover:-translate-y-0.5"><span>GitHub</span><ArrowUpRight size={15} className="text-black/35" /></a><a href="#linear" className="flex items-center justify-between rounded-2xl bg-paper p-4 text-sm font-medium transition hover:-translate-y-0.5"><span>Linear</span><ArrowUpRight size={15} className="text-black/35" /></a><a href="#scripts" className="flex items-center justify-between rounded-2xl bg-paper p-4 text-sm font-medium transition hover:-translate-y-0.5"><span>Mis scripts</span><ArrowUpRight size={15} className="text-black/35" /></a></div></section>
        </div>
        <footer className="py-8 text-center text-xs text-black/30">Hecho para que tu atención vuelva a lo importante.</footer>
      </div>
    </main>
  );
}
