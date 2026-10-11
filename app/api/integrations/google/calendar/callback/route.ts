import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { exchangeGoogleCode } from "@/src/lib/services/google-calendar";
import {
  encryptGoogleToken,
  GOOGLE_STATE_COOKIE,
  GOOGLE_TOKEN_COOKIE,
} from "@/src/lib/services/google-calendar-session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = (await cookies()).get(GOOGLE_STATE_COOKIE)?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.json({ error: "OAuth state inválido" }, { status: 400 });
  }

  try {
    const token = await exchangeGoogleCode(code);
    const response = NextResponse.redirect(new URL("/?google=connected", request.url));
    response.cookies.delete(GOOGLE_STATE_COOKIE);
    response.cookies.set(GOOGLE_TOKEN_COOKIE, encryptGoogleToken(token), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "No se pudo completar la conexión con Google" }, { status: 502 });
  }
}
