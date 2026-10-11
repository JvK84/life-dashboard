import type { CalendarRange } from "@/src/types/google-calendar";

export type CalendarRangeWindow = {
  timeMin: string;
  timeMax: string;
};

export function parseCalendarRange(value: string | null): CalendarRange {
  if (value === "week" || value === "month") return value;
  return "day";
}

export function getCalendarRangeWindow(range: CalendarRange, now = new Date()): CalendarRangeWindow {
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);

  if (range === "week") {
    const daysFromMonday = (start.getUTCDay() + 6) % 7;
    start.setUTCDate(start.getUTCDate() - daysFromMonday);
  }

  if (range === "month") start.setUTCDate(1);

  const end = new Date(start);
  if (range === "month") {
    end.setUTCMonth(end.getUTCMonth() + 1, 1);
  } else {
    end.setUTCDate(end.getUTCDate() + (range === "week" ? 7 : 1));
  }

  return { timeMin: start.toISOString(), timeMax: end.toISOString() };
}
