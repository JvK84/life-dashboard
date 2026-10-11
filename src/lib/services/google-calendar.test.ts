import { describe, expect, it, vi } from "vitest";
import {
  createGoogleAuthorizationUrl,
  exchangeGoogleCode,
  getGoogleOAuthConfig,
  GOOGLE_CALENDAR_SCOPES,
  isBirthdayCalendar,
  listGoogleCalendars,
  listUpcomingGoogleEvents,
  normalizeGoogleEvent,
  refreshGoogleToken,
} from "./google-calendar";
import { createOAuthState, decryptGoogleToken, encryptGoogleToken } from "./google-calendar-session";

const config = {
  clientId: "client-id",
  clientSecret: "client-secret",
  redirectUri: "http://localhost/callback",
};

describe("Google Calendar service", () => {
  it("creates an offline authorization URL with the read-only scope", () => {
    // Arrange
    const state = "csrf-state";

    // Act
    const url = new URL(createGoogleAuthorizationUrl(state, config));

    // Assert
    expect(url.searchParams.get("client_id")).toBe(config.clientId);
    expect(url.searchParams.get("state")).toBe(state);
    expect(url.searchParams.get("access_type")).toBe("offline");
    expect(url.searchParams.get("scope")).toContain("calendar.events.readonly");
    expect(url.searchParams.get("scope")).toContain(GOOGLE_CALENDAR_SCOPES[1]);
  });

  it("creates a sufficiently unpredictable OAuth state", () => {
    // Arrange / Act
    const firstState = createOAuthState();
    const secondState = createOAuthState();

    // Assert
    expect(firstState).toHaveLength(43);
    expect(secondState).not.toBe(firstState);
  });

  it("rejects an incomplete OAuth configuration", () => {
    // Arrange / Act
    const createConfig = () => getGoogleOAuthConfig({});

    // Assert
    expect(createConfig).toThrow("Google OAuth is not configured");
  });

  it("returns a complete OAuth configuration", () => {
    // Arrange / Act
    const result = getGoogleOAuthConfig({
      GOOGLE_CLIENT_ID: "client-id",
      GOOGLE_CLIENT_SECRET: "client-secret",
      GOOGLE_REDIRECT_URI: "http://localhost/callback",
    });

    // Assert
    expect(result).toEqual(config);
  });

  it("exchanges an authorization code into a normalized token", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ access_token: "access", refresh_token: "refresh", expires_in: 3600 }), { status: 200 }),
    );

    // Act
    const token = await exchangeGoogleCode("code", config, fetchMock);

    // Assert
    expect(token.accessToken).toBe("access");
    expect(token.refreshToken).toBe("refresh");
    expect(token.expiresAt).toBeGreaterThan(Date.now());
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("surfaces a token endpoint failure", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 400 }));

    // Act / Assert
    await expect(exchangeGoogleCode("code", config, fetchMock)).rejects.toThrow("400");
  });

  it("refreshes an expiring token while retaining its refresh token", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ access_token: "new-access", expires_in: 3600 }), { status: 200 }),
    );
    const token = { accessToken: "old-access", refreshToken: "refresh", expiresAt: 0 };

    // Act
    const refreshed = await refreshGoogleToken(token, config, fetchMock);

    // Assert
    expect(refreshed).toMatchObject({ accessToken: "new-access", refreshToken: "refresh" });
  });

  it("surfaces a refresh endpoint failure", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }));

    // Act / Assert
    await expect(
      refreshGoogleToken({ accessToken: "old", refreshToken: "refresh", expiresAt: 0 }, config, fetchMock),
    ).rejects.toThrow("401");
  });

  it("does not call Google when there is no refresh token", async () => {
    // Arrange
    const fetchMock = vi.fn();
    const token = { accessToken: "access", expiresAt: Date.now() };

    // Act
    const result = await refreshGoogleToken(token, config, fetchMock);

    // Assert
    expect(result).toBe(token);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("normalizes timed and all-day events for the dashboard", () => {
    // Arrange
    const timedEvent = normalizeGoogleEvent({
      id: "timed",
      summary: "  Daily  ",
      start: { dateTime: "2026-10-11T10:00:00+02:00" },
      end: { dateTime: "2026-10-11T10:30:00+02:00" },
      htmlLink: "https://calendar.google.com/event",
    });
    const allDayEvent = normalizeGoogleEvent({ id: "all-day", start: { date: "2026-10-12" } });

    // Act / Assert
    expect(timedEvent).toEqual({
      id: "timed",
      title: "Daily",
      start: "2026-10-11T10:00:00+02:00",
      end: "2026-10-11T10:30:00+02:00",
      allDay: false,
      htmlLink: "https://calendar.google.com/event",
    });
    expect(allDayEvent).toMatchObject({ id: "all-day", title: "Sin título", allDay: true, end: "2026-10-12" });
    expect(normalizeGoogleEvent({ id: "empty", summary: "  " })).toMatchObject({
      id: "empty",
      title: "Sin título",
      start: "",
      end: "",
      allDay: false,
    });
    expect(normalizeGoogleEvent({ id: "fallback", start: { dateTime: "2026-10-11T10:00:00Z" } })).toMatchObject({
      id: "fallback",
      start: "2026-10-11T10:00:00Z",
      end: "2026-10-11T10:00:00Z",
    });
  });

  it("lists and normalizes upcoming events", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [{ id: "event-1", summary: "Planning", start: { dateTime: "2026-10-11T09:00:00Z" }, end: { dateTime: "2026-10-11T10:00:00Z" } }, { summary: "Ignored" }] }), { status: 200 }),
    );

    // Act
    const events = await listUpcomingGoogleEvents(
      { accessToken: "access", expiresAt: Date.now() },
      { timeMin: "2026-10-11T00:00:00Z", timeMax: "2026-10-12T00:00:00Z", maxResults: 5, calendarIds: ["primary"] },
      fetchMock,
    );

    // Assert
    expect(events).toHaveLength(1);
    expect(events[0].title).toBe("Planning");
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ headers: { Authorization: "Bearer access" } });
  });

  it("lists available calendars and excludes birthdays and hidden calendars", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [
            { id: "primary", summary: "Personal", primary: true },
            { id: "work", summaryOverride: "Trabajo" },
            { id: "contacts#birthday", summary: "Birthdays" },
            { id: "hidden", summary: "Hidden", hidden: true },
            { id: "deleted", summary: "Deleted", deleted: true },
            { summary: "Without id" },
          ],
        }),
        { status: 200 },
      ),
    );

    // Act
    const calendars = await listGoogleCalendars({ accessToken: "access", expiresAt: Date.now() }, fetchMock);

    // Assert
    expect(calendars).toEqual([
      { id: "primary", summary: "Personal", primary: true },
      { id: "work", summary: "Trabajo" },
    ]);
  });

  it("identifies birthday calendars by provider id or translated name", () => {
    // Arrange / Act / Assert
    expect(isBirthdayCalendar({ id: "birthdays", summary: "Birthdays" })).toBe(true);
    expect(isBirthdayCalendar({ id: "cumples", summary: "Cumpleaños" })).toBe(true);
    expect(isBirthdayCalendar({ id: "contacts#calendar", summary: "Contactos" })).toBe(true);
    expect(isBirthdayCalendar({ id: "work", summary: "Trabajo" })).toBe(false);
  });

  it("combines, orders, and limits events from several calendars", async () => {
    // Arrange
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ items: [{ id: "late", summary: "Trabajo", start: { dateTime: "2026-10-11T12:00:00Z" } }] }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ items: [{ id: "early", summary: "Personal", start: { dateTime: "2026-10-11T09:00:00Z" } }] }), { status: 200 }),
      );

    // Act
    const events = await listUpcomingGoogleEvents(
      { accessToken: "access", expiresAt: Date.now() },
      { calendarIds: ["work", "personal"], maxResults: 1 },
      fetchMock,
    );

    // Assert
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe("early");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("returns no events when the account has no usable calendars", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ items: [] }), { status: 200 }));

    // Act
    const events = await listUpcomingGoogleEvents({ accessToken: "access", expiresAt: Date.now() }, {}, fetchMock);

    // Assert
    expect(events).toEqual([]);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("returns an empty list when Google returns no events", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));

    // Act
    const events = await listUpcomingGoogleEvents({ accessToken: "access", expiresAt: Date.now() }, {}, fetchMock);

    // Assert
    expect(events).toEqual([]);
  });

  it("uses defaults when a selected calendar has no query options", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));

    // Act
    const events = await listUpcomingGoogleEvents(
      { accessToken: "access", expiresAt: Date.now() },
      { calendarIds: ["primary"] },
      fetchMock,
    );

    // Assert
    expect(events).toEqual([]);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("surfaces a Calendar API failure", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 403 }));

    // Act / Assert
    await expect(
      listUpcomingGoogleEvents({ accessToken: "access", expiresAt: Date.now() }, { calendarIds: ["primary"] }, fetchMock),
    ).rejects.toThrow("403");
  });

  it("encrypts and decrypts the token without exposing its contents", () => {
    // Arrange
    const token = { accessToken: "access", refreshToken: "refresh", expiresAt: 123 };

    // Act
    const encrypted = encryptGoogleToken(token, "test-secret");
    const decrypted = decryptGoogleToken(encrypted, "test-secret");

    // Assert
    expect(encrypted).not.toContain("access");
    expect(decrypted).toEqual(token);
  });

  it("rejects malformed or tampered token cookies", () => {
    // Arrange / Act / Assert
    expect(() => decryptGoogleToken("invalid", "test-secret")).toThrow("Invalid Google token cookie");
    const encrypted = encryptGoogleToken({ accessToken: "access", expiresAt: 123 }, "test-secret");
    expect(() => decryptGoogleToken(encrypted, "other-secret")).toThrow();
    const invalidPayload = encryptGoogleToken({ accessToken: "", expiresAt: 123 }, "test-secret");
    expect(() => decryptGoogleToken(invalidPayload, "test-secret")).toThrow("Invalid Google token payload");
    expect(() => encryptGoogleToken({ accessToken: "access", expiresAt: 123 }, "")).toThrow(
      "GOOGLE_OAUTH_STATE_SECRET is not configured",
    );
  });
});
