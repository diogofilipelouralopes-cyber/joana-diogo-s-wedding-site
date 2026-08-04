-- 1. Extra guest management fields on rsvps
ALTER TABLE public.rsvps
  ADD COLUMN IF NOT EXISTS family_group text,
  ADD COLUMN IF NOT EXISTS table_number text,
  ADD COLUMN IF NOT EXISTS accommodation text,
  ADD COLUMN IF NOT EXISTS transport text,
  ADD COLUMN IF NOT EXISTS internal_notes text;

-- 2. Guest communications log
CREATE TABLE public.guest_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid NOT NULL REFERENCES public.rsvps(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('email_1_month', 'whatsapp_1_week', 'post_wedding')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.guest_communications TO authenticated;
GRANT ALL ON public.guest_communications TO service_role;

ALTER TABLE public.guest_communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage guest communications"
  ON public.guest_communications FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_guest_comms_guest ON public.guest_communications (guest_id);
CREATE UNIQUE INDEX idx_guest_comms_unique_sent
  ON public.guest_communications (guest_id, type)
  WHERE status = 'sent';

-- 3. Editable site settings
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are publicly readable"
  ON public.site_settings FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage site settings"
  ON public.site_settings FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_site_settings_updated
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (key, value)
VALUES ('google_photos_url', 'https://photos.app.goo.gl/ZfRKu3pg8oHait6eA')
ON CONFLICT (key) DO NOTHING;