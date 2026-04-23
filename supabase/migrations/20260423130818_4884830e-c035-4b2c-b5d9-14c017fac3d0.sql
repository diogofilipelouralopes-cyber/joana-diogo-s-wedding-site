
-- 1) Replace permissive WITH CHECK (true) on rsvps INSERT with validation
DROP POLICY IF EXISTS "Anyone can submit an RSVP" ON public.rsvps;

CREATE POLICY "Anyone can submit a valid RSVP"
ON public.rsvps
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(btrim(name)) BETWEEN 2 AND 100
  AND guests BETWEEN 1 AND 10
  AND (allergies IS NULL OR char_length(allergies) <= 500)
  AND (song_suggestion IS NULL OR char_length(song_suggestion) <= 200)
  AND (message IS NULL OR char_length(message) <= 1000)
  AND (email IS NULL OR (char_length(email) <= 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'))
  AND (phone IS NULL OR phone ~ '^[0-9+\s()-]{6,20}$')
);

-- 2) Remove hardcoded admin email from trigger function
-- Create a config table for admin emails (not exposed to anon/authenticated users)
CREATE TABLE IF NOT EXISTS public.admin_emails (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Only admins can view; nobody can insert/update/delete via API (manage via migrations only)
DROP POLICY IF EXISTS "Admins view admin emails" ON public.admin_emails;
CREATE POLICY "Admins view admin emails"
ON public.admin_emails
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Seed the existing admin email (preserves current behavior)
INSERT INTO public.admin_emails (email)
VALUES ('diogofilipelouralopes@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Replace the trigger function to look up email from the config table
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF EXISTS (SELECT 1 FROM public.admin_emails WHERE email = NEW.email) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;
