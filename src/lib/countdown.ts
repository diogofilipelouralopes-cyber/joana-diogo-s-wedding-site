// Lógica da contagem decrescente para o dia do casamento.
//
// Vive fora do componente para poder ser testada sem montar React — e porque
// exportar funções a partir de um ficheiro de componente estraga o fast refresh.

// O "grande dia" é 19 de setembro de 2026. O alvo é a meia-noite em Portugal
// (WEST, +01:00 — o horário de verão só termina a 25 de outubro).
//
// Toda a contagem é feita sobre o tempo que falta até este instante fixo, e não
// sobre o calendário local de quem visita. Assim um convidado a ver o site do
// Brasil vê o mesmo número que alguém no Porto, em vez de a contagem virar um
// dia mais cedo.
export const TARGET = new Date("2026-09-19T00:00:00+01:00").getTime();

// A partir da meia-noite do dia 20 o cronómetro desaparece do hero.
export const END = new Date("2026-09-20T00:00:00+01:00").getTime();

export const SECOND = 1_000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

// A partir daqui mostra-se o relógio completo com segundos.
export const FINAL_STRETCH = 48 * HOUR;

export type CountdownState =
  | { phase: "over" }
  | { phase: "today" }
  | { phase: "days"; days: number }
  | { phase: "clock"; days: number; hours: number; mins: number; secs: number };

export function compute(now: number): CountdownState {
  if (now >= END) return { phase: "over" };

  const remaining = TARGET - now;

  if (remaining <= 0) return { phase: "today" };

  if (remaining < FINAL_STRETCH) {
    return {
      phase: "clock",
      days: Math.floor(remaining / DAY),
      hours: Math.floor((remaining % DAY) / HOUR),
      mins: Math.floor((remaining % HOUR) / MINUTE),
      secs: Math.floor((remaining % MINUTE) / SECOND),
    };
  }

  // Faltam "N dias": arredonda para cima, para o dia do casamento contar como dia.
  return { phase: "days", days: Math.ceil(remaining / DAY) };
}
