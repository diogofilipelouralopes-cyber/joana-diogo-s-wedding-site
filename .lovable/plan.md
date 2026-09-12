# Email "falta uma semana" — mais destaque ao site

## O que muda

O álbum de fotografias deixa de ter botão próprio e passa a ser apenas uma linha discreta no fim, junto aos contactos.

O centro do email passa a ser o site, com uma pequena lista do que lá se encontra:

- Horários e programa do dia
- Morada e como chegar
- Alojamento e perguntas frequentes
- Lista de presentes
- Livro de mensagens para os noivos

Mantém-se o botão grande "Ver tudo no site", o bloco do local com o botão do Google Maps, os contactos de WhatsApp e o fecho "Até sábado!". O desenho creme/dourado, o monograma e a data 19 · 09 · 2026 ficam iguais.

## Depois da edição

1. Enviar novo teste para diogofilipelouralopes@gmail.com (marcado como teste, não conta como envio real).
2. Confirmar que os links do site, Maps, álbum e WhatsApp abrem corretamente.
3. Confirmar que o envio automático de hoje às 12h00 (Bruxelas) continua ativo.

## Detalhe técnico

- Editar o HTML e o texto simples em `buildOneWeekEmail` (`src/lib/one-week-campaign.server.ts`): remover o botão do álbum, acrescentar a lista do que há no site por baixo do botão principal, e incluir o álbum como link em texto no bloco final.
- Alinhar a pré-visualização do admin em `src/lib/email-templates/one-week-reminder.tsx`.
- Teste via `POST /api/public/hooks/one-week-emails` com `{"testEmail":"diogofilipelouralopes@gmail.com"}`.
