import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, UtensilsCrossed, Phone } from "lucide-react";

export interface LinhaMenu {
  id: string;
  categoria: string;
  descricao: string | null;
  ordem: number | null;
}
export interface Fornecedor {
  id: string;
  categoria: string | null;
  nome: string;
  telefone: string | null;
  ordem: number | null;
}

export function AdminDiaD({
  menuParaTeste,
  fornecedoresParaTeste,
}: { menuParaTeste?: LinhaMenu[]; fornecedoresParaTeste?: Fornecedor[] } = {}) {
  const [menu, setMenu] = useState<LinhaMenu[]>(menuParaTeste ?? []);
  const [forn, setForn] = useState<Fornecedor[]>(fornecedoresParaTeste ?? []);
  const [loading, setLoading] = useState(!menuParaTeste);

  useEffect(() => {
    if (menuParaTeste) return;
    (async () => {
      const [m, f] = await Promise.all([
        supabase.from("menu").select("*").order("ordem"),
        supabase.from("fornecedores").select("*").order("ordem"),
      ]);
      if (m.error || f.error) toast.error("Não foi possível carregar.");
      else {
        setMenu((m.data ?? []) as unknown as LinhaMenu[]);
        setForn((f.data ?? []) as unknown as Fornecedor[]);
      }
      setLoading(false);
    })();
  }, [menuParaTeste]);

  const porCategoria = useMemo(() => {
    const mapa = new Map<string, Fornecedor[]>();
    for (const f of forn) {
      const k = f.categoria?.trim() || "Sem categoria";
      mapa.set(k, [...(mapa.get(k) ?? []), f]);
    }
    return [...mapa.entries()];
  }, [forn]);

  async function gMenu(id: string, campos: Partial<LinhaMenu>) {
    setMenu((p) => p.map((x) => (x.id === id ? { ...x, ...campos } : x)));
    if (menuParaTeste) return;
    const { error } = await supabase.from("menu").update(campos).eq("id", id);
    if (error) toast.error("Não foi possível guardar.");
  }
  async function gForn(id: string, campos: Partial<Fornecedor>) {
    setForn((p) => p.map((x) => (x.id === id ? { ...x, ...campos } : x)));
    if (fornecedoresParaTeste) return;
    const { error } = await supabase.from("fornecedores").update(campos).eq("id", id);
    if (error) toast.error("Não foi possível guardar.");
  }
  async function novoMenu() {
    const novo = { categoria: "Novo", descricao: "", ordem: menu.length + 1 };
    if (menuParaTeste) return setMenu((p) => [...p, { id: `t${p.length}`, ...novo } as LinhaMenu]);
    const { data, error } = await supabase.from("menu").insert(novo).select().single();
    if (error || !data) return toast.error("Não foi possível acrescentar.");
    setMenu((p) => [...p, data as unknown as LinhaMenu]);
  }
  async function novoForn() {
    const novo = { nome: "Novo contacto", categoria: "", telefone: "", ordem: forn.length + 1 };
    if (fornecedoresParaTeste)
      return setForn((p) => [...p, { id: `t${p.length}`, ...novo } as Fornecedor]);
    const { data, error } = await supabase.from("fornecedores").insert(novo).select().single();
    if (error || !data) return toast.error("Não foi possível acrescentar.");
    setForn((p) => [...p, data as unknown as Fornecedor]);
  }
  async function apagar(tabela: "menu" | "fornecedores", id: string, nome: string) {
    if (!confirm(`Apagar «${nome}»? Não dá para desfazer.`)) return;
    if (tabela === "menu") setMenu((p) => p.filter((x) => x.id !== id));
    else setForn((p) => p.filter((x) => x.id !== id));
    if (menuParaTeste) return;
    const { error } = await supabase.from(tabela).delete().eq("id", id);
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
    <div className="grid lg:grid-cols-2 gap-6">
      <section className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 font-medium">
            <UtensilsCrossed className="w-4 h-4" /> Ementa
          </h3>
          <Button size="sm" variant="outline" onClick={novoMenu}>
            <Plus className="w-4 h-4 mr-2" /> Acrescentar
          </Button>
        </div>
        <ul className="space-y-2">
          {menu.map((m) => (
            <li key={m.id} className="flex items-center gap-2">
              <Input
                className="w-36 shrink-0"
                defaultValue={m.categoria}
                onBlur={(e) =>
                  e.target.value !== m.categoria && gMenu(m.id, { categoria: e.target.value })
                }
              />
              <Input
                defaultValue={m.descricao ?? ""}
                placeholder="Descrição"
                onBlur={(e) =>
                  (e.target.value || null) !== m.descricao &&
                  gMenu(m.id, { descricao: e.target.value || null })
                }
              />
              <Button size="sm" variant="ghost" onClick={() => apagar("menu", m.id, m.categoria)}>
                <Trash2 className="w-4 h-4" style={{ color: "#B85C5C" }} />
              </Button>
            </li>
          ))}
          {menu.length === 0 && <li className="text-sm text-muted-foreground py-3">Sem ementa.</li>}
        </ul>
      </section>

      <section className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 font-medium">
            <Phone className="w-4 h-4" /> Contactos ({forn.length})
          </h3>
          <Button size="sm" variant="outline" onClick={novoForn}>
            <Plus className="w-4 h-4 mr-2" /> Acrescentar
          </Button>
        </div>
        <div className="space-y-5">
          {porCategoria.map(([cat, lista]) => (
            <div key={cat}>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">{cat}</p>
              <ul className="space-y-2">
                {lista.map((f) => (
                  <li key={f.id} className="flex items-center gap-2">
                    <Input
                      defaultValue={f.nome}
                      onBlur={(e) =>
                        e.target.value !== f.nome && gForn(f.id, { nome: e.target.value })
                      }
                    />
                    <Input
                      className="w-40 shrink-0"
                      defaultValue={f.telefone ?? ""}
                      placeholder="Telefone"
                      onBlur={(e) =>
                        (e.target.value || null) !== f.telefone &&
                        gForn(f.id, { telefone: e.target.value || null })
                      }
                    />
                    {f.telefone && (
                      <a
                        href={`tel:${f.telefone.replace(/\s/g, "")}`}
                        className="btn btn-secondary btn-sm shrink-0"
                        title="Ligar"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => apagar("fornecedores", f.id, f.nome)}
                    >
                      <Trash2 className="w-4 h-4" style={{ color: "#B85C5C" }} />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          A categoria é editável na base de dados; se quiseres reorganizar os grupos, diz-me.
        </p>
      </section>
    </div>
  );
}
