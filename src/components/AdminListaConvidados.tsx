import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Search, Plus, Trash2, Utensils, Check } from "lucide-react";
import { semConteudo } from "@/lib/rsvp-lists";
import { vaiAoCasamento, naoVai, porConfirmar, type Convidado } from "@/lib/mesas";
import { useGuardar } from "@/lib/guardar";
import { BarraGuardar } from "@/components/BarraGuardar";
import { LinhaDeslizante } from "@/components/LinhaDeslizante";

interface Linha extends Convidado {
  mesa: string | null;
  restricao: string | null;
  email: string | null;
  telefone: string | null;
}

type Filtro = "confirmados" | "por-confirmar" | "nao-vao" | "todos";

const FILTROS: { chave: Filtro; rotulo: string }[] = [
  { chave: "confirmados", rotulo: "Confirmados" },
  { chave: "por-confirmar", rotulo: "Por confirmar" },
  { chave: "nao-vao", rotulo: "Não vão" },
  { chave: "todos", rotulo: "Todos" },
];

const PRESENCAS = [
  "Sim",
  "Não",
  "Confirma mais tarde",
  "mensagem enviada",
  "pedir a mae para confirmar",
];

export function AdminListaConvidados({ dadosParaTeste }: { dadosParaTeste?: Linha[] } = {}) {
  const [pessoas, setPessoas] = useState<Linha[]>(dadosParaTeste ?? []);
  const [loading, setLoading] = useState(!dadosParaTeste);
  const [filtro, setFiltro] = useState<Filtro>("confirmados");
  const [grupo, setGrupo] = useState("");
  const [busca, setBusca] = useState("");
  const { estado, quantas, marcar, guardar } = useGuardar();

  useEffect(() => {
    if (dadosParaTeste) return;
    (async () => {
      const [c, m, r] = await Promise.all([
        supabase.from("convidados").select("*").order("nome"),
        supabase.from("mesas").select("id, nome"),
        supabase.from("rsvps").select("id, allergies, email, phone"),
      ]);
      if (c.error) {
        toast.error("Não foi possível carregar os convidados.");
        setLoading(false);
        return;
      }
      const mesas = new Map((m.data ?? []).map((x) => [x.id, x.nome]));
      const rsvps = new Map((r.data ?? []).map((x) => [x.id, x]));
      setPessoas(
        ((c.data ?? []) as unknown as Convidado[]).map((p) => {
          const rr = p.rsvp_id ? rsvps.get(p.rsvp_id) : null;
          return {
            ...p,
            mesa: p.mesa_id ? (mesas.get(p.mesa_id) ?? null) : null,
            restricao: rr && !semConteudo(rr.allergies) ? rr.allergies : null,
            email: rr?.email ?? null,
            telefone: rr?.phone ?? null,
          };
        }),
      );
      setLoading(false);
    })();
  }, [dadosParaTeste]);

  const grupos = useMemo(
    () => [...new Set(pessoas.map((p) => p.grupo).filter(Boolean))].sort() as string[],
    [pessoas],
  );

  const contagens = useMemo(
    () => ({
      todos: pessoas.length,
      confirmados: pessoas.filter(vaiAoCasamento).length,
      "por-confirmar": pessoas.filter(porConfirmar).length,
      "nao-vao": pessoas.filter(naoVai).length,
    }),
    [pessoas],
  );

  const visiveis = useMemo(() => {
    const b = busca.trim().toLowerCase();
    return pessoas.filter((p) => {
      if (filtro === "confirmados" && !vaiAoCasamento(p)) return false;
      if (filtro === "por-confirmar" && !porConfirmar(p)) return false;
      if (filtro === "nao-vao" && !naoVai(p)) return false;
      if (grupo && p.grupo !== grupo) return false;
      if (b && !`${p.nome} ${p.grupo ?? ""} ${p.cidade ?? ""}`.toLowerCase().includes(b))
        return false;
      return true;
    });
  }, [pessoas, filtro, grupo, busca]);

  // Escrever põe em espera; só grava ao carregar em «Guardar» (ou ao sair da app).
  function alterar(id: string, campos: Partial<Convidado>) {
    setPessoas((prev) => prev.map((p) => (p.id === id ? { ...p, ...campos } : p)));
    if (dadosParaTeste) return;
    marcar("convidados", id, campos as Record<string, unknown>);
  }

  async function acrescentar() {
    const novo = { nome: "Novo convidado", presenca: "Sim", grupo: grupo || null };
    if (dadosParaTeste) {
      setPessoas((p) => [
        {
          id: `t${p.length}`,
          cidade: null,
          quarto: null,
          mesa_id: null,
          rsvp_id: null,
          notas: null,
          mesa: null,
          restricao: null,
          email: null,
          telefone: null,
          ...novo,
        } as Linha,
        ...p,
      ]);
      return;
    }
    const { data, error } = await supabase.from("convidados").insert(novo).select().single();
    if (error || !data) return toast.error("Não foi possível acrescentar.");
    setPessoas((p) => [
      {
        ...(data as unknown as Convidado),
        mesa: null,
        restricao: null,
        email: null,
        telefone: null,
      },
      ...p,
    ]);
  }

  async function apagar(id: string, nome: string) {
    if (!confirm(`Apagar ${nome} da lista? Não dá para desfazer.`)) return false;
    setPessoas((p) => p.filter((x) => x.id !== id));
    if (dadosParaTeste) return true;
    const { error } = await supabase.from("convidados").delete().eq("id", id);
    if (error) toast.error("Não foi possível apagar.");
    return true;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTROS.map((f) => (
          <Button
            key={f.chave}
            size="sm"
            variant={filtro === f.chave ? "default" : "outline"}
            onClick={() => setFiltro(f.chave)}
          >
            {f.rotulo} ({contagens[f.chave]})
          </Button>
        ))}
        <Button size="sm" variant="outline" className="sm:ml-auto" onClick={acrescentar}>
          <Plus className="w-4 h-4 mr-2" /> Acrescentar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[12rem]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Nome, grupo ou cidade…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <select
          className="rounded-md border bg-background px-3 text-sm min-w-[10rem]"
          value={grupo}
          onChange={(e) => setGrupo(e.target.value)}
        >
          <option value="">Todos os grupos</option>
          {grupos.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-muted-foreground">
        {visiveis.length} {visiveis.length === 1 ? "pessoa" : "pessoas"}
        {filtro === "confirmados" && " · esta é a lista para as mesas"}
      </p>

      {visiveis.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Ninguém corresponde a esta procura.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {visiveis.map((p) => (
            <LinhaDeslizante
              key={p.id}
              pega
              className="border"
              onApagar={() => apagar(p.id, p.nome)}
            >
              <div className="bg-card p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    className="font-medium"
                    defaultValue={p.nome}
                    onBlur={(e) =>
                      e.target.value !== p.nome && alterar(p.id, { nome: e.target.value })
                    }
                  />
                  <Button size="sm" variant="ghost" onClick={() => apagar(p.id, p.nome)}>
                    <Trash2 className="w-4 h-4" style={{ color: "#B85C5C" }} />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="rounded-md border bg-background p-2 text-sm"
                    value={PRESENCAS.includes(p.presenca ?? "") ? (p.presenca as string) : ""}
                    onChange={(e) => alterar(p.id, { presenca: e.target.value })}
                  >
                    {!PRESENCAS.includes(p.presenca ?? "") && (
                      <option value="">{p.presenca || "—"}</option>
                    )}
                    {PRESENCAS.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                  <Input
                    defaultValue={p.grupo ?? ""}
                    placeholder="Grupo"
                    onBlur={(e) =>
                      (e.target.value || null) !== p.grupo &&
                      alterar(p.id, { grupo: e.target.value || null })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    defaultValue={p.cidade ?? ""}
                    placeholder="Cidade"
                    onBlur={(e) =>
                      (e.target.value || null) !== p.cidade &&
                      alterar(p.id, { cidade: e.target.value || null })
                    }
                  />
                  <Input
                    defaultValue={p.quarto ?? ""}
                    placeholder="Quarto"
                    onBlur={(e) =>
                      (e.target.value || null) !== p.quarto &&
                      alterar(p.id, { quarto: e.target.value || null })
                    }
                  />
                </div>

                <p className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                  <span>{p.mesa ? `Mesa: ${p.mesa}` : "Sem mesa"}</span>
                  {p.rsvp_id ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> respondeu no site
                    </span>
                  ) : (
                    <span>não respondeu no site</span>
                  )}
                  {p.email && <span className="truncate">{p.email}</span>}
                  {p.telefone && <span>{p.telefone}</span>}
                </p>

                {p.restricao && (
                  <p
                    className="text-xs rounded-md p-2 flex items-start gap-1.5"
                    style={{ background: "color-mix(in oklab, #C9A961 14%, transparent)" }}
                  >
                    <Utensils className="w-3 h-3 shrink-0 mt-0.5" />
                    <span>{p.restricao}</span>
                  </p>
                )}
              </div>
            </LinhaDeslizante>
          ))}
        </div>
      )}

      <BarraGuardar estado={estado} quantas={quantas} onGuardar={guardar} />
    </div>
  );
}
