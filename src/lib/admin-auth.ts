import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "zaine_admin_session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type AdminSessionPayload = {
  username: string;
  exp: number;
};

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);

  if (aBuf.length !== bBuf.length) {
    return false;
  }

  return timingSafeEqual(aBuf, bBuf);
}

function getAdminConfig() {
  const username = process.env.ADMIN_USERNAME?.trim() || "admin";
  const password = process.env.ADMIN_PASSWORD?.trim();
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!password || !secret) {
    throw new Error(
      "Missing admin auth config. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in .env.local.",
    );
  }

  return { username, password, secret };
}

function signPayload(payloadBase64: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadBase64).digest("base64url");
}

export function validateAdminCredentials(
  username: string,
  password: string,
): boolean {
  const config = getAdminConfig();

  return (
    safeEqual(username.trim(), config.username) &&
    safeEqual(password, config.password)
  );
}

export function createAdminSessionToken(username: string): string {
  const { secret } = getAdminConfig();
  const payload: AdminSessionPayload = {
    username,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };

  const payloadBase64 = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(payloadBase64, secret);
  return `${payloadBase64}.${signature}`;
}

export function verifyAdminSessionToken(
  token: string | undefined,
): AdminSessionPayload | null {
  if (!token) {
    return null;
  }

  const { secret } = getAdminConfig();
  const [payloadBase64, signature] = token.split(".");

  if (!payloadBase64 || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payloadBase64, secret);
  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(payloadBase64)) as AdminSessionPayload;

    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token) !== null;
}

export function getAdminSessionMaxAge(): number {
  return SESSION_MAX_AGE_SECONDS;
}
