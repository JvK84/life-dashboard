"use client";

import { useCallback, useEffect, useState } from "react";
import { Moon, Search, Sparkles, Sun } from "lucide-react";
import { events, initialTasks } from "@/src/data/dashboard";
import { toAgendaEvents, type AgendaEvent } from "@/src/lib/utils/calendar";
import type { CalendarRange } from "@/src/types/google-calendar";
import type { InboxMessage } from "@/src/types/inbox";
import { AgendaWidget } from "@/src/components/widgets/agenda-widget";
import { EnergyWidget } from "@/src/components/widgets/energy-widget";
import { InboxWidget } from "@/src/components/widgets/inbox-widget";
import { QuickLinksWidget } from "@/src/components/widgets/quick-links-widget";
import { TasksWidget } from "@/src/components/widgets/tasks-widget";
import { HeaderWidget } from "@/components/widgets/HeaderWidget";
import { useKeyboardShortcuts } from "@/src/hooks/useKeyboardShortcuts";
import { useTasks } from "@/src/hooks/useTasks";
import { ErrorBoundary } from "@/src/components/error/ErrorBoundary";
import { ApiClientError, fetchWithRetry } from "@/src/services/apiClient";
import { useGlobalError } from "@/src/context/ErrorContext";
const THEME_STORAGE_KEY = "life-dashboard.theme";
type Theme = "light" | "dark";

