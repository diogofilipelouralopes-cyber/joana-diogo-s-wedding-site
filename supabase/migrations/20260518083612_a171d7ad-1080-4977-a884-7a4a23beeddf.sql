-- Wedding photo gallery: albums + photos + private storage
-- Designed for future Stripe contribution system (fields prepared, not active)

CREATE TABLE public.wedding_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  cover_photo_id uuid,
  sort_order integer NOT NULL DEFAULT 0,
  -- Visibility & access (kept private for now)
  is_published boolean NOT NULL DEFAULT false,
  is_preview boolean NOT NULL DEFAULT false,
  -- Future Stripe contribution flow (not active yet)
  requires_contribution boolean NOT NULL DEFAULT false,
  suggested_contribution_cents integer,
  minimum_contribution_cents integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.wedding_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES public.wedding_albums(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  file_name text,
  caption text,
  width integer,
  height integer,
  size_bytes bigint,
  mime_type text,
  sort_order integer NOT NULL DEFAULT 0,
  -- Watermark + visibility prep
  is_preview boolean NOT NULL DEFAULT false,
  watermark_applied boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_wedding_photos_album ON public.wedding_photos(album_id, sort_order);
CREATE INDEX idx_wedding_albums_published ON public.wedding_albums(is_published, sort_order);

ALTER TABLE public.wedding_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_photos ENABLE ROW LEVEL SECURITY;

-- Admin-only: full management
CREATE POLICY "Admins manage albums" ON public.wedding_albums
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage photos" ON public.wedding_photos
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger function (reuse if exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_wedding_albums_updated
  BEFORE UPDATE ON public.wedding_albums
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Private storage bucket for high-quality wedding photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('wedding-photos', 'wedding-photos', false, 26214400,
  ARRAY['image/jpeg','image/png','image/webp','image/heic','image/avif'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies: admin-only access
CREATE POLICY "Admins view wedding photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'wedding-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins upload wedding photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'wedding-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update wedding photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'wedding-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete wedding photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'wedding-photos' AND public.has_role(auth.uid(), 'admin'));