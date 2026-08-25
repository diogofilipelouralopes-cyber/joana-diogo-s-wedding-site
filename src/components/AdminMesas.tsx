import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Search, Users, Armchair } from "lucide-react";
import { ocupacaoMesas, semConteudo, type RsvpRow } from "@/lib/rsvp-lists";

const COLUNAS = "id, name, guests, attending, allergies, song_suggestion, message, table_number";

export function AdminMesas({ rowsParaTeste }: { rowsParaTeste?: RsvpRow[] } = {}) {
  const [rows, setRows] = useState<RsvpRow[]>(rowsParaTeste ?? []);
  const [loading, setLoading] = useState(!rowsParaTeste);
  const [busca, setBusca] = useState("");
  const [soSemMesa, setSoSemMesa] = useState(false);
  const [aGravar, setAGravar] = useState<string | null>(null);

  useEffect(() => {
    // Com dados injectados (pré-visualização local) não se consulta a base de dados.
    if (rowsParaTeste) return;
    supabase
      .from("rsvps")
      .select(COLUNAS)
      .eq("attending", true)
      .order("name")
      .then(({ data, error }) => {
        if (error) toast.error("Não foi possível carregar os convidados.");
        else setRows((data ?? []) as unknown as RsvpRow[]);
        setLoading(false);
      });
  }, [rowsParaTeste]);

  const mesas = useMemo(() => ocupacaoMesas(rows), [rows]);

  const totais = useMemo(() => {
    const pessoas = rows.reduce((s, r) => s + Math.max(1, r.guests ?? 1), 0);
    const sentadas = rows
      .filter((r) => !semConteudo(r.table_number))
      .reduce((s, r) => s + Math.max(1, r.guests ?? 1), 0);
    return { pessoas, sentadas, porSentar: pessoas - sentadas };
  }, [rows]);

  const visiveis = useMemo(() => {
    const b = busca.trim().toLowerCase();
    return rows.filter((r) => {
      if (soSemMesa && !semConteudo(r.table_number)) return false;
      if (b && !r.name.toLowerCase().includes(b)) return false;
      return true;
    });
  }, [rows, busca, soSemMesa]);

  async function guardarMesa(id: string, valor: string) {
    const limpo = valor.trim();
    // Em pré-visualização local não se escreve na base de dados de produção.
    if (rowsParaTeste) {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, table_number: limpo || null } : r)));
      return;
    }
    setAGravar(id);
    const { error } = await supabase
      .from("rsvps")
      .update({ table_number: limpo === "" ? null : limpo })
      .eq("id", id);
    setAGravar(null);
    if (error) {
      toast.error("Não foi possível guardar a mesa.");
      return;
    }
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, table_number: limpo === "" ? null : limpo } : r)),
    );
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
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Resumo rotulo="Pessoas confirmadas" valor={totais.pessoas} />
        <Resumo rotulo="Já com mesa" valor={totais.sentadas} />
        <Resumo rotulo="Por sentar" valor={totais.porSentar} destaque={totais.porSentar > 0} />
      </div>

      {mesas.length > 0 && (
        <section className="rounded-xl border bg-card p-4 sm:p-6">
          <h3 className="flex items-center gap-2 font-medium mb-3">
            <Armchair className="w-4 h-4" />
            Ocupação por mesa
          </h3>
          <div className="flex flex-wrap gap-2">
            {mesas.map((m) => (
              <span key={m.mesa} className="rounded-full border px-3 py-1 text-sm">
                Mesa {m.mesa} · <strong>{m.pessoas}</strong>{" "}
                {m.pessoas === 1 ? "pessoa" : "pessoas"}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[12rem]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Procurar por nome…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Button
            variant={soSemMesa ? "default" : "outline"}
            size="sm"
            onClick={() => setSoSemMesa((v) => !v)}
          >
            <Users className="w-4 h-4 mr-2" />
            Só por sentar
          </Button>
        </div>

        {visiveis.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">Ninguém corresponde a esta procura.</p>
        ) : (
          <ul className="divide-y">
            {visiveis.map((r) => (
              <li key={r.id} className="py-3 flex items-center gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.max(1, r.guests ?? 1)}{" "}
                    {Math.max(1, r.guests ?? 1) === 1 ? "pessoa" : "pessoas"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground" htmlFor={`mesa-${r.id}`}>
                    Mesa
                  </label>
                  <Input
                    id={`mesa-${r.id}`}
                    className="w-24"
                    defaultValue={r.table_number ?? ""}
                    placeholder="—"
                    onBlur={(e) => {
                      const v = e.target.value;
                      if ((r.table_number ?? "") !== v.trim()) guardarMesa(r.id, v);
                    }}
                  />
                  {aGravar === r.id && (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Resumo({
  rotulo,
  valor,
  destaque,
}: {
  rotulo: string;
  valor: number;
  destaque?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs text-muted-foreground">{rotulo}</p>
      <p className="text-2xl font-medium mt-1" style={destaque ? { color: "#B85C5C" } : undefined}>
        {valor}
      </p>
    </div>
  );
}
