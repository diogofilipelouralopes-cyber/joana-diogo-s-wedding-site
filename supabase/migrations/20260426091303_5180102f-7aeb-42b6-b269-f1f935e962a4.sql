CREATE POLICY "Admins can delete RSVPs"
ON public.rsvps
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));