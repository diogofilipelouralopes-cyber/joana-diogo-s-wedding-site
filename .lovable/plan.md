# Plano: Aviso de transferência na secção Presentes

## O que vamos fazer
Adicionar uma pequena nota na secção **Presentes** a pedir que, quem fizer uma transferência, avise a Joana ou o Diogo por WhatsApp — assim sabem de quem veio o contributo e podem agradecer.

## Alterações
1. **Traduções** — novas chaves em `src/lib/i18n.tsx` (pt e en), por exemplo `gifts.transferNote`:
   - PT: "Se fizeres uma transferência, avisa-nos por WhatsApp — assim sabemos de quem veio e podemos agradecer como merece."
   - EN: "If you make a transfer, let us know on WhatsApp — that way we know who it's from and can thank you properly."

2. **UI** — em `src/components/GiftsSection.tsx`, mostrar essa nota entre a descrição da secção e a lista de métodos de pagamento, com dois links de WhatsApp (Joana e Diogo) que já são usados noutras partes do site:
   - Joana: https://wa.me/351912633104
   - Diogo: https://wa.me/32493945581
   Estilo discreto, coerente com a secção (texto pequeno, tom suave, pequeno ícone de mensagem).

## Não inclui
- Nenhuma alteração aos IBANs, MB WAY ou à lógica de copiar.
- Nenhuma alteração à base de dados.
