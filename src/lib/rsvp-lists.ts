/**
 * Listas úteis a partir das respostas de RSVP.
 *
 * O campo das restrições alimentares é de texto livre e opcional, e na prática
 * recebe três coisas diferentes: restrições a sério, respostas vazias de
 * conteúdo ("nenhuma", "nada") e recados que nada têm que ver com comida.
 * Contá-lo em bruto dá um número inflacionado — daí estas funções.
 */

export interface RsvpRow {
  id: string;
  name: string;
  guests: number | null;
  attending: boolean;
  allergies: string | null;
  song_suggestion: string | null;
  message: string | null;
  table_number: string | null;
}

/** "Nenhuma", "nada", "não", "-", "n/a"… — preenchido, mas sem informação. */
const VAZIO =
  /^(nenhuma?s?|nada|n[ãa]o|n\/?a|nao tenho|sem|sem restri[çc][õo]es|-{1,3}|\.)\s*\.?$/i;

export function semConteudo(texto: string | null | undefined): boolean {
  const t = (texto ?? "").trim();
  return t === "" || VAZIO.test(t);
}

export function temConteudo(texto: string | null | undefined): boolean {
  return !semConteudo(texto);
}

export interface ItemLista {
  id: string;
  nome: string;
  pessoas: number;
  texto: string;
}

const pessoasDe = (r: RsvpRow) => Math.max(1, r.guests ?? 1);

/** Restrições alimentares reais, de quem vai. */
export function listaRestricoes(rows: RsvpRow[]): ItemLista[] {
  return rows
    .filter((r) => r.attending && temConteudo(r.allergies))
    .map((r) => ({
      id: r.id,
      nome: r.name,
      pessoas: pessoasDe(r),
      texto: (r.allergies ?? "").trim(),
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt"));
}

/** Sugestões de música reais, de quem vai. */
export function listaMusicas(rows: RsvpRow[]): ItemLista[] {
  return rows
    .filter((r) => r.attending && temConteudo(r.song_suggestion))
    .map((r) => ({
      id: r.id,
      nome: r.name,
      pessoas: pessoasDe(r),
      texto: (r.song_suggestion ?? "").trim(),
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt"));
}

/** Recados escritos em campos livres — incluindo os que caíram no campo errado. */
export function listaRecados(rows: RsvpRow[]): (ItemLista & { campo: string })[] {
  const out: (ItemLista & { campo: string })[] = [];
  for (const r of rows) {
    if (temConteudo(r.message)) {
      out.push({
        id: r.id + ":msg",
        nome: r.name,
        pessoas: pessoasDe(r),
        texto: (r.message ?? "").trim(),
        campo: "Mensagem",
      });
    }
  }
  return out.sort((a, b) => a.nome.localeCompare(b.nome, "pt"));
}

/**
 * Respostas cuja restrição alimentar não parece ser sobre comida.
 * Sinaliza recados importantes escritos no campo errado — por exemplo alguém
 * a avisar que um dos seus convidados afinal pode não ir.
 */
const PALAVRAS_DE_COMIDA =
  /(alerg|intoler|gl[úu]ten|lactose|vegetarian|vegan|marisco|frutos secos|amendoim|peixe|carne|porco|sal\b|a[çc][úu]car|diabet|cel[íi]ac|dieta|comida|comer|fruta|ovo|leite|soja)/i;

export function restricoesSuspeitas(rows: RsvpRow[]): ItemLista[] {
  return listaRestricoes(rows).filter((i) => !PALAVRAS_DE_COMIDA.test(i.texto));
}

/** Quantas pessoas estão cobertas por respostas com restrição real. */
export function pessoasComRestricao(rows: RsvpRow[]): number {
  return listaRestricoes(rows).reduce((s, i) => s + i.pessoas, 0);
}

/** Quem vai e ainda não tem mesa atribuída. */
export function semMesa(rows: RsvpRow[]): RsvpRow[] {
  return rows.filter((r) => r.attending && semConteudo(r.table_number));
}

/** Ocupação por mesa, a partir do que está atribuído. */
export function ocupacaoMesas(
  rows: RsvpRow[],
): { mesa: string; pessoas: number; respostas: number }[] {
  const m = new Map<string, { pessoas: number; respostas: number }>();
  for (const r of rows) {
    if (!r.attending || semConteudo(r.table_number)) continue;
    const k = (r.table_number ?? "").trim();
    const a = m.get(k) ?? { pessoas: 0, respostas: 0 };
    a.pessoas += pessoasDe(r);
    a.respostas += 1;
    m.set(k, a);
  }
  return [...m.entries()]
    .map(([mesa, v]) => ({ mesa, ...v }))
    .sort((a, b) => a.mesa.localeCompare(b.mesa, "pt", { numeric: true }));
}

/** Texto simples, pronto a colar num email para o catering ou para o DJ. */
export function paraTexto(titulo: string, itens: ItemLista[], comPessoas = true): string {
  const linhas = itens.map((i) =>
    comPessoas ? `- ${i.nome} (${i.pessoas}): ${i.texto}` : `- ${i.nome}: ${i.texto}`,
  );
  return [titulo, "".padEnd(titulo.length, "-"), ...linhas].join("\n");
}
