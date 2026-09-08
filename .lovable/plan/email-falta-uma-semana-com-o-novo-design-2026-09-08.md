# Email "falta uma semana" com o novo design

## Como estão os emails automáticos hoje

- **Confirmação de RSVP** (para o convidado) e **aviso de nova resposta** (para vocês): enviados automaticamente sempre que alguém preenche o formulário. A funcionar.
- **Lembrete de 1 mês antes**: agendado para 19 de agosto às 10h. Já foi enviado — **40 convidados receberam, 0 falhas**.
- **Lembrete de 1 semana antes**: agendado para **12 de setembro às 10h**, para todos os que confirmaram presença (neste momento 40 pessoas, todas com email válido). Ainda não foi enviado.
- Cada envio fica registado, por isso ninguém recebe o mesmo email duas vezes.
- Todos os textos continuam editáveis na área de emails do admin.

## O que muda

O email de 1 semana passa a ter o desenho da maquete enviada: fundo creme, moldura dourada, monograma J & D, "a nossa maior viagem", a data 19 · 09 · 2026 entre linhas tracejadas, botão principal para o site, botões para o Google Maps e para o álbum de fotografias, contactos de WhatsApp da Joana e do Diogo e o fecho "Até sábado!".

O nome do convidado é usado na saudação e o assunto continua a poder ser alterado no admin.

## Testes antes de lançar

1. Enviar o email de 1 semana, com o novo desenho, para diogofilipelouralopes@gmail.com marcado como teste (não conta como envio real, não fica registado como enviado a ninguém).
2. Confirmar a entrega e que os botões abrem o site, o Maps e o álbum.
3. Confirmar que o agendamento de 12 de setembro continua ativo e que a lista de destinatários está correta.

## Detalhe técnico

- Reescrever o gerador de HTML em `src/lib/one-week-campaign.server.ts` com a maquete de `Falta_uma_semana_-_Joana_Diogo.html`, com `{{nome}}` na saudação e escape do valor.
- `runOneWeekCampaign` passa a usar este gerador para o HTML/texto; o assunto continua a vir de `email_content` (chave `one-week-reminder`) com fallback local.
- Alinhar `src/lib/email-templates/one-week-reminder.tsx` (pré-visualização no admin) ao mesmo desenho.
- Teste através de `POST /api/public/hooks/one-week-emails` com `{"testEmail":"diogofilipelouralopes@gmail.com"}`.
- Verificar o job `one-week-wedding-emails` (`0 10 12 9 *`) no fim.
