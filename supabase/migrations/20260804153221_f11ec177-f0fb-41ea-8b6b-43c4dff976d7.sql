
ALTER VIEW public.rsvp_public_messages SET (security_invoker = true);

-- Column-level restriction for anonymous visitors
REVOKE SELECT ON public.rsvps FROM anon;
GRANT SELECT (id, name, message, created_at) ON public.rsvps TO anon;

CREATE POLICY "Anon can read attending RSVP messages"
ON public.rsvps FOR SELECT TO anon
USING (attending = true AND message IS NOT NULL AND char_length(btrim(message)) > 0);

REVOKE SELECT ON public.rsvp_public_messages FROM authenticated;
