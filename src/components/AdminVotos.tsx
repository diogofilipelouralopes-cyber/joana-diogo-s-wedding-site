import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown, Save } from "lucide-react";
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

  const grupo = (categoria: Item["categoria"], titulo: string, dica: string) => {
    const lista = items.filter((i) => i.categoria === categoria);
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-primary">{titulo}</h2>
            <p className="text-sm text-muted-foreground">{dica}</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => add(categoria)}>
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </Button>
        </div>
        {lista.length === 0 && (
          <p className="text-sm text-muted-foreground italic">Ainda nada aqui.</p>
        )}
        {lista.map((it, i) => (
          <div key={it.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                placeholder={categoria === "voto" ? "Quem diz (ex.: Joana)" : "Nome do amigo"}
                value={it.autor}
                onChange={(e) => patch(it.id, { autor: e.target.value })}
              />
              <Input
                placeholder={categoria === "voto" ? "Ex.: Para o Diogo" : "Ex.: Padrinho, amiga de infância"}
                value={it.papel ?? ""}
                onChange={(e) => patch(it.id, { papel: e.target.value })}
              />
            </div>
            <Textarea
              rows={8}
              placeholder="Texto completo…"
              value={it.texto}
              onChange={(e) => patch(it.id, { texto: e.target.value })}
            />
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <span className="text-xs text-muted-foreground">Privado · só para nós</span>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" disabled={i === 0} onClick={() => move(it, -1)} aria-label="Subir">
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" disabled={i === lista.length - 1} onClick={() => move(it, 1)} aria-label="Descer">
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => remove(it)} aria-label="Apagar">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={() => save(it)} disabled={savingId === it.id}>
                  {savingId === it.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  };

  return (
    <div className="max-w-3xl space-y-10">
      {grupo("voto", "Os nossos votos", "Os votos da Joana e do Diogo.")}
      {grupo("discurso", "Palavras dos amigos", "Os discursos de quem falou no dia.")}
    </div>
  );
}
