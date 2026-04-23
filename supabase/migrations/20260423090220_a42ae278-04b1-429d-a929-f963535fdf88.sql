ALTER TABLE public.rsvps
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS message text;