import type { InboxMessage } from "@/src/types/inbox";

const UNKNOWN_SENDER = "Remitente desconocido";
const EMPTY_SUBJECT = "Sin asunto";
const UNKNOWN_DATE = "Fecha desconocida";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getHeaderValue(rawMessage: UnknownRecord, headerName: string): string {
  const payload = rawMessage.payload;
  if (!isRecord(payload) || !Array.isArray(payload.headers)) return "";

  const header = payload.headers.find((candidate) => {
    if (!isRecord(candidate)) return false;
    return getString(candidate.name).toLocaleLowerCase() === headerName.toLocaleLowerCase();
  });

  return isRecord(header) ? getString(header.value) : "";
}

function toIsoDate(timestamp: number): string | null {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizeDate(rawMessage: UnknownRecord): string {
  const internalDate = rawMessage.internalDate;
  if (typeof internalDate === "number" || typeof internalDate === "string") {
    const internalDateText = String(internalDate).trim();
    const timestamp = Number(internalDateText);
    if (internalDateText && Number.isFinite(timestamp) && timestamp >= 0) {
      const normalizedDate = toIsoDate(timestamp);
      if (normalizedDate) return normalizedDate;
    }
  }

  const dateValue = getHeaderValue(rawMessage, "date") || getString(rawMessage.date);
  const parsedDate = Date.parse(dateValue);
  return toIsoDate(parsedDate) ?? UNKNOWN_DATE;
}

export function normalizeGmailMessage(rawMessage: unknown): InboxMessage {
  const message = isRecord(rawMessage) ? rawMessage : {};
  const labelIds = Array.isArray(message.labelIds) ? message.labelIds : [];

  return {
    id: getString(message.id),
    sender: getHeaderValue(message, "from") || UNKNOWN_SENDER,
    subject: getHeaderValue(message, "subject") || EMPTY_SUBJECT,
    snippet: getString(message.snippet),
    date: normalizeDate(message),
    unread: labelIds.some((label) => getString(label).toLocaleUpperCase() === "UNREAD"),
  };
}
