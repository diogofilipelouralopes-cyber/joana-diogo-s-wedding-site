import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  Search,
  AlertTriangle,
  Link2,
  Link2Off,
  Plus,
  X,
  LayoutGrid,
  Map,
  UserMinus,
} from "lucide-react";
import { NomeArrastavel } from "@/components/NomeArrastavel";
import {
  avisos as calcAvisos,
  contagens,
  grupoDaMesa,
  lugaresDoGrupo,
  ocupacaoDoGrupo,
  naoVai,
  vaiAoCasamento,
  porConfirmar,
  type Convidado,
  type Mesa,
} from "@/lib/mesas";

const RAIO = 74; // raio visual de uma mesa no mapa

export function AdminPlanoMesas({
  mesasParaTeste,
  convidadosParaTeste,
}: { mesasParaTeste?: Mesa[]; convidadosParaTeste?: Convidado[] } = {}) {
  const [mesas, setMesas] = useState<Mesa[]>(mesasParaTeste ?? []);
  const [convidados, setConvidados] = useState<Convidado[]>(convidadosParaTeste ?? []);
  const [loading, setLoading] = useState(!mesasParaTeste);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [vista, setVista] = useState<"lista" | "mapa">("lista");
  const [busca, setBusca] = useState("");
  const [soConfirmados, setSoConfirmados] = useState(true);
  const arrastando = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const tela = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mesasParaTeste) return;
    (async () => {
      const [m, c] = await Promise.all([
        supabase.from("mesas").select("*").order("ordem"),
        supabase.from("convidados").select("*").order("nome"),
      ]);
      if (m.error || c.error) toast.error("Não foi possível carregar o plano de mesas.");
      else {
        setMesas((m.data ?? []) as unknown as Mesa[]);
        setConvidados((c.data ?? []) as unknown as Convidado[]);
      }
      setLoading(false);
    })();
  }, [mesasParaTeste]);

  const stats = useMemo(() => contagens(convidados), [convidados]);
  const avisos = useMemo(() => calcAvisos(mesas, convidados), [mesas, convidados]);
  const mesaSel = mesas.find((m) => m.id === selecionada) ?? null;

  const naMesa = useMemo(
    () => (id: string) =>
      convidados
        .filter((c) => c.mesa_id === id)
        .sort((a, b) => (a.lugar ?? 9999) - (b.lugar ?? 9999)),
    [convidados],
  );

  const porSentar = useMemo(() => {
    const b = busca.trim().toLowerCase();
    return convidados
      .filter((c) => !c.mesa_id)
      .filter((c) => (soConfirmados ? vaiAoCasamento(c) : true))
      .filter(
        (c) => !b || c.nome.toLowerCase().includes(b) || (c.grupo ?? "").toLowerCase().includes(b),
      );
  }, [convidados, busca, soConfirmados]);

  async function guardarConvidado(id: string, mesa_id: string | null) {
    setConvidados((prev) => prev.map((c) => (c.id === id ? { ...c, mesa_id } : c)));
    if (convidadosParaTeste) return;
    const { error } = await supabase.from("convidados").update({ mesa_id }).eq("id", id);
    if (error) toast.error("Não foi possível guardar.");
  }

  /**
   * Largar um nome: noutra mesa muda-o de mesa; na mesma mesa, sobre outro
   * nome, troca a ordem dos lugares; fora de qualquer mesa, tira-o das mesas.
   */
  async function moverPara(
    convidadoId: string,
    mesaDestino: string | null,
    sobreId: string | null,
  ) {
    const eu = convidados.find((c) => c.id === convidadoId);
    if (!eu) return;

    // Reordenar dentro da mesa
    if (mesaDestino && sobreId && sobreId !== convidadoId && eu.mesa_id === mesaDestino) {
      const lista = convidados
        .filter((c) => c.mesa_id === mesaDestino)
        .sort((a, b) => (a.lugar ?? 9999) - (b.lugar ?? 9999));
      const de = lista.findIndex((c) => c.id === convidadoId);
      const para = lista.findIndex((c) => c.id === sobreId);
      if (de < 0 || para < 0) return;
      const nova = [...lista];
      nova.splice(para, 0, ...nova.splice(de, 1));
      const comLugar = nova.map((c, i) => ({ ...c, lugar: i + 1 }));
      setConvidados((prev) => prev.map((c) => comLugar.find((x) => x.id === c.id) ?? c));
      if (convidadosParaTeste) return;
      await Promise.all(
        comLugar.map((c) => supabase.from("convidados").update({ lugar: c.lugar }).eq("id", c.id)),
      );
      return;
    }

    if ((eu.mesa_id ?? null) === mesaDestino) return;

    // Mudar de mesa: entra no fim da mesa de destino
    const ultimos = convidados.filter((c) => c.mesa_id === mesaDestino);
    const lugar = mesaDestino ? Math.max(0, ...ultimos.map((c) => c.lugar ?? 0)) + 1 : null;
    setConvidados((prev) =>
      prev.map((c) => (c.id === convidadoId ? { ...c, mesa_id: mesaDestino, lugar } : c)),
    );
    if (convidadosParaTeste) return;
    const { error } = await supabase
      .from("convidados")
      .update({ mesa_id: mesaDestino, lugar })
      .eq("id", convidadoId);
    if (error) toast.error("Não foi possível guardar.");
  }

  async function tirarQuemNaoVai() {
    const alvos = convidados.filter((c) => naoVai(c) && c.mesa_id);
    if (alvos.length === 0) return;
    if (
      !confirm(
        alvos.length === 1
          ? "Tirar das mesas 1 pessoa que disse que não vem? Podes voltar a sentá-la depois."
          : `Tirar das mesas ${alvos.length} pessoas que disseram que não vêm? Podes voltar a sentá-las depois.`,
      )
    )
      return;
    setConvidados((prev) =>
      prev.map((c) => (naoVai(c) && c.mesa_id ? { ...c, mesa_id: null } : c)),
    );
    if (convidadosParaTeste) return;
    const { error } = await supabase
      .from("convidados")
      .update({ mesa_id: null })
      .in(
        "id",
        alvos.map((c) => c.id),
      );
    if (error) toast.error("Não foi possível tirar das mesas.");
    else
      toast.success(
        `${alvos.length} ${alvos.length === 1 ? "pessoa retirada" : "pessoas retiradas"} das mesas.`,
      );
  }

  async function guardarMesa(id: string, campos: Partial<Mesa>) {
    setMesas((prev) => prev.map((m) => (m.id === id ? { ...m, ...campos } : m)));
    if (mesasParaTeste) return;
    const { error } = await supabase.from("mesas").update(campos).eq("id", id);
    if (error) toast.error("Não foi possível guardar a mesa.");
  }

  function aoLargar(e: React.PointerEvent) {
    const a = arrastando.current;
    if (!a || !tela.current) return;
    const r = tela.current.getBoundingClientRect();
    const x = Math.max(0, Math.round(e.clientX - r.left - a.dx));
    const y = Math.max(0, Math.round(e.clientY - r.top - a.dy));
    guardarMesa(a.id, { pos_x: x, pos_y: y });
    arrastando.current = null;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const largura = Math.max(...mesas.map((m) => m.pos_x), 0) + RAIO * 2 + 40;
  const altura = Math.max(...mesas.map((m) => m.pos_y), 0) + RAIO * 2 + 40;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Resumo rotulo="Pessoas" valor={stats.total} />
        <Resumo rotulo="Confirmadas" valor={stats.confirmados} />
        <Resumo rotulo="Sentadas" valor={stats.sentados} />
        <Resumo rotulo="Por sentar" valor={stats.porSentar} alerta={stats.porSentar > 0} />
        <Resumo rotulo="Por confirmar" valor={stats.porConfirmar} />
      </div>

      {avisos.length > 0 && (
        <div
          className="rounded-xl border p-4"
          style={{ background: "color-mix(in oklab, #C9A961 12%, transparent)" }}
        >
          {avisos.map((a) => (
            <p key={a.tipo} className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: "#B8935A" }} />
              {a.texto}
            </p>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          variant={vista === "lista" ? "default" : "outline"}
          onClick={() => setVista("lista")}
        >
          <LayoutGrid className="w-4 h-4 mr-2" /> Lista
        </Button>
        <Button
          size="sm"
          variant={vista === "mapa" ? "default" : "outline"}
          onClick={() => setVista("mapa")}
        >
          <Map className="w-4 h-4 mr-2" /> Mapa
        </Button>
        {convidados.some((c) => naoVai(c) && c.mesa_id) && (
          <Button size="sm" variant="outline" className="ml-auto" onClick={tirarQuemNaoVai}>
            <UserMinus className="w-4 h-4 mr-2" />
            Tirar quem não vem ({convidados.filter((c) => naoVai(c) && c.mesa_id).length})
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-[1fr_17rem] lg:grid-cols-[1fr_20rem] gap-4 lg:gap-6 items-start">
        {/* ---- mapa ou lista ---- */}
        {vista === "lista" ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 content-start">
            {mesas.map((m) => {
              const pessoas = naMesa(m.id);
              const lugares = lugaresDoGrupo(m, mesas);
              const ocupacao = ocupacaoDoGrupo(m, mesas, convidados);
              const excede = ocupacao > lugares;
              const parceira = grupoDaMesa(m, mesas).find((x) => x.id !== m.id);
              const activa = selecionada === m.id;
              return (
                <div
                  key={m.id}
                  data-mesa={m.id}
                  className="rounded-xl border bg-card p-4"
                  style={{
                    borderColor: excede ? "#B85C5C" : activa ? "var(--primary)" : undefined,
                    boxShadow: activa ? "0 6px 18px -12px rgba(0,0,0,.3)" : undefined,
                  }}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <button
                      className="font-medium text-left"
                      onClick={() => setSelecionada(activa ? null : m.id)}
                    >
                      {m.nome}
                      {parceira && (
                        <span className="text-xs text-muted-foreground font-normal">
                          {" "}
                          + {parceira.nome}
                        </span>
                      )}
                    </button>
                    <span
                      className="text-xs whitespace-nowrap"
                      style={{ color: excede ? "#B85C5C" : "var(--muted-foreground)" }}
                    >
                      {ocupacao} / {lugares}
                    </span>
                  </div>

                  {pessoas.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">Mesa vazia.</p>
                  ) : (
                    <ol className="text-sm space-y-1">
                      {pessoas.map((c, i) => (
                        <li key={c.id} data-convidado={c.id} className="group">
                          <NomeArrastavel
                            onLargarEm={(destino, sobre) => moverPara(c.id, destino, sobre)}
                          >
                            <span className="text-xs text-muted-foreground w-4 shrink-0 text-right">
                              {i + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate">{c.nome}</span>
                              <span className="block text-[0.7rem] text-muted-foreground truncate">
                                {c.grupo}
                                {naoVai(c)
                                  ? " · disse que não vai"
                                  : porConfirmar(c)
                                    ? " · por confirmar"
                                    : ""}
                                {c.quarto ? ` · quarto ${c.quarto}` : ""}
                              </span>
                            </span>
                            <button
                              onClick={() => guardarConvidado(c.id, null)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                              title="Tirar da mesa"
                            >
                              <X className="w-3.5 h-3.5" style={{ color: "#B85C5C" }} />
                            </button>
                          </NomeArrastavel>
                        </li>
                      ))}
                    </ol>
                  )}

                  <Button
                    size="sm"
                    variant={activa ? "default" : "outline"}
                    className="w-full mt-3"
                    onClick={() => setSelecionada(activa ? null : m.id)}
                  >
                    {activa ? "A receber pessoas" : "Escolher esta mesa"}
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-4 overflow-auto">
            <p className="text-xs text-muted-foreground mb-3">
              Arrasta as mesas para as posicionares. Clica numa mesa para veres quem lá está.
            </p>
            <div
              ref={tela}
              className="relative"
              style={{ width: largura, height: altura, minWidth: "100%" }}
              onPointerMove={(e) => {
                if (arrastando.current) e.preventDefault();
              }}
              onPointerUp={aoLargar}
            >
              {mesas.map((m) => {
                const pessoas = naMesa(m.id);
                const lugares = lugaresDoGrupo(m, mesas);
                const ocupacao = ocupacaoDoGrupo(m, mesas, convidados);
                const excede = ocupacao > lugares;
                const juntada = grupoDaMesa(m, mesas).length > 1;
                const activa = selecionada === m.id;
                return (
                  <button
                    key={m.id}
                    onPointerDown={(e) => {
                      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      arrastando.current = {
                        id: m.id,
                        dx: e.clientX - r.left,
                        dy: e.clientY - r.top,
                      };
                    }}
                    onClick={() => setSelecionada(activa ? null : m.id)}
                    className="absolute flex flex-col items-center justify-center text-center transition-shadow"
                    style={{
                      left: m.pos_x,
                      top: m.pos_y,
                      width: RAIO * 2,
                      height: RAIO * 2,
                      borderRadius: m.forma === "comprida" ? 16 : "50%",
                      border: `2px solid ${excede ? "#B85C5C" : activa ? "var(--primary)" : "color-mix(in oklab, var(--gold) 55%, transparent)"}`,
                      background: activa
                        ? "color-mix(in oklab, var(--primary) 10%, var(--card))"
                        : "var(--card)",
                      boxShadow: activa ? "0 8px 24px -12px rgba(0,0,0,.35)" : "none",
                      cursor: "grab",
                      touchAction: "none",
                    }}
                  >
                    <span className="text-sm font-medium">{m.nome}</span>
                    <span
                      className="text-xs"
                      style={{ color: excede ? "#B85C5C" : "var(--muted-foreground)" }}
                    >
                      {ocupacao} / {lugares}
                    </span>
                    {juntada && <Link2 className="w-3 h-3 mt-1 text-muted-foreground" />}
                    <span className="text-[0.6rem] text-muted-foreground mt-1 px-2 leading-tight line-clamp-2">
                      {pessoas
                        .slice(0, 2)
                        .map((p) => p.nome.split(" ")[0])
                        .join(", ")}
                      {pessoas.length > 2 ? "…" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---- painel lateral ---- */}
        <div className="space-y-4 md:sticky md:top-4">
          {mesaSel ? (
            <DetalheMesa
              mesa={mesaSel}
              mesas={mesas}
              pessoas={naMesa(mesaSel.id)}
              onGuardarMesa={guardarMesa}
              onRemover={(id) => guardarConvidado(id, null)}
              onFechar={() => setSelecionada(null)}
            />
          ) : (
            <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
              Clica numa mesa para a editares.
            </p>
          )}

          <div className="rounded-xl border bg-card p-4">
            <h3 className="font-medium mb-3">Por sentar ({porSentar.length})</h3>
            <div className="relative mb-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Nome ou grupo…"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <input
                type="checkbox"
                checked={soConfirmados}
                onChange={(e) => setSoConfirmados(e.target.checked)}
              />
              Só quem confirmou
            </label>
            <ul className="max-h-72 overflow-auto divide-y">
              {porSentar.map((c) => (
                <li key={c.id} className="py-2">
                  <NomeArrastavel
                    onLargarEm={(destino, sobre) => destino && moverPara(c.id, destino, sobre)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm truncate">{c.nome}</p>
                      <p className="text-[0.7rem] text-muted-foreground truncate">
                        {c.grupo}
                        {porConfirmar(c) ? " · por confirmar" : ""}
                      </p>
                    </div>
                    {mesaSel && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => guardarConvidado(c.id, mesaSel.id)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    )}
                  </NomeArrastavel>
                </li>
              ))}
              {porSentar.length === 0 && (
                <li className="py-3 text-sm text-muted-foreground">Ninguém por sentar.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetalheMesa({
  mesa,
  mesas,
  pessoas,
  onGuardarMesa,
  onRemover,
  onFechar,
}: {
  mesa: Mesa;
  mesas: Mesa[];
  pessoas: Convidado[];
  onGuardarMesa: (id: string, campos: Partial<Mesa>) => void;
  onRemover: (id: string) => void;
  onFechar: () => void;
}) {
  const parceira = mesas.find((m) => m.id === mesa.juntada_com || m.juntada_com === mesa.id);
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{mesa.nome}</h3>
        <Button size="sm" variant="ghost" onClick={onFechar}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <label className="text-xs text-muted-foreground">Lugares</label>
        {[10, 12, 18].map((n) => (
          <Button
            key={n}
            size="sm"
            variant={mesa.lugares === n ? "default" : "outline"}
            onClick={() => onGuardarMesa(mesa.id, { lugares: n })}
          >
            {n}
          </Button>
        ))}
      </div>

      <div className="mb-3">
        {parceira ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onGuardarMesa(mesa.id, { juntada_com: null });
              onGuardarMesa(parceira.id, { juntada_com: null });
            }}
          >
            <Link2Off className="w-4 h-4 mr-2" /> Separar de {parceira.nome}
          </Button>
        ) : (
          <select
            className="w-full rounded-md border bg-background p-2 text-sm"
            value=""
            onChange={(e) =>
              e.target.value && onGuardarMesa(mesa.id, { juntada_com: e.target.value })
            }
          >
            <option value="">Juntar a outra mesa…</option>
            {mesas
              .filter((m) => m.id !== mesa.id && !m.juntada_com)
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
          </select>
        )}
      </div>

      <ul className="divide-y max-h-64 overflow-auto">
        {pessoas.map((p) => (
          <li key={p.id} className="py-2 flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm truncate">{p.nome}</p>
              <p className="text-[0.7rem] text-muted-foreground truncate">
                {p.grupo}
                {naoVai(p) ? " · disse que não vai" : porConfirmar(p) ? " · por confirmar" : ""}
                {p.quarto ? ` · quarto ${p.quarto}` : ""}
              </p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => onRemover(p.id)}>
              <X className="w-3 h-3" />
            </Button>
          </li>
        ))}
        {pessoas.length === 0 && (
          <li className="py-3 text-sm text-muted-foreground">Mesa vazia.</li>
        )}
      </ul>
    </div>
  );
}

function Resumo({ rotulo, valor, alerta }: { rotulo: string; valor: number; alerta?: boolean }) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <p className="text-[0.7rem] text-muted-foreground">{rotulo}</p>
      <p className="text-2xl font-medium mt-0.5" style={alerta ? { color: "#B85C5C" } : undefined}>
        {valor}
      </p>
    </div>
  );
}
