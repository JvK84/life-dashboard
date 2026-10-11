export type GoogleCalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  htmlLink?: string;
};

export type GoogleCalendarToken = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
};

export type CalendarRange = "day" | "week" | "month";
