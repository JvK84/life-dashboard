"use client";

import { useEffect, useState } from "react";
import { Moon, Search, Sparkles, Sun } from "lucide-react";
import { events, initialTasks } from "@/src/data/dashboard";
import { toAgendaEvents, type AgendaEvent } from "@/src/lib/utils/calendar";
import type { CalendarRange } from "@/src/types/google-calendar";
import { AgendaWidget } from "@/src/components/widgets/agenda-widget";
import { EnergyWidget } from "@/src/components/widgets/energy-widget";
import { InboxWidget } from "@/src/components/widgets/inbox-widget";
import { QuickLinksWidget } from "@/src/components/widgets/quick-links-widget";
import { TasksWidget } from "@/src/components/widgets/tasks-widget";
import { HeaderWidget } from "@/components/widgets/HeaderWidget";
import { useTasks } from "@/src/hooks/useTasks";
const THEME_STORAGE_KEY = "life-dashboard.theme";
type Theme = "light" | "dark";

export function Dashboard() {
  const { tasks, activeTasks, completedTasks, archivedTasks, addTask, updateTask, toggleArchiveTask } = useTasks({ initialTasks });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [archived, setArchived] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>(() => events.map((event, index) => ({ ...event, id: `mock-${index}` })));
  const [agendaRange, setAgendaRange] = useState<CalendarRange>("day");
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    fetch(`/api/integrations/google/calendar/events?range=${agendaRange}`)
      .then((response) => {
        if (!response.ok) {
          if (isCurrent) setIsCalendarConnected(false);
          return null;
        }

        if (isCurrent) setIsCalendarConnected(true);
        return response.json();
      })
      .then((payload: { events?: Array<{ id: string; title: string; start: string; end: string; allDay: boolean }> } | null) => {
        if (isCurrent && payload?.events) setAgendaEvents(toAgendaEvents(payload.events));
      })
      .catch(() => undefined);

    return () => {
      isCurrent = false;
    };
  }, [agendaRange]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") setTheme(storedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
  const visibleTasks = tasks.filter((task) => `${task.title} ${task.tags.join(" ")}`.toLocaleLowerCase().includes(normalizedSearchQuery));

  return (
    <main className="min-h-screen px-5 py-6 text-ink dark:text-white sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-10 flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-ink text-lime"><Sparkles size={18} /></div><span className="font-semibold tracking-tight">life<span className="text-black/35 dark:text-white/35">.</span></span></div><div className="flex items-center gap-2">{isSearchOpen && <input type="search" aria-label="Buscar tareas" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Buscar tareas" className="w-40 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ink dark:border-white/10 dark:bg-white/10" />}<button type="button" aria-label="Buscar" aria-expanded={isSearchOpen} aria-controls="dashboard-tasks" onClick={() => setIsSearchOpen((current) => !current)} className="grid size-10 place-items-center rounded-full border border-black/10 bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink dark:border-white/10 dark:bg-white/10"><Search size={17} /></button><button type="button" aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"} onClick={() => setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light")} className="grid size-10 place-items-center rounded-full border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/10">{theme === "light" ? <Moon size={17} /> : <Sun size={17} />}</button><div className="flex size-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">JA</div></div></header>
        <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-sm font-medium text-black/45 dark:text-white/55">Jueves, 9 de octubre de 2026</p><h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Buenos días, Jalonso <span className="text-3xl">✦</span></h1></div><HeaderWidget /></section>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12"><AgendaWidget events={agendaEvents} range={agendaRange} onRangeChange={setAgendaRange} isConnected={isCalendarConnected} /><EnergyWidget /><InboxWidget archived={archived} onArchive={() => setArchived(true)} /><TasksWidget tasks={visibleTasks} allTasks={tasks} activeTasks={activeTasks} completedTasks={completedTasks} archivedTasks={archivedTasks} onToggle={(id) => { const task = tasks.find((item) => item.id === id); if (task) updateTask(id, { completed: !task.completed }); }} onAdd={addTask} onUpdate={updateTask} onArchive={toggleArchiveTask} /><QuickLinksWidget /></div>
        <footer className="py-8 text-center text-xs text-black/30">Hecho para que tu atención vuelva a lo importante.</footer>
      </div>
    </main>
  );
}
