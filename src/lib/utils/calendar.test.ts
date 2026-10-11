import { describe, expect, it } from "vitest";
import { getNextAgendaLabel, toAgendaEvents } from "./calendar";

describe("calendar presentation", () => {
  it("formats timed, long, all-day, invalid, and zero-length events", () => {
    // Arrange
    const events = [
      { id: "timed", title: "Daily", start: "2026-10-11T10:00:00+02:00", end: "2026-10-11T10:30:00+02:00", allDay: false },
      { id: "long", title: "Deep work", start: "2026-10-11T12:00:00+02:00", end: "2026-10-11T14:30:00+02:00", allDay: false },
      { id: "all-day", title: "Festivo", start: "2026-10-12", end: "2026-10-13", allDay: true },
      { id: "invalid", title: "Sin hora", start: "invalid", end: "invalid", allDay: false },
      { id: "zero", title: "Punto", start: "2026-10-11T15:00:00Z", end: "2026-10-11T15:00:00Z", allDay: false },
    ];

    // Act
    const agendaEvents = toAgendaEvents(events);

    // Assert
    expect(agendaEvents).toHaveLength(5);
    expect(agendaEvents[0]).toMatchObject({ id: "timed", title: "Daily", duration: "30 min", color: "bg-lavender" });
    expect(agendaEvents[1]).toMatchObject({ duration: "2.5 h", color: "bg-lime" });
    expect(agendaEvents[2]).toMatchObject({ time: "Todo el día", duration: "Todo el día", color: "bg-white" });
    expect(agendaEvents[3]).toMatchObject({ time: "--:--", duration: "--", color: "bg-lavender" });
    expect(agendaEvents[4]).toMatchObject({ duration: "0 min", color: "bg-lime" });
  });

  it("calculates the next event and empty states", () => {
    // Arrange
    const now = new Date("2026-10-11T09:00:00Z");
    const agendaEvents = toAgendaEvents([
      { id: "past", title: "Pasado", start: "2026-10-11T08:00:00Z", end: "2026-10-11T08:30:00Z", allDay: false },
      { id: "next", title: "Siguiente", start: "2026-10-11T10:30:00Z", end: "2026-10-11T11:00:00Z", allDay: false },
    ]);

    // Act / Assert
    expect(getNextAgendaLabel(agendaEvents, now)).toBe("en 1 h 30 min");
    expect(getNextAgendaLabel([], now)).toBe("No hay eventos en este periodo.");
    expect(getNextAgendaLabel(agendaEvents.slice(0, 1), now)).toBe("No quedan más eventos en este periodo.");
  });
});
