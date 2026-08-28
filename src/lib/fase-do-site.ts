// O site tem duas caras: antes do casamento e depois dele.
//
// A viragem é o mesmo instante que faz o relógio desaparecer — a meia-noite
// do dia 20 em Portugal (ver END em countdown.ts). Ter uma só fonte de verdade
// evita o site ficar a meio, com o relógio já calado mas o RSVP ainda de pé.

import { useEffect, useState } from "react";
import { END } from "@/lib/countdown";

/** setTimeout satura por volta dos 24,8 dias; acima disso não vale a pena armar. */
const MAX_TIMEOUT = 2_147_483_647;

export function casamentoJaFoi(agora: number = Date.now()): boolean {
  return agora >= END;
}

/**
 * Diz se o casamento já foi.
 *
 * O primeiro valor é calculado também no servidor, que tem o relógio certo:
 * assim o HTML já chega na cara correta e não há um salto ao hidratar. Se a
 * página ficar aberta a passar da meia-noite, vira sozinha.
 */
export function useDepoisDoCasamento(): boolean {
  const [depois, setDepois] = useState(() => casamentoJaFoi());

  useEffect(() => {
    if (depois) return;
    const falta = END - Date.now();
    if (falta <= 0) {
      setDepois(true);
      return;
    }
    if (falta > MAX_TIMEOUT) return;
    const id = window.setTimeout(() => setDepois(true), falta);
    return () => window.clearTimeout(id);
  }, [depois]);

  return depois;
}
