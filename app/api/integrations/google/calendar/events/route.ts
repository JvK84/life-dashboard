import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCalendarRangeWindow, parseCalendarRange } from "@/src/lib/utils/calendar-range";
import {
  listUpcomingGoogleEvents,
  refreshGoogleToken,
} from "@/src/lib/services/google-calendar";
import {
  encryptGoogleToken,
  decryptGoogleToken,
  GOOGLE_TOKEN_COOKIE,
} from "@/src/lib/services/google-calendar-session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const value = cookieStore.get(GOOGLE_TOKEN_COOKIE)?.value;
  if (!value) return NextResponse.json({ error: "Google Calendar no está conectado" }, { status: 401 });

  try {
    const token = decryptGoogleToken(value);
    const range = parseCalendarRange(new URL(request.url).searchParams.get("range"));
    const rangeWindow = getCalendarRangeWindow(range);
    const refreshedToken = token.expiresAt <= Date.now() + 60_000 ? await refreshGoogleToken(token) : token;
    const events = await listUpcomingGoogleEvents(refreshedToken, rangeWindow);
    const response = NextResponse.json({ events });
    if (refreshedToken !== token) {
      response.cookies.set(GOOGLE_TOKEN_COOKIE, encryptGoogleToken(refreshedToken), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }
    return response;
  } catch {
    return NextResponse.json({ error: "No se pudieron cargar los eventos de Google Calendar" }, { status: 502 });
  }
}
