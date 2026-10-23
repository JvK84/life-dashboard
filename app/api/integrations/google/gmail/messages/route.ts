import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { listUnreadGmailMessages } from "@/src/lib/services/gmail";
import { refreshGoogleToken } from "@/src/lib/services/google-calendar";
import {
  decryptGoogleToken,
  encryptGoogleToken,
  GOOGLE_TOKEN_COOKIE,
} from "@/src/lib/services/google-calendar-session";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const value = cookieStore.get(GOOGLE_TOKEN_COOKIE)?.value;
  if (!value) return NextResponse.json({ error: "Gmail no está autorizado" }, { status: 401 });

  let token;
  try {
    token = decryptGoogleToken(value);
  } catch {
    return NextResponse.json({ error: "Gmail no está autorizado" }, { status: 401 });
  }

  try {
    const refreshedToken = token.expiresAt <= Date.now() + 60_000 ? await refreshGoogleToken(token) : token;
    const messages = await listUnreadGmailMessages(refreshedToken);
    const response = NextResponse.json({ messages });

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
    return NextResponse.json({ error: "No se pudieron cargar los mensajes de Gmail" }, { status: 500 });
  }
}
