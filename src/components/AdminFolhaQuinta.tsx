import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Printer, AlertTriangle } from "lucide-react";
import { semConteudo } from "@/lib/rsvp-lists";
import { naoVai, porConfirmar, type Convidado, type Mesa } from "@/lib/mesas";

interface Linha extends Convidado {
  restricao: string | null;
  pessoasNaResposta: number | null;
}

export function AdminFolhaQuinta({
  mesasParaTeste,
  convidadosParaTeste,
}: { mesasParaTeste?: Mesa[]; convidadosParaTeste?: Linha[] } = {}) {
  const [mesas, setMesas] = useState<Mesa[]>(mesasParaTeste ?? []);
  const [pessoas, setPessoas] = useState<Linha[]>(convidadosParaTeste ?? []);
  const [loading, setLoading] = useState(!mesasParaTeste);

  useEffect(() => {
    if (mesasParaTeste) return;
    (async () => {
      const [m, c, r] = await Promise.all([
        supabase.from("mesas").select("*").order("ordem"),
        supabase.from("convidados").select("*").order("nome"),
        supabase.from("rsvps").select("id, allergies, guests"),
      ]);
      if (m.error || c.error || r.error) {
        toast.error("Não foi possível carregar a folha.");
        setLoading(false);
        return;
      }
      const porRsvp = new Map(
        (r.data ?? []).map((x) => [x.id, { allergies: x.allergies, guests: x.guests }]),
      );
      setMesas((m.data ?? []) as unknown as Mesa[]);
      setPessoas(
        ((c.data ?? []) as unknown as Convidado[]).map((p) => {
          const rr = p.rsvp_id ? porRsvp.get(p.rsvp_id) : null;
          return {
            ...p,
            restricao: rr && !semConteudo(rr.allergies) ? rr.allergies : null,
            pessoasNaResposta: rr?.guests ?? null,
          };
        }),
      );
      setLoading(false);
    })();
  }, [mesasParaTeste]);

  const porMesa = useMemo(() => {
    const mapa = new Map<string, Linha[]>();
    for (const p of pessoas)
      if (p.mesa_id) {
        const l = mapa.get(p.mesa_id) ?? [];
        l.push(p);
        mapa.set(p.mesa_id, l);
      }
    for (const l of mapa.values()) l.sort((a, b) => a.nome.localeCompare(b.nome, "pt"));
    return mapa;
  }, [pessoas]);

  const restricoes = useMemo(
    () => pessoas.filter((p) => p.restricao).sort((a, b) => a.nome.localeCompare(b.nome, "pt")),
    [pessoas],
  );

  const sentadas = pessoas.filter((p) => p.mesa_id).length;
  const semMesa = pessoas.filter((p) => !p.mesa_id && !naoVai(p)).length;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap no-print">
        <div>
          <h2 className="font-medium">Folha para a quinta</h2>
          <p className="text-sm text-muted-foreground">
            Mesa a mesa, com as restrições assinaladas. Pronta a imprimir ou guardar em PDF.
          </p>
        </div>
        <Button onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" /> Imprimir
        </Button>
      </div>

      {semMesa > 0 && (
        <p
          className="flex items-center gap-2 text-sm rounded-xl border p-3 no-print"
          style={{ background: "color-mix(in oklab, #C9A961 12%, transparent)" }}
        >
          <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: "#B8935A" }} />
          {semMesa === 1
            ? "1 pessoa ainda não tem mesa e não aparece nesta folha."
            : `${semMesa} pessoas ainda não têm mesa e não aparecem nesta folha.`}
        </p>
      )}

      <div className="folha rounded-xl border bg-card p-6 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="font-display text-2xl">Joana &amp; Diogo</h1>
          <p className="text-sm text-muted-foreground">
            19 de Setembro de 2026 · Glicínia Wedding House
          </p>
          <p className="text-sm mt-2">
            {sentadas} pessoas · {mesas.length} mesas · {restricoes.length}{" "}
            {restricoes.length === 1 ? "restrição" : "restrições"}
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-6">
          {mesas.map((m) => {
            const lista = porMesa.get(m.id) ?? [];
            return (
              <section key={m.id} className="break-inside-avoid">
                <h3 className="font-medium border-b pb-1 mb-2 flex justify-between">
                  <span>{m.nome}</span>
                  <span className="text-sm text-muted-foreground">
                    {lista.length} / {m.lugares}
                  </span>
                </h3>
                {lista.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem ninguém.</p>
                ) : (
                  <ol className="text-sm space-y-0.5">
                    {lista.map((p, i) => (
                      <li key={p.id} className="flex gap-2">
                        <span className="text-muted-foreground w-5 shrink-0 text-right">
                          {i + 1}
                        </span>
                        <span className="min-w-0">
                          {p.nome}
                          {p.restricao && <strong className="ml-1">· restrição</strong>}
                          {naoVai(p) && (
                            <span className="ml-1 text-muted-foreground">· disse que não vai</span>
                          )}
                          {porConfirmar(p) && (
                            <span className="ml-1 text-muted-foreground">· por confirmar</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            );
          })}
        </div>

        <section className="mt-10 break-inside-avoid">
          <h3 className="font-medium border-b pb-1 mb-3">Restrições alimentares</h3>
          {restricoes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma registada.</p>
          ) : (
            <ul className="text-sm space-y-2">
              {restricoes.map((p) => {
                const mesa = mesas.find((m) => m.id === p.mesa_id);
                return (
                  <li key={p.id}>
                    <strong>{p.nome}</strong>
                    {mesa ? ` — ${mesa.nome}` : " — sem mesa"}
                    {p.pessoasNaResposta && p.pessoasNaResposta > 1 && (
                      <span className="text-muted-foreground">
                        {" "}
                        (respondeu por {p.pessoasNaResposta} pessoas)
                      </span>
                    )}
                    : {p.restricao}
                  </li>
                );
              })}
            </ul>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            As restrições vêm do formulário do site. Quem respondeu por várias pessoas pode estar a
            falar de outra pessoa do seu grupo.
          </p>
        </section>
      </div>
    </div>
  );
}
