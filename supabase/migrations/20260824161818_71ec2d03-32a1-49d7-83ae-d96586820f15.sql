INSERT INTO public.email_content (key, display_name, subject, preheader, greeting, body, details, button_label, button_url, signature)
VALUES (
  'one-week-reminder',
  'Lembrete — 1 semana antes',
  'Falta 1 semana! Informações importantes 💚',
  'Falta 1 semana',
  'Olá {{nome}},',
  E'Falta apenas uma semana para o nosso casamento e estamos muito felizes por te ter connosco!\n\nDeixamos aqui as informações mais importantes para que o dia corra sem preocupações. Se tiveres alguma dúvida, responde a este email.',
  '[{"label":"Data","value":"19 de Setembro de 2026"},{"label":"Cerimónia","value":"14:00 — recomendamos chegar 20 minutos antes"},{"label":"Local","value":"Quinta Glicínia"},{"label":"Check-in do alojamento","value":"Logo após a cerimónia"},{"label":"Dress code","value":"Formal / elegante (evitar branco)"},{"label":"Estacionamento","value":"Gratuito no local"}]'::jsonb,
  'Ver todos os detalhes',
  'https://joanaediogo.com',
  'Até já, Joana & Diogo'
)
ON CONFLICT (key) DO NOTHING;