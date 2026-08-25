import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, AlertTriangle, TrendingUp, Gift } from "lucide-react";
import {
  resumo as calcResumo,
  estadoDa,
  euros,
  ROTULO,
  type Despesa,
  type Entrada,
} from "@/lib/contas";

const COR = {
  pago: "#6B7A4F",
  parcial: "#B8935A",
  "por-pagar": "#B85C5C",
} as const;

export function AdminContas({
  despesasParaTeste,
  entradasParaTeste,
}: { despesasParaTeste?: Despesa[]; entradasParaTeste?: Entrada[] } = {}) {
  const [despesas, setDespesas] = useState<Despesa[]>(despesasParaTeste ?? []);
  const [entradas, setEntradas] = useState<Entrada[]>(entradasParaTeste ?? []);
  const [loading, setLoading] = useState(!despesasParaTeste);

  useEffect(() => {
    if (despesasParaTeste) return;
    (async () => {
      const [d, e] = await Promise.all([
        supabase.from("despesas").select("*").order("ordem"),
        supabase.from("entradas").select("*").order("ordem"),
      ]);
      if (d.error || e.error) toast.error("Não foi possível carregar as contas.");
      else {
        setDespesas((d.data ?? []) as unknown as Despesa[]);
        setEntradas((e.data ?? []) as unknown as Entrada[]);
      }
      setLoading(false);
    })();
  }, [despesasParaTeste]);

  const r = useMemo(() => calcResumo(despesas, entradas), [despesas, entradas]);

  async function guardar(id: string, campos: Partial<Despesa>) {
    setDespesas((prev) => prev.map((d) => (d.id === id ? { ...d, ...campos } : d)));
    if (despesasParaTeste) return;
    const { error } = await supabase.from("despesas").update(campos).eq("id", id);
    if (error) toast.error("Não foi possível guardar.");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const prendas = entradas.filter((e) => e.tipo === "prenda_especie");
  const receitas = entradas.filter((e) => e.tipo === "entrada");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Cartao rotulo="Custo total estimado" valor={euros(r.estimado)} />
        <Cartao rotulo="Já pago" valor={euros(r.pago)} cor={COR.pago} />
        <Cartao rotulo="Falta pagar" valor={euros(r.faltaPagar)} cor={COR["por-pagar"]} />
        <Cartao rotulo="Entradas registadas" valor={euros(r.totalEntradas)} />
      </div>

      <div
        className="rounded-xl border p-4 sm:p-5"
        style={{
          background:
            r.diferenca < 0
              ? "color-mix(in oklab, #B85C5C 10%, transparent)"
              : "color-mix(in oklab, #6B7A4F 10%, transparent)",
        }}
      >
        <p className="flex items-start gap-2 text-sm">
          {r.diferenca < 0 ? (
            <AlertTriangle
              className="w-4 h-4 shrink-0 mt-0.5"
              style={{ color: COR["por-pagar"] }}
            />
          ) : (
            <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" style={{ color: COR.pago }} />
          )}
          <span>
            Das entradas registadas ({euros(r.totalEntradas)}) já saíram {euros(r.pago)} em
            pagamentos, sobrando <strong>{euros(r.disponivel)}</strong>. Falta pagar{" "}
            <strong>{euros(r.faltaPagar)}</strong>, o que dá{" "}
            <strong style={{ color: r.diferenca < 0 ? COR["por-pagar"] : COR.pago }}>
              {r.diferenca < 0
                ? `um défice de ${euros(Math.abs(r.diferenca))}`
                : `uma folga de ${euros(r.diferenca)}`}
            </strong>
            .
          </span>
        </p>
      </div>

      <section className="rounded-xl border bg-card p-4 sm:p-6">
        <h3 className="font-medium mb-4">Despesas ({despesas.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 pr-3">Atividade</th>
                <th className="pb-2 pr-3">Estado</th>
                <th className="pb-2 pr-3 text-right">Estimado</th>
                <th className="pb-2 pr-3 text-right">Pago</th>
                <th className="pb-2 text-right">Falta</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {despesas.map((d) => {
                const est = estadoDa(d);
                return (
                  <tr key={d.id}>
                    <td className="py-2 pr-3">
                      <p className="font-medium">{d.atividade}</p>
                      {d.descricao && (
                        <p className="text-xs text-muted-foreground">{d.descricao}</p>
                      )}
                      {d.notas && <p className="text-xs text-muted-foreground italic">{d.notas}</p>}
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className="text-[0.65rem] uppercase tracking-wide rounded px-1.5 py-0.5 whitespace-nowrap"
                        style={{
                          background: `color-mix(in oklab, ${COR[est]} 18%, transparent)`,
                          color: COR[est],
                        }}
                      >
                        {ROTULO[est]}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-right whitespace-nowrap">
                      {euros(Number(d.estimado))}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      <Input
                        className="w-24 text-right"
                        defaultValue={String(d.pago)}
                        onBlur={(e) => {
                          const v = Number(e.target.value.replace(",", "."));
                          if (!Number.isNaN(v) && v !== Number(d.pago)) {
                            guardar(d.id, { pago: v, a_pagar: Number(d.estimado) - v });
                          }
                        }}
                      />
                    </td>
                    <td className="py-2 text-right whitespace-nowrap">
                      {euros(Number(d.a_pagar))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t font-medium">
                <td className="pt-3" colSpan={2}>
                  Total
                </td>
                <td className="pt-3 text-right">{euros(r.estimado)}</td>
                <td className="pt-3 text-right pr-3">{euros(r.pago)}</td>
                <td className="pt-3 text-right">{euros(r.faltaPagar)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Ao alterares o valor pago, a coluna «falta» ajusta-se sozinha ao estimado.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-xl border bg-card p-4 sm:p-6">
          <h3 className="font-medium mb-3">Entradas ({receitas.length})</h3>
          <ul className="divide-y text-sm">
            {receitas.map((e) => (
              <li key={e.id} className="py-2 flex justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate">{e.descricao}</span>
                  {e.data && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(e.data).toLocaleDateString("pt-PT")}
                    </span>
                  )}
                </span>
                <span className="whitespace-nowrap">{euros(Number(e.valor))}</span>
              </li>
            ))}
            <li className="py-2 flex justify-between font-medium">
              <span>Total</span>
              <span>{euros(r.totalEntradas)}</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border bg-card p-4 sm:p-6">
          <h3 className="flex items-center gap-2 font-medium mb-3">
            <Gift className="w-4 h-4" /> Prendas em espécie ({prendas.length})
          </h3>
          <ul className="divide-y text-sm">
            {prendas.map((e) => (
              <li key={e.id} className="py-2 flex justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate">{e.descricao}</span>
                  {e.notas && <span className="text-xs text-muted-foreground">de {e.notas}</span>}
                </span>
                <span className="whitespace-nowrap">{euros(Number(e.valor))}</span>
              </li>
            ))}
            <li className="py-2 flex justify-between font-medium">
              <span>Total</span>
              <span>{euros(r.prendas)}</span>
            </li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Coisas oferecidas por terceiros. Não entram nas contas acima porque não passaram pela
            vossa conta.
          </p>
        </section>
      </div>
    </div>
  );
}

function Cartao({ rotulo, valor, cor }: { rotulo: string; valor: string; cor?: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-[0.7rem] text-muted-foreground">{rotulo}</p>
      <p
        className="text-xl font-medium mt-1 whitespace-nowrap"
        style={cor ? { color: cor } : undefined}
      >
        {valor}
      </p>
    </div>
  );
}
