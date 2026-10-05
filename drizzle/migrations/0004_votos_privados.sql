DROP POLICY IF EXISTS "Publicados visiveis" ON public.votos_discursos;
REVOKE SELECT ON public.votos_discursos FROM anon;