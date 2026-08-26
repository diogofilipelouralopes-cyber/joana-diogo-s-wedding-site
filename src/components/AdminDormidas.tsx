import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, AlertTriangle, BedDouble } from "lucide-react";

export interface Alojamento {
  id: string;
  nome: string;
  genero: string;
  tipo: string | null;
  capacidade: number | null;
  sexta: string[];
  sabado: string[];
  notas: string | null;
  ordem: number | null;
}

const GENEROS = ["quarto", "bungalô", "camarata"] as const;

export function AdminDormidas({ dadosParaTeste }: { dadosParaTeste?: Alojamento[] } = {}) {
  const [sitios, setSitios] = useState<Alojamento[]>(dadosParaTeste ?? []);
  const [loading, setLoading] = useState(!dadosParaTeste);
  const [noite, setNoite] = useState<"sexta" | "sabado">("sabado");

  useEffect(() => {
    if (dadosParaTeste) return;
    supabase
      .from("alojamentos")
      .select("*")
      .order("ordem")
      .then(({ data, error }) => {
        if (error) toast.error("Não foi possível carregar as dormidas.");
        else setSitios((data ?? []) as unknown as Alojamento[]);
        setLoading(false);
      });
  }, [dadosParaTeste]);

  const resumo = useMemo(() => {
    const camas = sitios.reduce((s, a) => s + a[noite].length, 0);
    const excedidos = sitios.filter((a) => a.capacidade && a[noite].length > a.capacidade).length;
    const vazios = sitios.filter((a) => a[noite].length === 0).length;
    return { sitios: sitios.length, camas, excedidos, vazios };
  }, [sitios, noite]);

  async function guardar(id: string, campos: Partial<Alojamento>) {
    setSitios((prev) => prev.map((a) => (a.id === id ? { ...a, ...campos } : a)));
    if (dadosParaTeste) return;
    const { error } = await supabase.from("alojamentos").update(campos).eq("id", id);
    if (error) toast.error("Não foi possível guardar.");
  }

  async function acrescentar() {
    const novo = { nome: "Novo sítio", genero: "quarto", ordem: sitios.length + 1 };
    if (dadosParaTeste) {
      setSitios((p) => [
        ...p,
        {
          id: `t${p.length}`,
          tipo: "",
          capacidade: null,
          sexta: [],
          sabado: [],
          notas: null,
          ...novo,
        } as Alojamento,
      ]);
      return;
    }
    const { data, error } = await supabase.from("alojamentos").insert(novo).select().single();
    if (error || !data) return toast.error("Não foi possível acrescentar.");
    setSitios((p) => [...p, data as unknown as Alojamento]);
  }

  async function apagar(id: string, nome: string) {
    if (!confirm(`Apagar «${nome}»? Não dá para desfazer.`)) return;
    setSitios((p) => p.filter((a) => a.id !== id));
    if (dadosParaTeste) return;
    const { error } = await supabase.from("alojamentos").delete().eq("id", id);
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
        <Cartao rotulo="Sítios" valor={resumo.sitios} />
        <Cartao
          rotulo={`Camas ocupadas (${noite === "sexta" ? "sexta" : "sábado"})`}
          valor={resumo.camas}
        />
        <Cartao rotulo="Sem ninguém" valor={resumo.vazios} />
        <Cartao
          rotulo="Acima da capacidade"
          valor={resumo.excedidos}
          alerta={resumo.excedidos > 0}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={noite === "sexta" ? "default" : "outline"}
          onClick={() => setNoite("sexta")}
        >
          Sexta, 18
        </Button>
        <Button
          size="sm"
          variant={noite === "sabado" ? "default" : "outline"}
          onClick={() => setNoite("sabado")}
        >
          Sábado, 19
        </Button>
        <Button size="sm" variant="outline" className="ml-auto" onClick={acrescentar}>
          <Plus className="w-4 h-4 mr-2" /> Acrescentar sítio
        </Button>
      </div>

      {GENEROS.map((gen) => {
        const doTipo = sitios.filter((a) => a.genero === gen);
        if (doTipo.length === 0) return null;
        return (
          <section key={gen}>
            <h3 className="flex items-center gap-2 font-medium mb-3 capitalize">
              <BedDouble className="w-4 h-4" /> {gen}s ({doTipo.length})
            </h3>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {doTipo.map((a) => {
                const gente = a[noite];
                const excede = a.capacidade != null && gente.length > a.capacidade;
                return (
                  <div
                    key={a.id}
                    className="rounded-xl border bg-card p-4"
                    style={{ borderColor: excede ? "#B85C5C" : undefined }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        className="font-medium"
                        defaultValue={a.nome}
                        onBlur={(e) =>
                          e.target.value !== a.nome && guardar(a.id, { nome: e.target.value })
                        }
                      />
                      <Button size="sm" variant="ghost" onClick={() => apagar(a.id, a.nome)}>
                        <Trash2 className="w-4 h-4" style={{ color: "#B85C5C" }} />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        className="text-xs"
                        placeholder="Tipo (duplo, suite…)"
                        defaultValue={a.tipo ?? ""}
                        onBlur={(e) =>
                          (e.target.value || null) !== a.tipo &&
                          guardar(a.id, { tipo: e.target.value || null })
                        }
                      />
                      <Input
                        className="w-20 text-xs text-right"
                        placeholder="lugares"
                        defaultValue={a.capacidade ?? ""}
                        onBlur={(e) => {
                          const v = e.target.value.trim() === "" ? null : Number(e.target.value);
                          if (v !== a.capacidade && (v === null || !Number.isNaN(v)))
                            guardar(a.id, { capacidade: v });
                        }}
                      />
                    </div>

                    <p
                      className="text-xs mb-1 flex items-center gap-1"
                      style={{ color: excede ? "#B85C5C" : "var(--muted-foreground)" }}
                    >
                      {excede && <AlertTriangle className="w-3 h-3" />}
                      {gente.length}
                      {a.capacidade ? ` / ${a.capacidade}` : ""}{" "}
                      {gente.length === 1 ? "pessoa" : "pessoas"}
                    </p>

                    <textarea
                      className="w-full rounded-md border bg-background p-2 text-sm min-h-[5rem]"
                      placeholder="Um nome por linha"
                      defaultValue={gente.join("\n")}
                      onBlur={(e) => {
                        const lista = e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        if (lista.join("|") !== gente.join("|"))
                          guardar(a.id, { [noite]: lista } as Partial<Alojamento>);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <p className="text-xs text-muted-foreground">
        Um nome por linha. Não importei preços, pagamentos nem números de identificação — esses
        ficam só no teu planeador.
      </p>
    </div>
  );
}

function Cartao({ rotulo, valor, alerta }: { rotulo: string; valor: number; alerta?: boolean }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-[0.7rem] text-muted-foreground">{rotulo}</p>
      <p className="text-2xl font-medium mt-0.5" style={alerta ? { color: "#B85C5C" } : undefined}>
        {valor}
      </p>
    </div>
  );
}
