# Previsão do tempo para o dia do casamento

Um pequeno cartão no site com a previsão meteorológica para Freamunde no dia 19 de setembro de 2026.

## Como funciona

- Só aparece quando faltarem 14 dias ou menos (é o alcance fiável de qualquer previsão). Antes disso, mostra uma frase simpática: "A previsão aparece aqui a partir de 5 de setembro."
- Quando houver previsão, mostra: ícone (sol, nuvens, chuva), temperatura máxima e mínima, e probabilidade de chuva.
- Depois do casamento, o cartão desaparece com o resto da secção do evento.
- Textos em português e inglês, a acompanhar o resto do site.

## Onde fica

Dentro da secção "O Evento", logo abaixo do bloco da Glicínia Wedding House, com o mesmo estilo (fundo marfim, moldura dourada) para não destoar.

## Detalhes técnicos

- Fonte de dados: Open-Meteo (gratuita, sem chave de API), coordenadas de Freamunde (~41.28 N, -8.35 W), `daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max`, `timezone=Europe/Lisbon`.
- Novo componente `src/components/WeatherCard.tsx`, chamado a partir de `src/routes/index.tsx` na secção `#event`.
- Pedido feito no cliente com TanStack Query (`staleTime` de 1 hora); mapa de `weather_code` para ícones lucide.
- Se o pedido falhar, o cartão simplesmente não aparece — nunca quebra a página.
- Novas chaves de tradução em `src/lib/i18n.tsx`.
