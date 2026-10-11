import type { GoogleCalendarEvent } from "@/src/types/google-calendar";

export type AgendaEvent = {
  id: string;
  startsAt?: string;
  time: string;
  title: string;
  color: string;
  duration: string;
};

const EVENT_COLORS = ["bg-lavender", "bg-lime", "bg-white"];

function formatEventTime(event: GoogleCalendarEvent): string {
  if (event.allDay) return "Todo el día";

  const date = new Date(event.start);
  if (Number.isNaN(date.getTime())) return "--:--";

  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatDuration(event: GoogleCalendarEvent): string {
  if (event.allDay) return "Todo el día";

  const start = new Date(event.start).getTime();
  const end = new Date(event.end).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return "--";

  const durationInMinutes = Math.max(0, Math.round((end - start) / 60000));
  if (durationInMinutes >= 60) {
    const hours = durationInMinutes / 60;
    return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} h`;
  }

  return `${durationInMinutes} min`;
}

export function toAgendaEvents(events: GoogleCalendarEvent[]): AgendaEvent[] {
  return events.map((event, index) => ({
    id: event.id,
    startsAt: event.start,
    time: formatEventTime(event),
    title: event.title,
    color: EVENT_COLORS[index % EVENT_COLORS.length],
    duration: formatDuration(event),
  }));
}

export function getNextAgendaEvent(events: AgendaEvent[], now = new Date()): AgendaEvent | undefined {
  return events
    .filter((event) => event.startsAt && new Date(event.startsAt).getTime() >= now.getTime())
    .sort((left, right) => new Date(left.startsAt ?? 0).getTime() - new Date(right.startsAt ?? 0).getTime())[0];
}

export function getNextAgendaLabel(events: AgendaEvent[], now = new Date()): string {
  if (events.length === 0) return "No hay eventos en este periodo.";

  const nextEvent = getNextAgendaEvent(events, now);
  if (!nextEvent) return "No quedan más eventos en este periodo.";

  const minutes = Math.max(0, Math.round((new Date(nextEvent.startsAt ?? now).getTime() - now.getTime()) / 60000));
  if (minutes === 0) return "Ahora";
  if (minutes < 60) return `en ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes === 0 ? `en ${hours} h` : `en ${hours} h ${remainingMinutes} min`;
}
