# Email "falta uma semana" — envio de hoje

## Quando é enviado

O envio automático está agendado para **hoje, 12 de setembro, às 12h00 (hora de Bruxelas / 11h00 em Portugal)**. Ainda não foi enviado a ninguém — não há qualquer registo de envio deste email.

Destinatários: **40 convidados** que confirmaram presença, todos com email válido. Cada pessoa recebe apenas uma vez, mesmo que o envio corra mais do que uma vez.

## O que vou fazer agora

1. Enviar um **teste** para diogofilipelouralopes@gmail.com, com o assunto marcado como teste. Não conta como envio real e não fica registado em nenhum convidado.
2. Confirmar a entrega e que o desenho e os botões (site, Google Maps, álbum de fotografias, WhatsApp) estão corretos.
3. Confirmar que o agendamento de hoje continua ativo, para que o envio a todos aconteça à hora prevista.

Se depois do teste quiseres mudar alguma coisa, há tempo antes das 12h00. Se preferires adiar o envio a todos, é só dizer e eu suspendo o agendamento.

## Detalhe técnico

- Tarefa `one-week-wedding-emails` (`0 10 12 9 *`, UTC) → chama `POST /api/public/hooks/one-week-emails`.
- Teste: mesmo endpoint com `{"testEmail":"diogofilipelouralopes@gmail.com"}` — usa `buildOneWeekEmail` e não escreve em `guest_communications`.
- Sem alterações de código previstas.
