
-- 1. wedding_albums: allow public to read published albums
CREATE POLICY "Anyone can view published albums"
ON public.wedding_albums
FOR SELECT
TO anon, authenticated
USING (is_published = true);

GRANT SELECT ON public.wedding_albums TO anon;

-- 2. wedding_photos: allow public to read photos that belong to published albums
CREATE POLICY "Anyone can view photos of published albums"
ON public.wedding_photos
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.wedding_albums a
    WHERE a.id = wedding_photos.album_id AND a.is_published = true
  )
);

GRANT SELECT ON public.wedding_photos TO anon;

-- 3. storage.objects: allow public read of files in wedding-photos bucket
-- only when the file belongs to a published album
CREATE POLICY "Anyone can view files of published wedding albums"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'wedding-photos'
  AND EXISTS (
    SELECT 1
    FROM public.wedding_photos p
    JOIN public.wedding_albums a ON a.id = p.album_id
    WHERE p.storage_path = storage.objects.name
      AND a.is_published = true
  )
);

-- 4. realtime.messages: restrict channel subscriptions
-- Allow authenticated users to subscribe only to the public announcements channel
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can subscribe to announcements channel"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() = 'announcements-live'
);

-- 5. Lock down SECURITY DEFINER functions
-- has_role: only system / RLS internals should call it; revoke direct execute from public roles
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

-- handle_new_admin_user is a trigger function — it should never be invoked directly
REVOKE EXECUTE ON FUNCTION public.handle_new_admin_user() FROM PUBLIC, anon, authenticated;
