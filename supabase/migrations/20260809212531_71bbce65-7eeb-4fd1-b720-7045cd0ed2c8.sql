CREATE TABLE public.admin_login_attempts (
  ip_hash text PRIMARY KEY,
  attempts integer NOT NULL DEFAULT 0,
  first_attempt_at timestamptz NOT NULL DEFAULT now(),
  blocked_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.admin_login_attempts TO service_role;

ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to login attempts"
  ON public.admin_login_attempts
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));