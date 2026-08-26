import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Search, Check, ListTodo } from "lucide-react";
import { useGuardar } from "@/lib/guardar";
import { BarraGuardar } from "@/components/BarraGuardar";

export interface Tarefa {
  id: string;
  texto: string;
  comentario: string | null;
  grupo: string | null;
  feita: boolean;
  ordem: number | null;
}

type Filtro = "por-fazer" | "feitas" | "todas";

export function AdminTarefas({ dadosParaTeste }: { dadosParaTeste?: Tarefa[] } = {}) {
  const [tarefas, setTarefas] = useState<Tarefa[]>(dadosParaTeste ?? []);
  const [loading, setLoading] = useState(!dadosParaTeste);
  const [filtro, setFiltro] = useState<Filtro>("por-fazer");
  const [grupo, setGrupo] = useState("");
  const [busca, setBusca] = useState("");
  const [nova, setNova] = useState("");
  const { estado, quantas, marcar, guardar } = useGuardar();
  const campoNova = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dadosParaTeste) return;
    supabase
      .from("tarefas")
      .select("*")
      .order("feita")
      .order("ordem")
      .then(({ data, error }) => {
        if (error) toast.error("Não foi possível carregar a lista.");
        else setTarefas((data ?? []) as unknown as Tarefa[]);
        setLoading(false);
      });
  }, [dadosParaTeste]);

  const grupos = useMemo(
    () => [...new Set(tarefas.map((t) => t.grupo).filter(Boolean))].sort() as string[],
    [tarefas],
  );

  const contagens = useMemo(
    () => ({
      "por-fazer": tarefas.filter((t) => !t.feita).length,
      feitas: tarefas.filter((t) => t.feita).length,
      todas: tarefas.length,
    }),
    [tarefas],
  );

  const visiveis = useMemo(() => {
    const b = busca.trim().toLowerCase();
    return tarefas.filter((t) => {
      if (filtro === "por-fazer" && t.feita) return false;
      if (filtro === "feitas" && !t.feita) return false;
      if (grupo && t.grupo !== grupo) return false;
      if (b && !`${t.texto} ${t.comentario ?? ""} ${t.grupo ?? ""}`.toLowerCase().includes(b))
        return false;
      return true;
    });
  }, [tarefas, filtro, grupo, busca]);

  /** Texto e comentário ficam em espera; o visto grava já. */
  function alterar(id: string, campos: Partial<Tarefa>) {
    setTarefas((p) => p.map((t) => (t.id === id ? { ...t, ...campos } : t)));
    if (dadosParaTeste) return;
    marcar("tarefas", id, campos as Record<string, unknown>);
  }

  async function riscar(t: Tarefa) {
    const feita = !t.feita;
    setTarefas((p) => p.map((x) => (x.id === t.id ? { ...x, feita } : x)));
    if (dadosParaTeste) return;
    const { error } = await supabase.from("tarefas").update({ feita }).eq("id", t.id);
    if (error) toast.error("Não foi possível guardar.");
  }

  async function acrescentar() {
    const texto = nova.trim();
    if (!texto) return;
    setNova("");
    campoNova.current?.focus();
    const novaTarefa = { texto, grupo: grupo || null, feita: false, ordem: tarefas.length + 1 };
    if (dadosParaTeste) {
      setTarefas((p) => [{ id: `t${p.length}`, comentario: null, ...novaTarefa } as Tarefa, ...p]);
      return;
    }
    const { data, error } = await supabase.from("tarefas").insert(novaTarefa).select().single();
    if (error || !data) return toast.error("Não foi possível acrescentar.");
    setTarefas((p) => [data as unknown as Tarefa, ...p]);
  }

  async function apagar(t: Tarefa) {
    if (!confirm(`Apagar «${t.texto}»? Não dá para desfazer.`)) return;
    setTarefas((p) => p.filter((x) => x.id !== t.id));
    if (dadosParaTeste) return;
    const { error } = await supabase.from("tarefas").delete().eq("id", t.id);
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
    <div className="space-y-4 pb-20">
      <div className="rounded-xl border bg-card p-3 sm:p-4">
        <label className="flex items-center gap-2 text-sm font-medium mb-2">
          <ListTodo className="w-4 h-4" /> Acrescentar à lista
        </label>
        <div className="flex gap-2">
          <Input
            ref={campoNova}
            value={nova}
            placeholder={grupo ? `Nova tarefa em «${grupo}»…` : "O que falta fazer?"}
            onChange={(e) => setNova(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") acrescentar();
            }}
          />
          <Button onClick={acrescentar} disabled={!nova.trim()}>
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Acrescentar</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Carrega Enter para acrescentar várias seguidas. Se tiveres um grupo escolhido, a tarefa
          entra nesse grupo.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["por-fazer", "Por fazer"],
            ["feitas", "Feitas"],
            ["todas", "Todas"],
          ] as [Filtro, string][]
        ).map(([k, r]) => (
          <Button
            key={k}
            size="sm"
            variant={filtro === k ? "default" : "outline"}
            onClick={() => setFiltro(k)}
          >
            {r} ({contagens[k]})
          </Button>
        ))}
        <select
          className="rounded-md border bg-background px-3 text-sm min-w-[9rem]"
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
        <div className="relative flex-1 min-w-[10rem]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Procurar…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {visiveis.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {filtro === "por-fazer" ? "Não falta nada. 🎉" : "Nada aqui."}
        </p>
      ) : (
        <ul className="space-y-2">
          {visiveis.map((t) => (
            <li key={t.id} className="rounded-xl border bg-card p-3 flex items-start gap-3">
              <button
                type="button"
                aria-pressed={t.feita}
                onClick={() => riscar(t)}
                title={t.feita ? "Marcar como por fazer" : "Marcar como feita"}
                className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full border mt-0.5"
                style={{
                  background: t.feita ? "var(--olive)" : "transparent",
                  color: t.feita ? "var(--cream)" : "var(--muted-foreground)",
                  borderColor: t.feita ? "var(--olive)" : "var(--border)",
                }}
              >
                <Check className="w-4 h-4" />
              </button>

              <div className="min-w-0 flex-1 space-y-2">
                <Input
                  defaultValue={t.texto}
                  className={t.feita ? "line-through opacity-60" : ""}
                  onBlur={(e) =>
                    e.target.value !== t.texto && alterar(t.id, { texto: e.target.value })
                  }
                />
                <Input
                  defaultValue={t.comentario ?? ""}
                  placeholder="Nota, ponto a falar, quem trata…"
                  className="text-sm"
                  onBlur={(e) =>
                    (e.target.value || null) !== t.comentario &&
                    alterar(t.id, { comentario: e.target.value || null })
                  }
                />
                <Input
                  defaultValue={t.grupo ?? ""}
                  placeholder="Grupo (ex.: Reunião quinta)"
                  className="text-xs"
                  onBlur={(e) =>
                    (e.target.value || null) !== t.grupo &&
                    alterar(t.id, { grupo: e.target.value || null })
                  }
                />
              </div>

              <Button size="sm" variant="ghost" className="shrink-0" onClick={() => apagar(t)}>
                <Trash2 className="w-4 h-4" style={{ color: "#B85C5C" }} />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <BarraGuardar estado={estado} quantas={quantas} onGuardar={guardar} />
    </div>
  );
}
