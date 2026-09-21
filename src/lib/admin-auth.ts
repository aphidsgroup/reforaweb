import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHmac,
} from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers, adminAuditLog } from "@/db/schema";

/**
 * Admin authentication
 * ───────────────────────────────────────────────────────────────────────────
 * Deliberately built on Node's own crypto rather than pulling in a dependency:
 * the brief requires REFORA to own and be able to audit everything, and this
 * is a handful of standard primitives (scrypt for passwords, HMAC-SHA256 for
 * the session cookie) rather than a framework to inherit.
 *
 * The security boundary is `requireAdmin()`, called from the admin layout and
 * again inside every server action. Middleware only does a cheap cookie
 * presence check for redirects — it is not what keeps anyone out.
 */

const SESSION_COOKIE = "refora_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

const SCRYPT_KEYLEN = 64;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };

export type AdminRole = "super_admin" | "admin" | "staff";

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
};

/* ═══════════════════════════════════════════════════════════════════════════
   Secret
   ═══════════════════════════════════════════════════════════════════════════ */

function sessionSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set a long random value in .env.local — admin sessions cannot be signed without it."
    );
  }
  return secret;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Passwords — scrypt with a per-user salt
   ═══════════════════════════════════════════════════════════════════════════ */

/** Produces `scrypt$N$r$p$salt$hash`, all base64url. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password.normalize("NFKC"), salt, SCRYPT_KEYLEN, SCRYPT_PARAMS);
  const { N, r, p } = SCRYPT_PARAMS;
  return [
    "scrypt",
    N,
    r,
    p,
    salt.toString("base64url"),
    hash.toString("base64url"),
  ].join("$");
}

/** Constant-time verification. Returns false rather than throwing on bad input. */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [scheme, N, r, p, saltB64, hashB64] = stored.split("$");
    if (scheme !== "scrypt") return false;

    const salt = Buffer.from(saltB64, "base64url");
    const expected = Buffer.from(hashB64, "base64url");
    const actual = scryptSync(password.normalize("NFKC"), salt, expected.length, {
      N: Number(N),
      r: Number(r),
      p: Number(p),
    });

    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Session tokens — `payload.signature`, both base64url
   ═══════════════════════════════════════════════════════════════════════════ */

type TokenPayload = AdminSession & { exp: number };

function sign(data: string): string {
  return createHmac("sha256", sessionSecret()).update(data).digest("base64url");
}

function createToken(session: AdminSession): string {
  const payload: TokenPayload = {
    ...session,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function readToken(token: string): AdminSession | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  // Compare signatures in constant time.
  const expected = Buffer.from(sign(encoded));
  const provided = Buffer.from(signature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString()
    ) as TokenPayload;

    if (payload.exp * 1000 < Date.now()) return null;

    const { id, email, name, role } = payload;
    return { id, email, name, role };
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Cookie helpers
   ═══════════════════════════════════════════════════════════════════════════ */

export async function startSession(session: AdminSession): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createToken(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** The current admin, or null. Never throws on a malformed cookie. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    return readToken(token);
  } catch {
    // A missing AUTH_SECRET throws — treat as signed out rather than crashing
    // every admin page.
    return null;
  }
}

/**
 * The guard. Redirects to the login page when there is no valid session.
 *
 * Call this at the top of every admin page AND every server action — a layout
 * check alone does not protect actions, which are independently addressable
 * POST endpoints.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Restricts an action to specific roles. */
export async function requireRole(...roles: AdminRole[]): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!roles.includes(session.role)) {
    throw new Error("You do not have permission to perform this action.");
  }
  return session;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Credentials check
   ═══════════════════════════════════════════════════════════════════════════ */

export async function authenticate(
  email: string,
  password: string
): Promise<AdminSession | null> {
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.trim().toLowerCase()))
    .limit(1);

  const user = rows[0];

  // Verify against a dummy hash when the user is missing, so a bad email and a
  // bad password take a comparable amount of time.
  if (!user) {
    verifyPassword(password, hashPassword("no-such-user"));
    return null;
  }

  if (!user.isActive) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;

  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsers.id, user.id));

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as AdminRole,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   Audit trail
   ═══════════════════════════════════════════════════════════════════════════ */

export async function recordAudit(
  admin: AdminSession,
  action: string,
  resource: string,
  resourceId?: string,
  details?: unknown
): Promise<void> {
  try {
    await db.insert(adminAuditLog).values({
      adminId: admin.id,
      action,
      resource,
      resourceId: resourceId ?? null,
      details: (details ?? null) as never,
    });
  } catch {
    // An audit write must never block the operation it is recording.
  }
}
