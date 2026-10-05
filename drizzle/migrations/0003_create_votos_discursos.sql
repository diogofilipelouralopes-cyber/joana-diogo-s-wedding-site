CREATE TABLE public.votos_discursos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria text NOT NULL DEFAULT 'discurso' CHECK (categoria IN ('voto','discurso')),
  autor text NOT NULL DEFAULT '',
  papel text,
  texto text NOT NULL DEFAULT '',
  ordem integer NOT NULL DEFAULT 0,
  publicado boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.votos_discursos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.votos_discursos TO authenticated;
GRANT ALL ON public.votos_discursos TO service_role;
ALTER TABLE public.votos_discursos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publicados visiveis" ON public.votos_discursos FOR SELECT TO anon, authenticated USING (publicado = true);
CREATE POLICY "Admins gerem" ON public.votos_discursos FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER trg_votos_discursos_updated BEFORE UPDATE ON public.votos_discursos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();