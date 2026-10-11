import type { GoogleCalendarEvent, GoogleCalendarToken } from "@/src/types/google-calendar";

export const GOOGLE_CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events.readonly";
const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_EVENTS_ENDPOINT = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

type GoogleEnvironment = Record<string, string | undefined>;

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
};

type GoogleEventResponse = {
  items?: Array<{
    id?: string;
    summary?: string;
    htmlLink?: string;
    start?: { date?: string; dateTime?: string };
    end?: { date?: string; dateTime?: string };
  }>;
};

export class GoogleConfigurationError extends Error {
  constructor() {
    super("Google OAuth is not configured");
    this.name = "GoogleConfigurationError";
  }
}

export function getGoogleOAuthConfig(env: GoogleEnvironment = process.env): GoogleOAuthConfig {
  const { GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret, GOOGLE_REDIRECT_URI: redirectUri } = env;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new GoogleConfigurationError();
  }

  return { clientId, clientSecret, redirectUri };
}

export function createGoogleAuthorizationUrl(state: string, config = getGoogleOAuthConfig()): string {
  const url = new URL(GOOGLE_AUTH_ENDPOINT);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", GOOGLE_CALENDAR_SCOPE);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", state);
  return url.toString();
}

async function requestToken(
  body: URLSearchParams,
  config: GoogleOAuthConfig,
  fetchImpl: typeof fetch,
): Promise<GoogleTokenResponse> {
  const response = await fetchImpl(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) throw new Error(`Google token request failed with ${response.status}`);
  return (await response.json()) as GoogleTokenResponse;
}

export async function exchangeGoogleCode(
  code: string,
  config = getGoogleOAuthConfig(),
  fetchImpl: typeof fetch = fetch,
): Promise<GoogleCalendarToken> {
  const token = await requestToken(
    new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    }),
    config,
    fetchImpl,
  );

  return {
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    expiresAt: Date.now() + token.expires_in * 1000,
  };
}

export async function refreshGoogleToken(
  token: GoogleCalendarToken,
  config = getGoogleOAuthConfig(),
  fetchImpl: typeof fetch = fetch,
): Promise<GoogleCalendarToken> {
  if (!token.refreshToken) return token;

  const refreshed = await requestToken(
    new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: token.refreshToken,
      grant_type: "refresh_token",
    }),
    config,
    fetchImpl,
  );

  return {
    accessToken: refreshed.access_token,
    refreshToken: refreshed.refresh_token ?? token.refreshToken,
    expiresAt: Date.now() + refreshed.expires_in * 1000,
  };
}

export async function listUpcomingGoogleEvents(
  token: GoogleCalendarToken,
  options: { timeMin?: string; timeMax?: string; maxResults?: number } = {},
  fetchImpl: typeof fetch = fetch,
): Promise<GoogleCalendarEvent[]> {
  const url = new URL(GOOGLE_EVENTS_ENDPOINT);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("showDeleted", "false");
  url.searchParams.set("timeMin", options.timeMin ?? new Date().toISOString());
  url.searchParams.set("maxResults", String(options.maxResults ?? 10));
  if (options.timeMax) url.searchParams.set("timeMax", options.timeMax);

  const response = await fetchImpl(url, {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });
  if (!response.ok) throw new Error(`Google Calendar request failed with ${response.status}`);

  const data = (await response.json()) as GoogleEventResponse;
  return (data.items ?? [])
    .filter((event): event is Required<Pick<typeof event, "id">> & typeof event => Boolean(event.id))
    .map(normalizeGoogleEvent);
}

export function normalizeGoogleEvent(event: {
  id: string;
  summary?: string;
  htmlLink?: string;
  start?: { date?: string; dateTime?: string };
  end?: { date?: string; dateTime?: string };
}): GoogleCalendarEvent {
  const start = event.start?.dateTime ?? event.start?.date ?? "";
  const end = event.end?.dateTime ?? event.end?.date ?? start;
  return {
    id: event.id,
    title: event.summary?.trim() || "Sin título",
    start,
    end,
    allDay: Boolean(event.start?.date && !event.start?.dateTime),
    ...(event.htmlLink ? { htmlLink: event.htmlLink } : {}),
  };
}
