-- Lock down legacy backup tables: enable RLS and restrict to admins only
ALTER TABLE public.backup_mesas_antes_excel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_plano_antes_excel ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.backup_mesas_antes_excel FROM anon, authenticated;
REVOKE ALL ON public.backup_plano_antes_excel FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.backup_mesas_antes_excel TO authenticated;
GRANT ALL ON public.backup_mesas_antes_excel TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backup_plano_antes_excel TO authenticated;
GRANT ALL ON public.backup_plano_antes_excel TO service_role;

DROP POLICY IF EXISTS "Admins manage backup_mesas_antes_excel" ON public.backup_mesas_antes_excel;
CREATE POLICY "Admins manage backup_mesas_antes_excel"
ON public.backup_mesas_antes_excel
FOR ALL
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage backup_plano_antes_excel" ON public.backup_plano_antes_excel;
CREATE POLICY "Admins manage backup_plano_antes_excel"
ON public.backup_plano_antes_excel
FOR ALL
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));