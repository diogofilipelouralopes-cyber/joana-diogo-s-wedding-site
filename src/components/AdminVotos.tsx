import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown, Save, Pencil } from "lucide-react";
import { toast } from "sonner";

type Item = {
  id: string;
  categoria: "voto" | "discurso";
  autor: string;
  papel: string | null;
  texto: string;
  ordem: number;
  publicado: boolean;
};

export function AdminVotos() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aba, setAba] = useState<Item["categoria"]>("voto");

  const load = async () => {
    const { data, error } = await supabase
      .from("votos_discursos")
      .select("*")
      .order("categoria", { ascending: false })
      .order("ordem");
    if (error) toast.error("Não foi possível carregar.");
    setItems((data as Item[]) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const add = async (categoria: Item["categoria"]) => {
    const ordem = items.filter((i) => i.categoria === categoria).length;
    const { error } = await supabase.from("votos_discursos").insert({
      categoria,
      autor: categoria === "voto" ? "" : "",
      papel: categoria === "voto" ? null : "",
      texto: "",
      ordem,
    });
    if (error) return toast.error("Erro ao adicionar.");
    load();
  };

  const patch = (id: string, p: Partial<Item>) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const save = async (it: Item) => {
    setSavingId(it.id);
    const { error } = await supabase
      .from("votos_discursos")
      .update({ autor: it.autor, papel: it.papel, texto: it.texto, publicado: it.publicado, ordem: it.ordem })
      .eq("id", it.id);
    setSavingId(null);
    if (error) toast.error("Erro ao guardar.");
    else toast.success("Guardado.");
  };

  const remove = async (it: Item) => {
    if (!confirm(`Apagar o texto de ${it.autor || "sem nome"}?`)) return;
    const { error } = await supabase.from("votos_discursos").delete().eq("id", it.id);
    if (error) return toast.error("Erro ao apagar.");
    load();
  };

  const move = async (it: Item, dir: -1 | 1) => {
    const grupo = items.filter((i) => i.categoria === it.categoria);
    const idx = grupo.findIndex((g) => g.id === it.id);
    const other = grupo[idx + dir];
    if (!other) return;
    await Promise.all([
      supabase.from("votos_discursos").update({ ordem: other.ordem }).eq("id", it.id),
      supabase.from("votos_discursos").update({ ordem: it.ordem }).eq("id", other.id),
    ]);
    load();
  };

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );

  const lista = items.filter((i) => i.categoria === aba);

  const editor = (it: Item, i: number) => (
    <div key={it.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <Input placeholder="Nome" value={it.autor} onChange={(e) => patch(it.id, { autor: e.target.value })} />
        <Input placeholder="Ex.: Para o Diogo, Padrinho" value={it.papel ?? ""} onChange={(e) => patch(it.id, { papel: e.target.value })} />
      </div>
      <Textarea rows={14} placeholder="Texto completo…" value={it.texto} onChange={(e) => patch(it.id, { texto: e.target.value })} />
      <div className="flex flex-wrap gap-1 justify-end">
        <Button size="icon" variant="ghost" disabled={i === 0} onClick={() => move(it, -1)} aria-label="Subir"><ArrowUp className="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" disabled={i === lista.length - 1} onClick={() => move(it, 1)} aria-label="Descer"><ArrowDown className="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => remove(it)} aria-label="Apagar"><Trash2 className="w-4 h-4" /></Button>
        <Button size="sm" variant="outline" onClick={() => { setEditingId(null); load(); }}>Cancelar</Button>
        <Button size="sm" onClick={async () => { await save(it); setEditingId(null); }} disabled={savingId === it.id}>
          {savingId === it.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
          Guardar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-6 mb-10">
        {(["voto", "discurso"] as const).map((c) => (
          <button
            key={c}
            onClick={() => { setAba(c); setEditingId(null); }}
            className="font-display text-lg sm:text-xl pb-1 border-b transition-colors"
            style={{ color: aba === c ? "var(--olive)" : "var(--muted-foreground)", borderColor: aba === c ? "var(--gold)" : "transparent" }}
          >
            {c === "voto" ? "Os nossos votos" : "Palavras dos amigos"}
          </button>
        ))}
      </div>

      {lista.length === 0 && (
        <p className="text-center italic text-muted-foreground py-10" style={{ fontFamily: "Georgia, serif" }}>
          Ainda não há nada nestas páginas.
        </p>
      )}

      <div className="space-y-16">
        {lista.map((it, i) =>
          editingId === it.id ? editor(it, i) : (
            <article key={it.id} className="group relative">
              <header className="text-center mb-8">
                <h3 className="font-display text-3xl sm:text-4xl text-primary">{it.autor || "Sem nome"}</h3>
                {it.papel && (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--gold)" }}>{it.papel}</p>
                )}
                <div className="mx-auto mt-5 h-px w-12" style={{ background: "var(--gold)" }} />
              </header>
              <div
                className="text-foreground/90 text-[17px] sm:text-[18px] leading-[1.9] space-y-5"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {it.texto
                  .split(/\n\s*\n/)
                  .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
                  .filter(Boolean)
                  .map((p, k) => <p key={k}>{p}</p>)}
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={() => setEditingId(it.id)}
                  className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
                >
                  <Pencil className="w-3 h-3" /> Editar
                </button>
              </div>
              {i < lista.length - 1 && (
                <p className="text-center mt-14 text-xl" style={{ color: "var(--gold)" }}>❦</p>
              )}
            </article>
          ),
        )}
      </div>

      <div className="text-center mt-16">
        <Button size="sm" variant="outline" onClick={() => add(aba)}>
          <Plus className="w-4 h-4 mr-1" /> {aba === "voto" ? "Adicionar voto" : "Adicionar discurso"}
        </Button>
      </div>
    </div>
  );
}
