import { NextResponse } from "next/server";
import { createGoogleAuthorizationUrl } from "@/src/lib/services/google-calendar";
import { createOAuthState, GOOGLE_STATE_COOKIE } from "@/src/lib/services/google-calendar-session";

export const runtime = "nodejs";

export function GET() {
  try {
    const state = createOAuthState();
    const response = NextResponse.redirect(createGoogleAuthorizationUrl(state));
    response.cookies.set(GOOGLE_STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 600,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Google Calendar no está configurado" }, { status: 503 });
  }
}
