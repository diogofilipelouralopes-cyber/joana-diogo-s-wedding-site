/** Contas do casamento: despesas, entradas de dinheiro e prendas em espécie. */

export interface Despesa {
  id: string;
  atividade: string;
  descricao: string | null;
  estimado: number;
  a_pagar: number;
  pago: number;
  notas: string | null;
  ordem: number | null;
}

export interface Entrada {
  id: string;
  data: string | null;
  descricao: string;
  valor: number;
  tipo: string;
  notas: string | null;
  ordem: number | null;
}

export type Estado = "pago" | "parcial" | "por-pagar";

export function estadoDa(d: Despesa): Estado {
  if (d.a_pagar === 0 && d.pago !== 0) return "pago";
  if (d.pago === 0) return "por-pagar";
  return "parcial";
}

export const ROTULO: Record<Estado, string> = {
  pago: "Pago",
  parcial: "Parcialmente pago",
  "por-pagar": "Por pagar",
};

export function resumo(despesas: Despesa[], entradas: Entrada[]) {
  const n = (v: unknown) => Number(v) || 0;
  const estimado = despesas.reduce((s, d) => s + n(d.estimado), 0);
  const pago = despesas.reduce((s, d) => s + n(d.pago), 0);
  const faltaPagar = despesas.reduce((s, d) => s + n(d.a_pagar), 0);
  const totalEntradas = entradas
    .filter((e) => e.tipo === "entrada")
    .reduce((s, e) => s + n(e.valor), 0);
  const prendas = entradas
    .filter((e) => e.tipo === "prenda_especie")
    .reduce((s, e) => s + n(e.valor), 0);

  // O que já foi pago saiu das entradas; o que sobra é o que há para o que falta.
  const disponivel = totalEntradas - pago;
  const diferenca = disponivel - faltaPagar;

  return { estimado, pago, faltaPagar, totalEntradas, prendas, disponivel, diferenca };
}

export function euros(v: number): string {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(v);
}
