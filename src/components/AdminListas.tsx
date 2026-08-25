import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2,
  Copy,
  Check,
  Utensils,
  Music,
  MessageSquareWarning,
  AlertTriangle,
} from "lucide-react";
import {
  listaRestricoes,
  listaMusicas,
  listaRecados,
  restricoesSuspeitas,
  pessoasComRestricao,
  paraTexto,
  type ItemLista,
  type RsvpRow,
} from "@/lib/rsvp-lists";

const COLUNAS = "id, name, guests, attending, allergies, song_suggestion, message, table_number";

export function AdminListas({ rowsParaTeste }: { rowsParaTeste?: RsvpRow[] } = {}) {
  const [rows, setRows] = useState<RsvpRow[]>(rowsParaTeste ?? []);
  const [loading, setLoading] = useState(!rowsParaTeste);
  const [copiado, setCopiado] = useState<string | null>(null);

  useEffect(() => {
    // Com dados injectados (pré-visualização local) não se consulta a base de dados.
    if (rowsParaTeste) return;
    supabase
      .from("rsvps")
      .select(COLUNAS)
      .order("name")
      .then(({ data, error }) => {
        if (error) toast.error("Não foi possível carregar as respostas.");
        else setRows((data ?? []) as unknown as RsvpRow[]);
        setLoading(false);
      });
  }, [rowsParaTeste]);

  const restricoes = useMemo(() => listaRestricoes(rows), [rows]);
  const suspeitas = useMemo(() => restricoesSuspeitas(rows), [rows]);
  const musicas = useMemo(() => listaMusicas(rows), [rows]);
  const recados = useMemo(() => listaRecados(rows), [rows]);
  const pessoas = useMemo(() => pessoasComRestricao(rows), [rows]);

  const idsSuspeitos = useMemo(() => new Set(suspeitas.map((s) => s.id)), [suspeitas]);

  async function copiar(chave: string, titulo: string, itens: ItemLista[], comPessoas = true) {
    try {
      await navigator.clipboard.writeText(paraTexto(titulo, itens, comPessoas));
      setCopiado(chave);
      toast.success("Copiado. Já podes colar no email.");
      setTimeout(() => setCopiado(null), 2000);
    } catch {
      toast.error("O browser não deixou copiar. Selecciona o texto à mão.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Bloco
        icone={<Utensils className="w-4 h-4" />}
        titulo="Restrições alimentares"
        resumo={`${restricoes.length} ${restricoes.length === 1 ? "resposta" : "respostas"} · até ${pessoas} ${pessoas === 1 ? "pessoa" : "pessoas"}`}
        vazio="Ninguém indicou restrições."
        itens={restricoes}
        idsSuspeitos={idsSuspeitos}
        copiado={copiado === "restricoes"}
        onCopiar={() =>
          copiar("restricoes", "Restrições alimentares — Casamento Joana & Diogo", restricoes)
        }
        nota={
          suspeitas.length > 0 ? (
            <p
              className="flex items-start gap-2 text-xs sm:text-sm rounded-md p-3 mb-4"
              style={{
                background: "color-mix(in oklab, #C9A961 14%, transparent)",
                color: "var(--foreground)",
              }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#B8935A" }} />
              <span>
                <strong>{suspeitas.length}</strong>{" "}
                {suspeitas.length === 1
                  ? "resposta assinalada não parece ser sobre comida"
                  : "respostas assinaladas não parecem ser sobre comida"}{" "}
                — estão marcadas abaixo. Pode ser um recado escrito no campo errado; vale a pena ler
                antes de mandar ao catering.
              </span>
            </p>
          ) : null
        }
      />

      <Bloco
        icone={<Music className="w-4 h-4" />}
        titulo="Sugestões de música"
        resumo={`${musicas.length} ${musicas.length === 1 ? "sugestão" : "sugestões"}`}
        vazio="Ainda não há sugestões."
        itens={musicas}
        copiado={copiado === "musicas"}
        onCopiar={() =>
          copiar("musicas", "Sugestões de música — Casamento Joana & Diogo", musicas, false)
        }
      />

      <Bloco
        icone={<MessageSquareWarning className="w-4 h-4" />}
        titulo="Recados deixados no formulário"
        resumo={`${recados.length} ${recados.length === 1 ? "recado" : "recados"}`}
        vazio="Sem recados."
        itens={recados}
        copiado={copiado === "recados"}
        onCopiar={() =>
          copiar("recados", "Recados do formulário — Casamento Joana & Diogo", recados, false)
        }
      />
    </div>
  );
}

function Bloco({
  icone,
  titulo,
  resumo,
  vazio,
  itens,
  idsSuspeitos,
  nota,
  copiado,
  onCopiar,
}: {
  icone: React.ReactNode;
  titulo: string;
  resumo: string;
  vazio: string;
  itens: ItemLista[];
  idsSuspeitos?: Set<string>;
  nota?: React.ReactNode;
  copiado: boolean;
  onCopiar: () => void;
}) {
  return (
    <section className="rounded-xl border bg-card p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h3 className="flex items-center gap-2 font-medium">
            {icone}
            {titulo}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{resumo}</p>
        </div>
        {itens.length > 0 && (
          <Button variant="outline" size="sm" onClick={onCopiar}>
            {copiado ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copiado ? "Copiado" : "Copiar lista"}
          </Button>
        )}
      </div>

      {nota}

      {itens.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">{vazio}</p>
      ) : (
        <ul className="divide-y">
          {itens.map((i) => {
            const suspeito = idsSuspeitos?.has(i.id);
            return (
              <li key={i.id} className="py-3 flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium flex items-center gap-2 flex-wrap">
                    {i.nome}
                    <span className="text-xs text-muted-foreground">
                      {i.pessoas} {i.pessoas === 1 ? "pessoa" : "pessoas"}
                    </span>
                    {suspeito && (
                      <span
                        className="text-[0.65rem] uppercase tracking-wide rounded px-1.5 py-0.5"
                        style={{
                          background: "color-mix(in oklab, #C9A961 22%, transparent)",
                          color: "#7a5f2a",
                        }}
                      >
                        verificar
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-foreground/80 mt-0.5 break-words">{i.texto}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
