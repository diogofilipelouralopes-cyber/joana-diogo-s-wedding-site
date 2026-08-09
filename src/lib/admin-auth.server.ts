// Server-only admin access-code authentication.
// The access code never reaches the browser; validation happens here only.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { useSession } from "@tanstack/react-start/server";
import type { Database } from "@/integrations/supabase/types";

export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24; // 24h

export type AdminSessionData = {
  admin?: true;
  issuedAt?: number;
};

function sessionConfig() {
  const password = process.env["ADMIN_SESSION_SECRET"];
  if (!password) throw new Error("ADMIN_SESSION_SECRET is not set");
  return {
    password,
    name: "jd-admin",
    maxAge: ADMIN_SESSION_MAX_AGE,
    cookie: {
      httpOnly: true,
      secure: true,
      // "none" (with secure) so the session also works when the app is
      // rendered inside the Lovable preview iframe (cross-site context).
      sameSite: "none" as const,
      path: "/",
    },
  };
}

export async function adminSession() {
  return useSession<AdminSessionData>(sessionConfig());
}

/** Throws when there is no valid, unexpired admin session. */
export async function requireAdminSession() {
  const session = await adminSession();
  const { admin, issuedAt } = session.data ?? {};
  if (!admin || !issuedAt || Date.now() - issuedAt > ADMIN_SESSION_MAX_AGE * 1000) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function hasAdminSession(): Promise<boolean> {
  try {
    await requireAdminSession();
    return true;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------- code check */

function digest(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

export function codeMatches(input: string): boolean {
  const expected = process.env["ADMIN_ACCESS_CODE"];
  if (!expected) throw new Error("ADMIN_ACCESS_CODE is not set");
  return timingSafeEqual(digest(input), digest(expected));
}

/* ------------------------------------------------------------ rate limiting */

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

function fingerprint(ip: string) {
  // Never store a raw IP; keyed hash only.
  return createHmac("sha256", process.env["ADMIN_SESSION_SECRET"]!)
    .update(ip || "unknown")
    .digest("hex");
}

export async function checkRateLimit(ip: string): Promise<boolean> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const key = fingerprint(ip);
  const { data } = await supabaseAdmin
    .from("admin_login_attempts")
    .select("attempts, first_attempt_at, blocked_until")
    .eq("ip_hash", key)
    .maybeSingle();
  if (!data) return true;
  if (data.blocked_until && new Date(data.blocked_until).getTime() > Date.now()) return false;
  return true;
}

export async function registerFailure(ip: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const key = fingerprint(ip);
  const now = Date.now();
  const { data } = await supabaseAdmin
    .from("admin_login_attempts")
    .select("attempts, first_attempt_at")
    .eq("ip_hash", key)
    .maybeSingle();

  const withinWindow =
    data && now - new Date(data.first_attempt_at).getTime() < WINDOW_MS;
  const attempts = withinWindow ? (data?.attempts ?? 0) + 1 : 1;

  await supabaseAdmin.from("admin_login_attempts").upsert(
    {
      ip_hash: key,
      attempts,
      first_attempt_at: withinWindow
        ? (data!.first_attempt_at as string)
        : new Date(now).toISOString(),
      blocked_until:
        attempts >= MAX_ATTEMPTS ? new Date(now + BLOCK_MS).toISOString() : null,
      updated_at: new Date(now).toISOString(),
    },
    { onConflict: "ip_hash" },
  );
}

export async function clearFailures(ip: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("admin_login_attempts").delete().eq("ip_hash", fingerprint(ip));
}

/* ------------------------------------------- mint a Supabase admin session */

/**
 * After the code is validated we mint a short-lived Supabase session for the
 * whitelisted admin account, so every database read/write in the panel keeps
 * running through RLS (`has_role`) as a second layer of defence.
 */
export async function mintAdminSupabaseSession() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: adminEmail } = await supabaseAdmin
    .from("admin_emails")
    .select("email")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!adminEmail?.email) throw new Error("No admin account configured");

  const { data: link, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: adminEmail.email,
  });
  if (linkError || !link?.properties?.hashed_token) {
    throw new Error("Could not create admin session");
  }

  const url = process.env["SUPABASE_URL"]!;
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!;
  const publicClient = createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });

  const { data: verified, error: verifyError } = await publicClient.auth.verifyOtp({
    type: "magiclink",
    token_hash: link.properties.hashed_token,
  });
  if (verifyError || !verified.session) throw new Error("Could not create admin session");

  return {
    access_token: verified.session.access_token,
    refresh_token: verified.session.refresh_token,
  };
}
