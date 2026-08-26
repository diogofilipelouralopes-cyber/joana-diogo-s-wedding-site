import { supabase } from "@/integrations/supabase/client";
import { adminAutoLogin } from "@/lib/admin-auth.functions";

/**
 * Access to /admin no longer requires an access code.
 * If there is no Supabase session yet, one is minted automatically for the
 * whitelisted admin account so that all database reads/writes keep going
 * through RLS.
 */
export async function ensureAdminSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;

  const result = await adminAutoLogin();
  if (!result.ok) return null;

  const { data: set } = await supabase.auth.setSession(result.tokens);
  return set.session ?? null;
}
