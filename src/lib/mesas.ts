/** Modelo do plano de mesas: pessoas (uma linha por pessoa) e mesas. */

export interface Mesa {
  id: string;
  nome: string;
  lugares: number;
  forma: string;
  pos_x: number;
  pos_y: number;
  juntada_com: string | null;
  ordem: number | null;
  notas: string | null;
}

export interface Convidado {
  id: string;
  nome: string;
  grupo: string | null;
  cidade: string | null;
  presenca: string | null;
  quarto: string | null;
  mesa_id: string | null;
  rsvp_id: string | null;
  notas: string | null;
}

/** Quem conta como presente. O Excel usa texto livre. */
export function vaiAoCasamento(c: Convidado): boolean {
  return (c.presenca ?? "").trim().toLowerCase() === "sim";
}

export function naoVai(c: Convidado): boolean {
  const p = (c.presenca ?? "").trim().toLowerCase();
  return p === "não" || p === "nao";
}

/** Por confirmar: nem sim nem não. */
export function porConfirmar(c: Convidado): boolean {
  return !vaiAoCasamento(c) && !naoVai(c);
}

/** Mesas juntadas partilham lugares: A+B = lugares(A)+lugares(B). */
export function grupoDaMesa(mesa: Mesa, todas: Mesa[]): Mesa[] {
  const parceira = todas.find((m) => m.id === mesa.juntada_com || m.juntada_com === mesa.id);
  return parceira ? [mesa, parceira] : [mesa];
}

export function lugaresDoGrupo(mesa: Mesa, todas: Mesa[]): number {
  return grupoDaMesa(mesa, todas).reduce((s, m) => s + m.lugares, 0);
}

export function ocupacaoDoGrupo(mesa: Mesa, todas: Mesa[], convidados: Convidado[]): number {
  const ids = new Set(grupoDaMesa(mesa, todas).map((m) => m.id));
  return convidados.filter((c) => c.mesa_id && ids.has(c.mesa_id)).length;
}

export interface Aviso {
  tipo: "excede" | "sem-mesa" | "nao-vai-sentado";
  texto: string;
  n: number;
}

export function avisos(mesas: Mesa[], convidados: Convidado[]): Aviso[] {
  const out: Aviso[] = [];

  const vistas = new Set<string>();
  let excedidas = 0;
  for (const m of mesas) {
    if (vistas.has(m.id)) continue;
    grupoDaMesa(m, mesas).forEach((x) => vistas.add(x.id));
    if (ocupacaoDoGrupo(m, mesas, convidados) > lugaresDoGrupo(m, mesas)) excedidas++;
  }
  if (excedidas > 0)
    out.push({
      tipo: "excede",
      n: excedidas,
      texto: `${excedidas} ${excedidas === 1 ? "mesa passa" : "mesas passam"} do número de lugares`,
    });

  const semMesa = convidados.filter((c) => vaiAoCasamento(c) && !c.mesa_id).length;
  if (semMesa > 0)
    out.push({
      tipo: "sem-mesa",
      n: semMesa,
      texto: `${semMesa} ${semMesa === 1 ? "confirmado ainda não tem" : "confirmados ainda não têm"} mesa`,
    });

  const naoVaiSentado = convidados.filter((c) => naoVai(c) && c.mesa_id).length;
  if (naoVaiSentado > 0)
    out.push({
      tipo: "nao-vai-sentado",
      n: naoVaiSentado,
      texto: `${naoVaiSentado} ${naoVaiSentado === 1 ? "pessoa que disse «não» está sentada" : "pessoas que disseram «não» estão sentadas"}`,
    });

  return out;
}

export function contagens(convidados: Convidado[]) {
  return {
    total: convidados.length,
    confirmados: convidados.filter(vaiAoCasamento).length,
    naoVao: convidados.filter(naoVai).length,
    porConfirmar: convidados.filter(porConfirmar).length,
    sentados: convidados.filter((c) => c.mesa_id).length,
    porSentar: convidados.filter((c) => vaiAoCasamento(c) && !c.mesa_id).length,
  };
}
