import type { InboxMessage } from "@/src/types/inbox";
import type { GoogleCalendarToken } from "@/src/types/google-calendar";
import { normalizeGmailMessage } from "@/src/lib/integrations/gmail/normalizer";

export const GOOGLE_GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
const GMAIL_MESSAGES_ENDPOINT = "https://gmail.googleapis.com/gmail/v1/users/me/messages";
const GMAIL_MESSAGES_LIMIT = 20;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getMessageId(value: unknown): string {
  return isRecord(value) && typeof value.id === "string" ? value.id.trim() : "";
}

export async function listUnreadGmailMessages(
  token: GoogleCalendarToken,
  fetchImpl: typeof fetch = fetch,
): Promise<InboxMessage[]> {
  const listUrl = new URL(GMAIL_MESSAGES_ENDPOINT);
  listUrl.searchParams.set("labelIds", "UNREAD");
  listUrl.searchParams.set("maxResults", String(GMAIL_MESSAGES_LIMIT));
  listUrl.searchParams.set("includeSpamTrash", "false");

  const headers = { Authorization: `Bearer ${token.accessToken}` };
  const listResponse = await fetchImpl(listUrl, { headers });
  if (!listResponse.ok) throw new Error(`Gmail message list request failed with ${listResponse.status}`);

  const payload = (await listResponse.json()) as unknown;
  const references = isRecord(payload) && Array.isArray(payload.messages) ? payload.messages : [];
  const messages = await Promise.all(
    references.map(async (reference): Promise<InboxMessage | null> => {
      const id = getMessageId(reference);
      if (!id) return null;

      const messageUrl = new URL(`${GMAIL_MESSAGES_ENDPOINT}/${encodeURIComponent(id)}`);
      messageUrl.searchParams.set("format", "full");
      const messageResponse = await fetchImpl(messageUrl, { headers });
      if (!messageResponse.ok) throw new Error(`Gmail message request failed with ${messageResponse.status}`);
      return normalizeGmailMessage(await messageResponse.json());
    }),
  );

  return messages.filter((message): message is InboxMessage => message !== null);
}
