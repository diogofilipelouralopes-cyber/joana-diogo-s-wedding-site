/** Prendas recebidas: dinheiro e em espécie. */

export interface Prenda {
  id: string;
  data: string | null;
  de_quem: string;
  valor: number;
  tipo: string; // "dinheiro" | "especie"
  descricao: string | null;
  notas: string | null;
  agradecido: boolean;
  convidado_id: string | null;
}

export const TIPOS = [
  { valor: "dinheiro", rotulo: "Dinheiro" },
  { valor: "especie", rotulo: "Em espécie" },
] as const;

export function totais(prendas: Prenda[]) {
  const n = (v: unknown) => Number(v) || 0;
  const dinheiro = prendas.filter((p) => p.tipo === "dinheiro").reduce((s, p) => s + n(p.valor), 0);
  const especie = prendas.filter((p) => p.tipo === "especie").reduce((s, p) => s + n(p.valor), 0);
  return {
    dinheiro,
    especie,
    total: dinheiro + especie,
    n: prendas.length,
    porAgradecer: prendas.filter((p) => !p.agradecido).length,
  };
}

export function euros(v: number): string {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(v);
}
