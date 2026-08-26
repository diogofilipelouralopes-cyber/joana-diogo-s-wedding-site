import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Search, Gift, Check } from "lucide-react";
import { totais, euros, TIPOS, type Prenda } from "@/lib/prendas";

export function AdminPrendas({ prendasParaTeste }: { prendasParaTeste?: Prenda[] } = {}) {
  const [prendas, setPrendas] = useState<Prenda[]>(prendasParaTeste ?? []);
  const [loading, setLoading] = useState(!prendasParaTeste);
  const [busca, setBusca] = useState("");
  const [aGravar, setAGravar] = useState(false);
  const [convidados, setConvidados] = useState<
    { id: string; nome: string; grupo: string | null }[]
  >([]);

  useEffect(() => {
    if (prendasParaTeste) return;
    supabase
      .from("prendas")
      .select("*")
      .order("data", { ascending: false })
      .then(async ({ data, error }) => {
        if (error) toast.error("Não foi possível carregar as prendas.");
        else setPrendas((data ?? []) as unknown as Prenda[]);
        const c = await supabase.from("convidados").select("id, nome, grupo").order("nome");
        if (!c.error) setConvidados(c.data ?? []);
        setLoading(false);
      });
  }, [prendasParaTeste]);

  const t = useMemo(() => totais(prendas), [prendas]);

  const visiveis = useMemo(() => {
    const b = busca.trim().toLowerCase();
    if (!b) return prendas;
    return prendas.filter(
      (p) =>
        p.de_quem.toLowerCase().includes(b) ||
        (p.descricao ?? "").toLowerCase().includes(b) ||
        (p.notas ?? "").toLowerCase().includes(b),
    );
  }, [prendas, busca]);

  async function guardar(id: string, campos: Partial<Prenda>) {
    setPrendas((prev) => prev.map((p) => (p.id === id ? { ...p, ...campos } : p)));
    if (prendasParaTeste) return;
    const { error } = await supabase.from("prendas").update(campos).eq("id", id);
    if (error) toast.error("Não foi possível guardar.");
  }

  async function acrescentar() {
    setAGravar(true);
    const nova = { de_quem: "", valor: 0, tipo: "dinheiro", agradecido: false, convidado_id: null };
    if (prendasParaTeste) {
      setPrendas((prev) => [
        { id: `tmp${prev.length}`, data: null, descricao: null, notas: null, ...nova } as Prenda,
        ...prev,
      ]);
      setAGravar(false);
      return;
    }
    const { data, error } = await supabase.from("prendas").insert(nova).select().single();
    setAGravar(false);
    if (error || !data) {
      toast.error("Não foi possível acrescentar.");
      return;
    }
    setPrendas((prev) => [data as unknown as Prenda, ...prev]);
  }

  async function apagar(id: string, quem: string) {
    if (!confirm(`Apagar a prenda de ${quem || "(sem nome)"}? Não dá para desfazer.`)) return;
    setPrendas((prev) => prev.filter((p) => p.id !== id));
    if (prendasParaTeste) return;
    const { error } = await supabase.from("prendas").delete().eq("id", id);
    if (error) toast.error("Não foi possível apagar.");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Cartao rotulo="Prendas recebidas" valor={String(t.n)} />
        <Cartao rotulo="Em dinheiro" valor={euros(t.dinheiro)} />
        <Cartao rotulo="Em espécie" valor={euros(t.especie)} />
        <Cartao rotulo="Por agradecer" valor={String(t.porAgradecer)} alerta={t.porAgradecer > 0} />
      </div>

      <section className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h3 className="flex items-center gap-2 font-medium mr-auto">
            <Gift className="w-4 h-4" /> Prendas
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9 w-56"
              placeholder="Procurar…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={acrescentar} disabled={aGravar}>
            {aGravar ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Acrescentar
          </Button>
        </div>

        {visiveis.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            {busca
              ? "Nada corresponde a esta procura."
              : "Ainda não há prendas. Carrega em «Acrescentar»."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 pr-3">De quem</th>
                  <th className="pb-2 pr-3">Data</th>
                  <th className="pb-2 pr-3">Tipo</th>
                  <th className="pb-2 pr-3 text-right">Valor</th>
                  <th className="pb-2 pr-3">O quê / notas</th>
                  <th className="pb-2 pr-3">Convidado</th>
                  <th className="pb-2 pr-3">Agradecido</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {visiveis.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 pr-3">
                      <Input
                        className="min-w-[9rem]"
                        defaultValue={p.de_quem}
                        placeholder="Nome"
                        onBlur={(e) =>
                          e.target.value !== p.de_quem && guardar(p.id, { de_quem: e.target.value })
                        }
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <Input
                        type="date"
                        className="w-36"
                        defaultValue={p.data ?? ""}
                        onBlur={(e) =>
                          (e.target.value || null) !== p.data &&
                          guardar(p.id, { data: e.target.value || null })
                        }
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <select
                        className="rounded-md border bg-background p-2 text-sm"
                        value={p.tipo}
                        onChange={(e) => guardar(p.id, { tipo: e.target.value })}
                      >
                        {TIPOS.map((x) => (
                          <option key={x.valor} value={x.valor}>
                            {x.rotulo}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 pr-3">
                      <Input
                        className="w-28 text-right"
                        defaultValue={String(p.valor)}
                        onBlur={(e) => {
                          const v = Number(e.target.value.replace(",", "."));
                          if (!Number.isNaN(v) && v !== Number(p.valor))
                            guardar(p.id, { valor: v });
                        }}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <Input
                        className="min-w-[10rem]"
                        defaultValue={p.descricao ?? ""}
                        placeholder={p.tipo === "especie" ? "O que foi oferecido" : "Notas"}
                        onBlur={(e) =>
                          (e.target.value || null) !== p.descricao &&
                          guardar(p.id, { descricao: e.target.value || null })
                        }
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <select
                        className="rounded-md border bg-background p-2 text-sm max-w-[12rem]"
                        value={p.convidado_id ?? ""}
                        onChange={(e) => guardar(p.id, { convidado_id: e.target.value || null })}
                      >
                        <option value="">— não ligado —</option>
                        {convidados.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome}
                            {c.grupo ? ` (${c.grupo})` : ""}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 pr-3 text-center">
                      <button
                        type="button"
                        aria-pressed={p.agradecido}
                        onClick={() => guardar(p.id, { agradecido: !p.agradecido })}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full border"
                        style={{
                          background: p.agradecido ? "var(--olive)" : "transparent",
                          color: p.agradecido ? "var(--cream)" : "var(--muted-foreground)",
                          borderColor: p.agradecido ? "var(--olive)" : "var(--border)",
                        }}
                        title={p.agradecido ? "Já agradecido" : "Marcar como agradecido"}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-2">
                      <Button size="sm" variant="ghost" onClick={() => apagar(p.id, p.de_quem)}>
                        <Trash2 className="w-4 h-4" style={{ color: "#B85C5C" }} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t font-medium">
                  <td className="pt-3" colSpan={3}>
                    Total
                  </td>
                  <td className="pt-3 text-right pr-3">{euros(t.total)}</td>
                  <td colSpan={4} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-3">
          Tudo é editável: escreve e sai do campo para guardar. As prendas em dinheiro aparecem nas
          Contas como crédito.
        </p>
      </section>
    </div>
  );
}

function Cartao({ rotulo, valor, alerta }: { rotulo: string; valor: string; alerta?: boolean }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-[0.7rem] text-muted-foreground">{rotulo}</p>
      <p
        className="text-xl font-medium mt-1 whitespace-nowrap"
        style={alerta ? { color: "#B85C5C" } : undefined}
      >
        {valor}
      </p>
    </div>
  );
}
