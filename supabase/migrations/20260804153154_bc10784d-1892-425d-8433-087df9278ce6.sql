
-- 1) Private schema for the admin-check helper (not exposed via the API)
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
  OR (
    _role = 'admin'::public.app_role
    AND EXISTS (
      SELECT 1 FROM auth.users u
      JOIN public.admin_emails ae ON lower(ae.email) = lower(u.email)
      WHERE u.id = _user_id
    )
  )
$$;

GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;

-- 2) Recreate policies to use private.has_role
DROP POLICY IF EXISTS "Admins view admin emails" ON public.admin_emails;
CREATE POLICY "Admins view admin emails" ON public.admin_emails FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete announcements" ON public.announcements;
CREATE POLICY "Admins can delete announcements" ON public.announcements FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can insert announcements" ON public.announcements;
CREATE POLICY "Admins can insert announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update announcements" ON public.announcements;
CREATE POLICY "Admins can update announcements" ON public.announcements FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete messages" ON public.mensagens;
CREATE POLICY "Admins can delete messages" ON public.mensagens FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update messages" ON public.mensagens;
CREATE POLICY "Admins can update messages" ON public.mensagens FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can view all messages" ON public.mensagens;
CREATE POLICY "Admins can view all messages" ON public.mensagens FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete RSVPs" ON public.rsvps;
CREATE POLICY "Admins can delete RSVPs" ON public.rsvps FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update RSVPs" ON public.rsvps;
CREATE POLICY "Admins can update RSVPs" ON public.rsvps FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can view all RSVPs" ON public.rsvps;
CREATE POLICY "Admins can view all RSVPs" ON public.rsvps FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins view all roles" ON public.user_roles;
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage albums" ON public.wedding_albums;
CREATE POLICY "Admins manage albums" ON public.wedding_albums FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage photos" ON public.wedding_photos;
CREATE POLICY "Admins manage photos" ON public.wedding_photos FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins view wedding photos" ON storage.objects;
CREATE POLICY "Admins view wedding photos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'wedding-photos' AND private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins upload wedding photos" ON storage.objects;
CREATE POLICY "Admins upload wedding photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'wedding-photos' AND private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins update wedding photos" ON storage.objects;
CREATE POLICY "Admins update wedding photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'wedding-photos' AND private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins delete wedding photos" ON storage.objects;
CREATE POLICY "Admins delete wedding photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'wedding-photos' AND private.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 3) Remove public full-row access to rsvps; expose only name + message via a view
DROP POLICY IF EXISTS "Public can read RSVP messages" ON public.rsvps;

CREATE OR REPLACE VIEW public.rsvp_public_messages
WITH (security_invoker = false) AS
  SELECT id, name, message, created_at
  FROM public.rsvps
  WHERE attending = true
    AND message IS NOT NULL
    AND char_length(btrim(message)) > 0;

GRANT SELECT ON public.rsvp_public_messages TO anon, authenticated;
