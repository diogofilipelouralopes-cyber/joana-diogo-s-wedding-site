import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, AlertTriangle, TrendingUp, Plus, Trash2, RefreshCw } from "lucide-react";
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
  const [prendasDinheiro, setPrendasDinheiro] = useState(0);

  useEffect(() => {
    if (despesasParaTeste) return;
    (async () => {
      const [d, e, pr] = await Promise.all([
        supabase.from("despesas").select("*").order("ordem"),
        supabase.from("entradas").select("*").order("ordem"),
        supabase.from("prendas").select("valor").eq("tipo", "dinheiro"),
      ]);
      if (!pr.error)
        setPrendasDinheiro((pr.data ?? []).reduce((s, x) => s + (Number(x.valor) || 0), 0));
      if (d.error || e.error) toast.error("Não foi possível carregar as contas.");
      else {
        setDespesas((d.data ?? []) as unknown as Despesa[]);
        setEntradas((e.data ?? []) as unknown as Entrada[]);
      }
      setLoading(false);
    })();
  }, [despesasParaTeste]);

  const r = useMemo(() => calcResumo(despesas, entradas), [despesas, entradas]);
  const linhaPrendas = despesas.find((d) => d.atividade.trim().toLowerCase() === "prendas") ?? null;
  const creditoPrendas = Number(linhaPrendas?.estimado ?? 0);
  const desfasado = Math.abs(prendasDinheiro - Math.abs(creditoPrendas)) > 0.01;

  async function guardar(id: string, campos: Partial<Despesa>) {
    setDespesas((prev) => prev.map((d) => (d.id === id ? { ...d, ...campos } : d)));
    if (despesasParaTeste) return;
    const { error } = await supabase.from("despesas").update(campos).eq("id", id);
    if (error) toast.error("Não foi possível guardar.");
  }

  async function novaDespesa() {
    const nova = {
      atividade: "Nova despesa",
      estimado: 0,
      a_pagar: 0,
      pago: 0,
      ordem: despesas.length + 1,
    };
    if (despesasParaTeste) {
      setDespesas((prev) => [
        ...prev,
        { id: `tmp${prev.length}`, descricao: null, notas: null, ...nova } as Despesa,
      ]);
      return;
    }
    const { data, error } = await supabase.from("despesas").insert(nova).select().single();
    if (error || !data) return toast.error("Não foi possível acrescentar.");
    setDespesas((prev) => [...prev, data as unknown as Despesa]);
  }

  async function apagarDespesa(id: string, nome: string) {
    if (!confirm(`Apagar «${nome}»? Não dá para desfazer.`)) return;
    setDespesas((prev) => prev.filter((d) => d.id !== id));
    if (despesasParaTeste) return;
    const { error } = await supabase.from("despesas").delete().eq("id", id);
    if (error) toast.error("Não foi possível apagar.");
  }

  async function novaEntrada() {
    const nova = {
      descricao: "Nova entrada",
      valor: 0,
      tipo: "entrada",
      ordem: entradas.length + 1,
    };
    if (entradasParaTeste) {
      setEntradas((prev) => [
        ...prev,
        { id: `tmpe${prev.length}`, data: null, notas: null, ...nova } as Entrada,
      ]);
      return;
    }
    const { data, error } = await supabase.from("entradas").insert(nova).select().single();
    if (error || !data) return toast.error("Não foi possível acrescentar.");
    setEntradas((prev) => [...prev, data as unknown as Entrada]);
  }

  async function guardarEntrada(id: string, campos: Partial<Entrada>) {
    setEntradas((prev) => prev.map((e) => (e.id === id ? { ...e, ...campos } : e)));
    if (entradasParaTeste) return;
    const { error } = await supabase.from("entradas").update(campos).eq("id", id);
    if (error) toast.error("Não foi possível guardar.");
  }

  async function apagarEntrada(id: string, nome: string) {
    if (!confirm(`Apagar «${nome}»? Não dá para desfazer.`)) return;
    setEntradas((prev) => prev.filter((e) => e.id !== id));
    if (entradasParaTeste) return;
    const { error } = await supabase.from("entradas").delete().eq("id", id);
    if (error) toast.error("Não foi possível apagar.");
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Despesas ({despesas.length})</h3>
          <Button size="sm" variant="outline" onClick={novaDespesa}>
            <Plus className="w-4 h-4 mr-2" /> Acrescentar
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 pr-3">Atividade</th>
                <th className="pb-2 pr-3">Estado</th>
                <th className="pb-2 pr-3 text-right">Estimado</th>
                <th className="pb-2 pr-3 text-right">Pago</th>
                <th className="pb-2 pr-3 text-right">Falta</th>
                <th className="pb-2" />
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
                <td className="pt-3 text-right pr-3">{euros(r.faltaPagar)}</td>
                <td />
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Entradas ({receitas.length})</h3>
            <Button size="sm" variant="outline" onClick={novaEntrada}>
              <Plus className="w-4 h-4 mr-2" /> Acrescentar
            </Button>
          </div>
          <ul className="divide-y text-sm">
            {receitas.map((e) => (
              <li key={e.id} className="py-2 flex items-center gap-2">
                <div className="min-w-0 flex-1 space-y-1">
                  <Input
                    defaultValue={e.descricao}
                    placeholder="Descrição"
                    onBlur={(ev) =>
                      ev.target.value !== e.descricao &&
                      guardarEntrada(e.id, { descricao: ev.target.value })
                    }
                  />
                  <Input
                    type="date"
                    className="text-xs"
                    defaultValue={e.data ?? ""}
                    onBlur={(ev) =>
                      (ev.target.value || null) !== e.data &&
                      guardarEntrada(e.id, { data: ev.target.value || null })
                    }
                  />
                </div>
                <Input
                  className="w-24 text-right"
                  defaultValue={String(e.valor)}
                  onBlur={(ev) => {
                    const v = Number(ev.target.value.replace(",", "."));
                    if (!Number.isNaN(v) && v !== Number(e.valor))
                      guardarEntrada(e.id, { valor: v });
                  }}
                />
                <Button size="sm" variant="ghost" onClick={() => apagarEntrada(e.id, e.descricao)}>
                  <Trash2 className="w-4 h-4" style={{ color: "#B85C5C" }} />
                </Button>
              </li>
            ))}
            <li className="py-2 flex justify-between font-medium">
              <span>Total</span>
              <span>{euros(r.totalEntradas)}</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border bg-card p-4 sm:p-6">
          <h3 className="font-medium mb-3">Prendas e crédito nas despesas</h3>
          <ul className="divide-y text-sm">
            <li className="py-2 flex justify-between">
              <span>Prendas em dinheiro recebidas</span>
              <span>{euros(prendasDinheiro)}</span>
            </li>
            <li className="py-2 flex justify-between">
              <span>Crédito lançado nas despesas</span>
              <span>{euros(Math.abs(creditoPrendas))}</span>
            </li>
            <li className="py-2 flex justify-between font-medium">
              <span>Diferença</span>
              <span style={{ color: desfasado ? "#B85C5C" : undefined }}>
                {euros(prendasDinheiro - Math.abs(creditoPrendas))}
              </span>
            </li>
          </ul>
          {desfasado && linhaPrendas && (
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() =>
                guardar(linhaPrendas.id, { estimado: -prendasDinheiro, a_pagar: -prendasDinheiro })
              }
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Acertar o crédito às prendas
            </Button>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            As prendas geridas no separador «Prendas» abatem ao orçamento através desta linha de
            crédito. Se acrescentares uma prenda, isto avisa-te que a linha ficou desactualizada.
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
