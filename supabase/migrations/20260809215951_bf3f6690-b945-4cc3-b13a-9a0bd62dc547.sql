CREATE TABLE public.email_content (
  key TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preheader TEXT NOT NULL DEFAULT '',
  greeting TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  details JSONB NOT NULL DEFAULT '[]'::jsonb,
  button_label TEXT NOT NULL DEFAULT '',
  button_url TEXT NOT NULL DEFAULT '',
  signature TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.email_content TO service_role;
ALTER TABLE public.email_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email content"
ON public.email_content FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_content TO authenticated;

INSERT INTO public.email_content (key, display_name, subject, preheader, greeting, body, details, button_label, button_url, signature) VALUES
('rsvp-confirmation', 'RSVP — Confirmação ao convidado', 'Confirmação recebida — Casamento Joana & Diogo ❤️', 'Recebemos a tua confirmação de presença.', 'Olá {{nome}},',
 E'Recebemos a tua confirmação para o nosso casamento no dia 19 de setembro de 2026.\n\nEstamos muito felizes por partilhar este momento contigo.\n\nObrigado pela tua resposta.',
 '[]'::jsonb, 'Ver detalhes do casamento', 'https://joanaediogo.com', 'Joana & Diogo'),
('rsvp-notification', 'RSVP — Notificação para os noivos', 'Nova resposta RSVP — {{nome}}', 'Nova resposta ao RSVP recebida no site.', 'Nova resposta ao RSVP',
 E'Recebeste uma nova resposta ao RSVP no site. Os detalhes estão em baixo.',
 '[]'::jsonb, 'Abrir painel de administração', 'https://joanaediogo.com/admin', 'Joana & Diogo'),
('one-month-reminder', 'Lembrete — 1 mês antes', 'Está quase! Falta apenas 1 mês 💚', 'Falta apenas 1 mês para o nosso casamento!', 'Olá {{nome}},',
 E'Está quase! Falta apenas um mês para o nosso grande dia e queremos partilhar contigo os detalhes finais.',
 '[{"label":"Local","value":"Quinta Glicínia"},{"label":"Hora","value":"14:00 — recomendamos chegar 20 minutos antes"},{"label":"Dress code","value":"Formal / elegante (evitar branco)"}]'::jsonb,
 'Ver todos os detalhes', 'https://joanaediogo.com', 'Até breve, Joana & Diogo');