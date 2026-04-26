-- Tabela de mensagens privadas para os noivos
CREATE TABLE public.mensagens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  mensagem text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  lida boolean NOT NULL DEFAULT false,
  favorita boolean NOT NULL DEFAULT false
);

ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;

-- INSERT público com validação de tamanho
CREATE POLICY "Anyone can leave a message"
ON public.mensagens
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(btrim(nome)) >= 2
  AND char_length(btrim(nome)) <= 100
  AND char_length(btrim(mensagem)) >= 10
  AND char_length(mensagem) <= 1000
);

-- SELECT apenas admin
CREATE POLICY "Admins can view all messages"
ON public.mensagens
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- UPDATE apenas admin (para toggle lida/favorita)
CREATE POLICY "Admins can update messages"
ON public.mensagens
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- DELETE apenas admin
CREATE POLICY "Admins can delete messages"
ON public.mensagens
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX idx_mensagens_created_at ON public.mensagens (created_at DESC);