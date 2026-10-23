import { describe, expect, it } from "vitest";
import { normalizeGmailMessage } from "./normalizer";

describe("normalizeGmailMessage", () => {
  it("normalizes a complete Gmail message", () => {
    // Arrange
    const rawMessage = {
      id: "message-1",
      internalDate: "1735689600000",
      labelIds: ["INBOX", "UNREAD"],
      snippet: "  Recordatorio de la reunión  ",
      payload: {
        headers: [
          { name: "From", value: " Ada Lovelace <ada@example.com> " },
          { name: "Subject", value: "  Reunión semanal  " },
        ],
      },
    };

    // Act
    const result = normalizeGmailMessage(rawMessage);

    // Assert
    expect(result).toEqual({
      id: "message-1",
      sender: "Ada Lovelace <ada@example.com>",
      subject: "Reunión semanal",
      snippet: "Recordatorio de la reunión",
      date: "2025-01-01T00:00:00.000Z",
      unread: true,
    });
  });

  it("uses deterministic fallbacks for incomplete messages", () => {
    // Arrange
    const rawMessage = {
      id: "message-2",
      internalDate: 0,
      labelIds: ["INBOX"],
      payload: { headers: [{ name: "Subject", value: "   " }] },
    };

    // Act
    const result = normalizeGmailMessage(rawMessage);

    // Assert
    expect(result).toEqual({
      id: "message-2",
      sender: "Remitente desconocido",
      subject: "Sin asunto",
      snippet: "",
      date: "1970-01-01T00:00:00.000Z",
      unread: false,
    });
  });

  it("normalizes a valid Date header when internalDate is unavailable", () => {
    // Arrange
    const rawMessage = {
      payload: { headers: [{ name: "date", value: "Tue, 01 Jul 2025 12:30:00 GMT" }] },
    };

    // Act
    const result = normalizeGmailMessage(rawMessage);

    // Assert
    expect(result.date).toBe("2025-07-01T12:30:00.000Z");
  });

  it("does not throw for corrupt payloads and uses safe fallbacks", () => {
    // Arrange
    const rawMessage: unknown = {
      id: 42,
      internalDate: "not-a-timestamp",
      labelIds: [null, 7],
      snippet: null,
      payload: { headers: [null, { name: "Subject", value: 99 }] },
    };

    // Act
    const result = normalizeGmailMessage(rawMessage);

    // Assert
    expect(result).toEqual({
      id: "",
      sender: "Remitente desconocido",
      subject: "Sin asunto",
      snippet: "",
      date: "Fecha desconocida",
      unread: false,
    });
  });

  it("falls back to the date header when the internal timestamp is out of range", () => {
    // Arrange
    const rawMessage = {
      internalDate: Number.MAX_VALUE,
      payload: { headers: [{ name: "Date", value: "2025-08-15T10:00:00Z" }] },
    };

    // Act
    const result = normalizeGmailMessage(rawMessage);

    // Assert
    expect(result.date).toBe("2025-08-15T10:00:00.000Z");
  });

  it("normalizes null and primitive inputs without throwing", () => {
    // Arrange
    const rawMessage: unknown = null;

    // Act
    const result = normalizeGmailMessage(rawMessage);

    // Assert
    expect(result).toEqual({
      id: "",
      sender: "Remitente desconocido",
      subject: "Sin asunto",
      snippet: "",
      date: "Fecha desconocida",
      unread: false,
    });
  });
});
