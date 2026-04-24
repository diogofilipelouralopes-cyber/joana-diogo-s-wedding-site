CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
  OR (
    _role = 'admin'::public.app_role
    AND EXISTS (
      SELECT 1
      FROM auth.users u
      JOIN public.admin_emails ae ON lower(ae.email) = lower(u.email)
      WHERE u.id = _user_id
    )
  )
$$;