export function Dashboard() {
  const { showError } = useGlobalError();
  const { tasks, activeTasks, completedTasks, archivedTasks, addTask, updateTask, toggleArchiveTask } = useTasks({ initialTasks });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [archived, setArchived] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [isShortcutHelpOpen, setIsShortcutHelpOpen] = useState(false);
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>(() => events.map((event, index) => ({ ...event, id: `mock-${index}` })));
  const [agendaRange, setAgendaRange] = useState<CalendarRange>("day");
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>([]);
  const [isInboxLoading, setIsInboxLoading] = useState(true);
  const [isInboxConnected, setIsInboxConnected] = useState(false);
  const [inboxError, setInboxError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    fetchWithRetry(`/api/integrations/google/calendar/events?range=${agendaRange}`, {}, 2, (error) => showError(error.message, { code: error.code }))
      .then((response) => {
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
  }, [agendaRange, showError]);

  useEffect(() => {
    let isCurrent = true;

    fetchWithRetry("/api/integrations/google/gmail/messages", {}, 2, (error) => showError(error.message, { code: error.code }))
      .then(async (response) => {
        const payload = await response.json() as { messages?: InboxMessage[] };
        if (isCurrent) {
          setIsInboxConnected(true);
          setInboxMessages(payload.messages ?? []);
          setInboxError(null);
        }
        return payload;
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setIsInboxConnected(false);
          setInboxError(error instanceof ApiClientError && error.status === 401 ? "Conecta Google para consultar tu correo." : "No se pudieron cargar los mensajes de Gmail.");
        }
      })
      .finally(() => {
        if (isCurrent) setIsInboxLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [showError]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") setTheme(storedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const focusNewTask = useCallback(() => {
    document.querySelector<HTMLInputElement>('input[aria-label="Nueva tarea"]')?.focus();
  }, []);
  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light");
  }, []);
  const closeShortcutHelp = useCallback(() => setIsShortcutHelpOpen(false), []);
  useKeyboardShortcuts({ onNewTask: focusNewTask, onToggleTheme: toggleTheme, onShowHelp: () => setIsShortcutHelpOpen(true), onCloseHelp: closeShortcutHelp });

  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
  const visibleTasks = tasks.filter((task) => `${task.title} ${task.tags.join(" ")}`.toLocaleLowerCase().includes(normalizedSearchQuery));

  return (
    <main className="min-h-screen px-5 py-6 text-ink dark:text-white sm:px-8 lg:px-12 lg:py-10">
      {isShortcutHelpOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5" role="presentation" onClick={closeShortcutHelp}><section role="dialog" aria-modal="true" aria-labelledby="shortcut-help-title" className="w-full max-w-md rounded-3xl bg-white p-6 text-ink shadow-xl dark:bg-[#1c1c20] dark:text-white" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-black/50 dark:text-white/50">Navegación rápida</p><h2 id="shortcut-help-title" className="text-xl font-semibold">Atajos de teclado</h2></div><button type="button" aria-label="Cerrar ayuda de atajos" onClick={closeShortcutHelp} className="rounded-full px-2 py-1 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">×</button></div><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt>Nueva tarea</dt><dd><kbd className="rounded bg-black/10 px-2 py-1 font-mono dark:bg-white/10">N</kbd></dd></div><div className="flex justify-between gap-4"><dt>Cambiar tema</dt><dd><kbd className="rounded bg-black/10 px-2 py-1 font-mono dark:bg-white/10">D</kbd></dd></div><div className="flex justify-between gap-4"><dt>Abrir esta ayuda</dt><dd><kbd className="rounded bg-black/10 px-2 py-1 font-mono dark:bg-white/10">?</kbd></dd></div><div className="flex justify-between gap-4"><dt>Cerrar diálogo</dt><dd><kbd className="rounded bg-black/10 px-2 py-1 font-mono dark:bg-white/10">Esc</kbd></dd></div></dl></section></div>}
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-10 flex flex-wrap items-center gap-5 lg:flex-nowrap">
          <div className="flex shrink-0 items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-ink text-lime"><Sparkles size={18} /></div><span className="font-semibold tracking-tight">life<span className="text-black/35 dark:text-white/35">.</span></span></div>
          <div className="order-3 min-w-0 flex-1 basis-full text-center lg:order-2 lg:basis-auto lg:text-left"><p className="text-xs font-medium text-black/45 dark:text-white/55">Jueves, 9 de octubre de 2026</p><h1 className="mt-1 truncate text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">Buenos días, Jalonso <span className="text-2xl">✦</span></h1></div>
          <div className="order-2 ml-auto flex items-center gap-4 lg:order-3"><HeaderWidget /><div className="flex items-center gap-2">{isSearchOpen && <input type="search" aria-label="Buscar tareas" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Buscar tareas" className="w-40 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ink dark:border-white/10 dark:bg-white/10" />}<button type="button" aria-label="Buscar" aria-expanded={isSearchOpen} aria-controls="dashboard-tasks" onClick={() => setIsSearchOpen((current) => !current)} className="grid size-10 place-items-center rounded-full border border-black/10 bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink dark:border-white/10 dark:bg-white/10"><Search size={17} /></button><button type="button" aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"} onClick={toggleTheme} className="grid size-10 place-items-center rounded-full border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/10">{theme === "light" ? <Moon size={17} /> : <Sun size={17} />}</button><div className="flex size-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">JA</div></div></div>
        </header>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12"><ErrorBoundary><AgendaWidget events={agendaEvents} range={agendaRange} onRangeChange={setAgendaRange} isConnected={isCalendarConnected} /></ErrorBoundary><ErrorBoundary><EnergyWidget /></ErrorBoundary><ErrorBoundary><InboxWidget archived={archived} error={inboxError} isConnected={isInboxConnected} isLoading={isInboxLoading} messages={inboxMessages} onArchive={() => setArchived(true)} /></ErrorBoundary><ErrorBoundary><TasksWidget tasks={visibleTasks} allTasks={tasks} activeTasks={activeTasks} completedTasks={completedTasks} archivedTasks={archivedTasks} onToggle={(id) => { const task = tasks.find((item) => item.id === id); if (task) updateTask(id, { completed: !task.completed }); }} onAdd={addTask} onUpdate={updateTask} onArchive={toggleArchiveTask} /></ErrorBoundary><ErrorBoundary><QuickLinksWidget /></ErrorBoundary></div>
        <footer className="py-8 text-center text-xs text-black/30">Hecho para que tu atención vuelva a lo importante.</footer>
      </div>
    </main>
  );
}
