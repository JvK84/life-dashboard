"use client";

import { useEffect, useState } from "react";
import { Clock3, CloudSun, Search, Sparkles } from "lucide-react";
import { dashboardSnapshot, events, initialTasks } from "@/src/data/dashboard";
import { createTask } from "@/src/lib/utils/task";
import { AgendaWidget } from "@/src/components/widgets/agenda-widget";
import { EnergyWidget } from "@/src/components/widgets/energy-widget";
import { InboxWidget } from "@/src/components/widgets/inbox-widget";
import { QuickLinksWidget } from "@/src/components/widgets/quick-links-widget";
import { TasksWidget } from "@/src/components/widgets/tasks-widget";
import type { Task } from "@/src/types/task";

const TASKS_STORAGE_KEY = "life-dashboard.tasks";

export function Dashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [archived, setArchived] = useState(false);

  useEffect(() => {
    const storedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
    if (!storedTasks) return;

    try {
      setTasks(JSON.parse(storedTasks) as Task[]);
    } catch {
      window.localStorage.removeItem(TASKS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  return (
    <main className="min-h-screen px-5 py-6 text-ink sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-10 flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-ink text-lime"><Sparkles size={18} /></div><span className="font-semibold tracking-tight">life<span className="text-black/35">.</span></span></div><div className="flex items-center gap-2"><button aria-label="Buscar" className="grid size-10 place-items-center rounded-full border border-black/10 bg-white/60"><Search size={17} /></button><div className="flex size-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">JA</div></div></header>
        <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-sm font-medium text-black/45">{dashboardSnapshot.date}</p><h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Buenos días, Jalonso <span className="text-3xl">✦</span></h1></div><div className="flex items-center gap-3 text-sm text-black/55"><span className="flex items-center gap-2"><CloudSun size={18} /> {dashboardSnapshot.weather}</span><span className="h-4 w-px bg-black/15" /><span className="flex items-center gap-2"><Clock3 size={17} /> {dashboardSnapshot.time}</span></div></section>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12"><AgendaWidget events={events} /><EnergyWidget /><InboxWidget archived={archived} onArchive={() => setArchived(true)} /><TasksWidget tasks={tasks} onToggle={(id) => setTasks((currentTasks) => currentTasks.map((task) => task.id === id ? { ...task, done: !task.done } : task))} onAdd={(label) => setTasks((currentTasks) => [...currentTasks, createTask(label)])} /><QuickLinksWidget /></div>
        <footer className="py-8 text-center text-xs text-black/30">Hecho para que tu atención vuelva a lo importante.</footer>
      </div>
    </main>
  );
}
