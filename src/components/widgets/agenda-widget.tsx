import { ArrowUpRight, CalendarDays, MoreHorizontal } from "lucide-react";

type AgendaEvent = { time: string; title: string; color: string; duration: string };

export function AgendaWidget({ events }: { events: AgendaEvent[] }) {
  return (
    <section className="rounded-[28px] bg-ink p-6 text-white shadow-soft lg:col-span-7 lg:p-8">
      <div className="mb-8 flex items-start justify-between"><div><div className="mb-3 flex items-center gap-2 text-sm text-white/50"><CalendarDays size={16} /> Mi agenda</div><h2 className="text-2xl font-semibold tracking-tight">Tu día, a vista de pájaro.</h2></div><button aria-label="Más opciones de agenda" className="text-white/45"><MoreHorizontal size={20} /></button></div>
      <div className="space-y-3">{events.map((event, index) => <div className="flex items-center gap-4" key={event.title}><span className="w-12 text-xs text-white/40">{event.time}</span><div className={`flex min-h-16 flex-1 items-center justify-between rounded-2xl px-4 text-ink ${event.color}`}><div className="flex items-center gap-3"><span className="size-2 rounded-full bg-ink/60" /><span className="font-medium">{event.title}</span></div><span className="text-xs text-ink/50">{event.duration}</span></div>{index === 0 && <span className="absolute ml-14 mt-20 h-3 w-3 rounded-full border-2 border-ink bg-lime" />}</div>)}</div>
      <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5"><span className="text-sm text-white/45">Próximo evento en <strong className="text-white">18 min</strong></span><button className="flex items-center gap-1 text-sm font-medium text-lime">Ver calendario <ArrowUpRight size={15} /></button></div>
    </section>
  );
}
