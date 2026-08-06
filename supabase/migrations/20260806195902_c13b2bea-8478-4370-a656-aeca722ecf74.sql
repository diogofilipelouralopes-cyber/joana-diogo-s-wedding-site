DROP POLICY IF EXISTS "Anon can read attending RSVP messages" ON public.rsvps;
REVOKE SELECT ON public.rsvps FROM anon;