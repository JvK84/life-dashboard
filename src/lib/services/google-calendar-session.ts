import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import type { GoogleCalendarToken } from "@/src/types/google-calendar";

export const GOOGLE_STATE_COOKIE = "life-dashboard.google.state";
export const GOOGLE_TOKEN_COOKIE = "life-dashboard.google.token";

function getKey(secret = process.env.GOOGLE_OAUTH_STATE_SECRET): Buffer {
  if (!secret) throw new Error("GOOGLE_OAUTH_STATE_SECRET is not configured");
  return createHash("sha256").update(secret).digest();
}

export function createOAuthState(): string {
  return randomBytes(32).toString("base64url");
}

export function encryptGoogleToken(token: GoogleCalendarToken, secret?: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(secret), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(token), "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptGoogleToken(value: string, secret?: string): GoogleCalendarToken {
  const [ivValue, tagValue, encryptedValue] = value.split(".");
  if (!ivValue || !tagValue || !encryptedValue) throw new Error("Invalid Google token cookie");
  const decipher = createDecipheriv("aes-256-gcm", getKey(secret), Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
  const parsed = JSON.parse(plaintext) as GoogleCalendarToken;
  if (!parsed.accessToken || !parsed.expiresAt) throw new Error("Invalid Google token payload");
  return parsed;
}
