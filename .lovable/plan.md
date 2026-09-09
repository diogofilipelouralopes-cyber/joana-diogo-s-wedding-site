# Plano: Mensagem na secção Presentes

## O que vamos fazer
Adicionar uma pequena nota na secção **Presentes** a pedir aos convidados que deixem uma mensagem no Livro de Mensagens quando fizerem uma transferência, para que os noivos saibam de quem veio o contributo.

## Alterações
1. **Traduções** — adicionar duas novas chaves em `src/lib/i18n.tsx`:
   - `pt`: `"gifts.transferNote"`
   - `en`: `"gifts.transferNote"`
   Texto sugerido (confirmar com o utilizador se quiser outro):
   - PT: "Se enviares uma transferência, deixa-nos uma mensagem no Livro de Mensagens. Assim sabemos de quem é o teu contributo e podemos agradecer-te de coração."
   - EN: "If you send a bank transfer, please leave us a message in the Message Book. That way we'll know who the gift is from and can thank you from the heart."

2. **UI** — em `src/components/GiftsSection.tsx`, renderizar a nota entre a descrição da secção e o acordeão dos métodos de pagamento, usando o estilo tipográfico existente (texto pequeno, cor suave, possível ícone de nota/informação).

## Não inclui
- Nenhuma alteração aos métodos de pagamento, IBANs, MB WAY ou lógica de cópia.
- Nenhuma alteração ao esquema da base de dados.
