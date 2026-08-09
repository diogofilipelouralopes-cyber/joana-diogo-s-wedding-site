import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

const GENERIC_ERROR = "Código inválido.";

export const adminCodeLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { code: string }) => {
    const code = typeof data?.code === "string" ? data.code.trim() : "";
    if (!code || code.length > 200) throw new Error(GENERIC_ERROR);
    return { code };
  })
  .handler(async ({ data }) => {
    const {
      adminSession,
      checkRateLimit,
      clearFailures,
      codeMatches,
      mintAdminSupabaseSession,
      registerFailure,
    } = await import("./admin-auth.server");

    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";

    if (!(await checkRateLimit(ip))) {
      return { ok: false as const, error: GENERIC_ERROR };
    }

    let valid = false;
    try {
      valid = codeMatches(data.code);
    } catch {
      valid = false;
    }

    if (!valid) {
      await registerFailure(ip);
      // Constant-ish delay so timing reveals nothing about the code.
      await new Promise((r) => setTimeout(r, 400));
      return { ok: false as const, error: GENERIC_ERROR };
    }

    let tokens: { access_token: string; refresh_token: string };
    try {
      tokens = await mintAdminSupabaseSession();
    } catch {
      return { ok: false as const, error: GENERIC_ERROR };
    }

    await clearFailures(ip);
    const session = await adminSession();
    await session.update({ admin: true, issuedAt: Date.now() });

    return { ok: true as const, tokens };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { adminSession } = await import("./admin-auth.server");
  const session = await adminSession();
  await session.clear();
  return { ok: true as const };
});

export const adminSessionStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { hasAdminSession } = await import("./admin-auth.server");
  return { authenticated: await hasAdminSession() };
});
