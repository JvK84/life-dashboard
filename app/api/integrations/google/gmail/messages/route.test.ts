import { cookies } from "next/headers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";
import { encryptGoogleToken, GOOGLE_TOKEN_COOKIE } from "@/src/lib/services/google-calendar-session";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));

const cookiesMock = vi.mocked(cookies);

function setTokenCookie(token: { accessToken: string; refreshToken?: string; expiresAt: number }) {
  const cookieStore = {
    get: vi.fn((name: string) => name === GOOGLE_TOKEN_COOKIE ? { value: encryptGoogleToken(token, "test-secret") } : undefined),
    set: vi.fn(),
  };
  cookiesMock.mockResolvedValue(cookieStore as never);
  return cookieStore;
}

describe("GET /api/integrations/google/gmail/messages", () => {
  beforeEach(() => {
    process.env.GOOGLE_OAUTH_STATE_SECRET = "test-secret";
    process.env.GOOGLE_CLIENT_ID = "client-id";
    process.env.GOOGLE_CLIENT_SECRET = "client-secret";
    process.env.GOOGLE_REDIRECT_URI = "http://localhost/callback";
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.GOOGLE_OAUTH_STATE_SECRET;
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.GOOGLE_REDIRECT_URI;
    vi.clearAllMocks();
  });

  it("returns 401 without a Google token cookie", async () => {
    // Arrange
    cookiesMock.mockResolvedValue({ get: vi.fn().mockReturnValue(undefined) } as never);

    // Act
    const response = await GET();

    // Assert
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Gmail no está autorizado" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns 401 when the Google token cookie is invalid", async () => {
    // Arrange
    cookiesMock.mockResolvedValue({ get: vi.fn().mockReturnValue({ value: "invalid-token" }) } as never);

    // Act
    const response = await GET();

    // Assert
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Gmail no está autorizado" });
  });

  it("returns normalized unread messages and ignores references without ids", async () => {
    // Arrange
    setTokenCookie({ accessToken: "access", expiresAt: Date.now() + 3_600_000 });
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify({ messages: [{ id: "message-1" }, {}] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "message-1", internalDate: "1735689600000", labelIds: ["UNREAD"], snippet: "Hello", payload: { headers: [{ name: "From", value: "Ada <ada@example.com>" }, { name: "Subject", value: "Hola" }] } }), { status: 200 }));

    // Act
    const response = await GET();

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ messages: [{ id: "message-1", sender: "Ada <ada@example.com>", subject: "Hola", snippet: "Hello", date: "2025-01-01T00:00:00.000Z", unread: true }] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0][0])).toContain("labelIds=UNREAD");
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ headers: { Authorization: "Bearer access" } });
  });

  it("returns an empty list when Gmail has no unread messages", async () => {
    // Arrange
    setTokenCookie({ accessToken: "access", expiresAt: Date.now() + 3_600_000 });
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));

    // Act
    const response = await GET();

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ messages: [] });
  });

  it("refreshes an expired token and stores the refreshed cookie", async () => {
    // Arrange
    setTokenCookie({ accessToken: "expired", refreshToken: "refresh", expiresAt: 1 });
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "fresh", expires_in: 3600 }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ messages: [] }), { status: 200 }));
    // Act
    const response = await GET();

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ messages: [] });
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: "POST" });
    expect(response.headers.get("set-cookie")).toContain(`${GOOGLE_TOKEN_COOKIE}=`);
  });

  it("returns 500 when Gmail rejects the message list", async () => {
    // Arrange
    setTokenCookie({ accessToken: "access", expiresAt: Date.now() + 3_600_000 });
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 503 }));

    // Act
    const response = await GET();

    // Assert
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "No se pudieron cargar los mensajes de Gmail" });
  });

  it("returns 500 when Gmail rejects a message detail", async () => {
    // Arrange
    setTokenCookie({ accessToken: "access", expiresAt: Date.now() + 3_600_000 });
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify({ messages: [{ id: "message-1" }] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 404 }));

    // Act
    const response = await GET();

    // Assert
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "No se pudieron cargar los mensajes de Gmail" });
  });
});
