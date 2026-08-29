import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Minus,
  X,
  LayoutGrid,
  Map,
  UserMinus,
  Trash2,
  Check,
  UserPlus,
  Save,
  ArrowRightLeft,
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

/** Uma escrita que não passou e que se pode repetir. */
type Falha = { tabela: "convidados" | "mesas"; id: string; campos: Record<string, unknown> };

/** Raio de referência para posicionar mesas novas no mapa. */
const RAIO_BASE = 74;

/** No telemóvel as mesas do mapa são mais pequenas para caberem. */
function useRaio() {
  const [raio, setRaio] = useState(RAIO_BASE);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const ajusta = () => setRaio(mq.matches ? 54 : RAIO_BASE);
    ajusta();
    mq.addEventListener("change", ajusta);
    return () => mq.removeEventListener("change", ajusta);
  }, []);
  return raio;
}

/** Medidas de cada forma no mapa. A oval é mais larga do que alta. */
function medidas(forma: string, raio: number) {
  if (forma === "oval") return { largura: raio * 2.7, altura: raio * 1.7, cantos: "50%" };
  if (forma === "comprida") return { largura: raio * 2.7, altura: raio * 1.4, cantos: 14 };
  return { largura: raio * 2, altura: raio * 2, cantos: "50%" };
}

/** Cor conforme o estado de ocupação, usada no mapa e nos cartões. */
function corDaOcupacao(ocupacao: number, lugares: number) {
  if (ocupacao > lugares) return "#B85C5C";
  if (lugares > 0 && ocupacao === lugares) return "#7A8C5C";
  return "var(--gold)";
}

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
  const [folhaAberta, setFolhaAberta] = useState(false);
  // No telemóvel duas mesas nunca cabem no ecrã ao mesmo tempo, por isso
  // arrastar de uma para a outra é impossível. Esta é a alternativa por toque.
  const [aMover, setAMover] = useState<Convidado | null>(null);
  const arrastando = useRef<{ id: string; dx: number; dy: number } | null>(null);
  // Lugares que o dedo já pediu mas que o ecrã ainda não mostrou.
  const lugaresPendentes = useRef<Record<string, number>>({});
  const gravarLugares = useRef<Record<string, number>>({});
  const tela = useRef<HTMLDivElement>(null);
  const envolvente = useRef<HTMLDivElement>(null);
  // No telemóvel o mapa inteiro encolhe para caber sem se arrastar para o lado.
  const [escala, setEscala] = useState(1);
  const raio = useRaio();
  const soLocal = Boolean(mesasParaTeste || convidadosParaTeste);
  // Aqui grava-se logo, sem botão Guardar: arrastar um nome e depois ter de
  // confirmar seria estranho. Mas o que falhar não pode ficar só num toast que
  // passa — fica registado e a barra do fundo insiste até se resolver.
  const [falhas, setFalhas] = useState<Falha[]>([]);
  const [aRepetir, setARepetir] = useState(false);

  /** Escreve e, se falhar, guarda a operação para se poder repetir. */
  const escrever = useCallback(
    async (ops: Falha[]) => {
      if (soLocal) return;
      const falhou: Falha[] = [];
      for (const op of ops) {
        const { error } = await supabase
          .from(op.tabela)
          .update(op.campos as never)
          .eq("id", op.id);
        if (error) falhou.push(op);
      }
      if (falhou.length) {
        // Sem Map: neste ficheiro `Map` é o ícone do lucide, não o do JavaScript.
        setFalhas((prev) => {
          const juntas: Record<string, Falha> = {};
          [...prev, ...falhou].forEach((f) => {
            const k = `${f.tabela}:${f.id}`;
            juntas[k] = { ...f, campos: { ...(juntas[k]?.campos ?? {}), ...f.campos } };
          });
          return Object.values(juntas);
        });
      }
    },
    [soLocal],
  );

  const repetirFalhas = useCallback(async () => {
    if (falhas.length === 0) return;
    setARepetir(true);
    const paraTentar = falhas;
    setFalhas([]);
    await escrever(paraTentar);
    setARepetir(false);
  }, [falhas, escrever]);

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

  // A oval e a comprida são mais largas do que a redonda; a tela tem de contar
  // com a maior, senão a última mesa da direita fica cortada.
  const maisLarga = Math.max(...mesas.map((m) => medidas(m.forma, raio).largura), raio * 2);
  const maisAlta = Math.max(...mesas.map((m) => medidas(m.forma, raio).altura), raio * 2);
  const largura = Math.max(...mesas.map((m) => m.pos_x), 0) + maisLarga + 40;
  const altura = Math.max(...mesas.map((m) => m.pos_y), 0) + maisAlta + 40;

  useEffect(() => {
    const el = envolvente.current;
    if (!el || vista !== "mapa") return;
    const medir = () => setEscala(Math.min(1, el.clientWidth / largura));
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [vista, largura]);

  // Quando a rede volta, repetir o que falhou sem esperar por um toque.
  useEffect(() => {
    if (falhas.length === 0) return;
    const aoVoltarARede = () => void repetirFalhas();
    window.addEventListener("online", aoVoltarARede);
    return () => window.removeEventListener("online", aoVoltarARede);
  }, [falhas.length, repetirFalhas]);

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
    const lugar = mesa_id
      ? Math.max(0, ...convidados.filter((c) => c.mesa_id === mesa_id).map((c) => c.lugar ?? 0)) + 1
      : null;
    setConvidados((prev) => prev.map((c) => (c.id === id ? { ...c, mesa_id, lugar } : c)));
    await escrever([{ tabela: "convidados", id, campos: { mesa_id, lugar } }]);
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
      await escrever(
        comLugar.map((c) => ({
          tabela: "convidados" as const,
          id: c.id,
          campos: { lugar: c.lugar },
        })),
      );
      return;
    }

    if ((eu.mesa_id ?? null) === mesaDestino) return;
    await guardarConvidado(convidadoId, mesaDestino);
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
      prev.map((c) => (naoVai(c) && c.mesa_id ? { ...c, mesa_id: null, lugar: null } : c)),
    );
    await escrever(
      alvos.map((c) => ({
        tabela: "convidados" as const,
        id: c.id,
        campos: { mesa_id: null, lugar: null },
      })),
    );
  }

  async function guardarMesa(id: string, campos: Partial<Mesa>) {
    if (campos.lugares !== undefined) lugaresPendentes.current[id] = campos.lugares;
    setMesas((prev) => prev.map((m) => (m.id === id ? { ...m, ...campos } : m)));
    await escrever([{ tabela: "mesas", id, campos }]);
  }

  /**
   * Somar ou tirar lugares. Dois toques seguidos no + acontecem antes de o
   * ecrã se voltar a desenhar, por isso o valor de partida vem de uma
   * referência actualizada na hora — ler do estado perderia um dos toques.
   * A gravação espera que os toques parem, para não escrever a cada um.
   */
  function ajustarLugares(id: string, delta: number) {
    const partida = lugaresPendentes.current[id] ?? mesas.find((m) => m.id === id)?.lugares ?? 1;
    const valor = Math.max(1, partida + delta);
    lugaresPendentes.current[id] = valor;
    setMesas((prev) => prev.map((m) => (m.id === id ? { ...m, lugares: valor } : m)));

    if (soLocal) return;
    window.clearTimeout(gravarLugares.current[id]);
    gravarLugares.current[id] = window.setTimeout(() => {
      void escrever([{ tabela: "mesas", id, campos: { lugares: valor } }]);
    }, 500);
  }

  /** Mesa nova: número a seguir ao maior que existe, colocada em grelha no mapa. */
  async function criarMesa() {
    const usados = mesas.map((m) => Number(m.nome.match(/\d+/)?.[0] ?? 0));
    const numero = Math.max(0, ...usados) + 1;
    const i = mesas.length;
    const nova = {
      nome: `Mesa ${numero}`,
      lugares: 10,
      forma: "redonda",
      pos_x: (i % 4) * (RAIO_BASE * 2 + 24),
      pos_y: Math.floor(i / 4) * (RAIO_BASE * 2 + 24),
      ordem: Math.max(0, ...mesas.map((m) => m.ordem ?? 0)) + 1,
    };

    if (soLocal) {
      const local: Mesa = { ...nova, id: `local-${numero}`, juntada_com: null, notas: null };
      setMesas((prev) => [...prev, local]);
      setSelecionada(local.id);
      return;
    }

    const { data, error } = await supabase.from("mesas").insert(nova).select().single();
    if (error || !data) {
      toast.error("Não foi possível criar a mesa.");
      return;
    }
    setMesas((prev) => [...prev, data as unknown as Mesa]);
    setSelecionada((data as unknown as Mesa).id);
    toast.success(`${nova.nome} criada.`);
  }

  /** Apagar uma mesa devolve quem lá estava a «por sentar». */
  async function apagarMesa(m: Mesa) {
    const pessoas = convidados.filter((c) => c.mesa_id === m.id);
    const aviso =
      pessoas.length === 0
        ? `Apagar a ${m.nome}?`
        : `Apagar a ${m.nome}? ${pessoas.length === 1 ? "A pessoa que lá está volta" : `As ${pessoas.length} pessoas que lá estão voltam`} para «por sentar».`;
    if (!confirm(aviso)) return;

    setConvidados((prev) =>
      prev.map((c) => (c.mesa_id === m.id ? { ...c, mesa_id: null, lugar: null } : c)),
    );
    setMesas((prev) =>
      prev
        .filter((x) => x.id !== m.id)
        .map((x) => (x.juntada_com === m.id ? { ...x, juntada_com: null } : x)),
    );
    setSelecionada(null);
    if (soLocal) return;

    // A ordem importa: as chaves estrangeiras apontam para esta mesa.
    await supabase.from("convidados").update({ mesa_id: null, lugar: null }).eq("mesa_id", m.id);
    await supabase.from("mesas").update({ juntada_com: null }).eq("juntada_com", m.id);
    const { error } = await supabase.from("mesas").delete().eq("id", m.id);
    if (error) toast.error("Não foi possível apagar a mesa.");
    else toast.success(`${m.nome} apagada.`);
  }

  function aoLargar(e: React.PointerEvent) {
    const a = arrastando.current;
    if (!a || !tela.current) return;
    const r = tela.current.getBoundingClientRect();
    // O rectângulo já vem escalado; as posições guardadas são em tamanho real.
    const x = Math.max(0, Math.round((e.clientX - r.left) / escala - a.dx));
    const y = Math.max(0, Math.round((e.clientY - r.top) / escala - a.dy));
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

  const painelPorSentar = (
    <ListaPorSentar
      pessoas={porSentar}
      busca={busca}
      setBusca={setBusca}
      soConfirmados={soConfirmados}
      setSoConfirmados={setSoConfirmados}
      mesaSel={mesaSel}
      onSentar={(id) => mesaSel && guardarConvidado(id, mesaSel.id)}
      onLargar={moverPara}
    />
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
        <Resumo rotulo="Pessoas" valor={stats.total} />
        <Resumo rotulo="Confirmadas" valor={stats.confirmados} />
        <Resumo rotulo="Sentadas" valor={stats.sentados} />
        <Resumo rotulo="Por sentar" valor={stats.porSentar} alerta={stats.porSentar > 0} />
        <Resumo rotulo="Por confirmar" valor={stats.porConfirmar} />
      </div>

      {avisos.length > 0 && (
        <div
          className="rounded-xl border p-4 space-y-1"
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

      <div className="flex flex-wrap gap-2">
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
        <Button size="sm" variant="outline" onClick={criarMesa}>
          <Plus className="w-4 h-4 mr-2" /> Nova mesa
        </Button>
        {convidados.some((c) => naoVai(c) && c.mesa_id) && (
          <Button size="sm" variant="outline" className="sm:ml-auto" onClick={tirarQuemNaoVai}>
            <UserMinus className="w-4 h-4 mr-2" />
            Tirar quem não vem ({convidados.filter((c) => naoVai(c) && c.mesa_id).length})
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_20rem] gap-4 lg:gap-6 items-start">
        {/* ---- mapa ou lista ---- */}
        {vista === "lista" ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 content-start">
            {mesas.length === 0 && (
              <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">
                Ainda não há mesas. Carrega em «Nova mesa» para criar a primeira.
              </p>
            )}
            {mesas.map((m) => {
              const pessoas = naMesa(m.id);
              const lugares = lugaresDoGrupo(m, mesas);
              const ocupacao = ocupacaoDoGrupo(m, mesas, convidados);
              const excede = ocupacao > lugares;
              const parceira = grupoDaMesa(m, mesas).find((x) => x.id !== m.id);
              const activa = selecionada === m.id;
              const cor = corDaOcupacao(ocupacao, lugares);
              return (
                <div
                  key={m.id}
                  data-mesa={m.id}
                  className="rounded-xl border bg-card p-4 flex flex-col"
                  style={{
                    borderColor: excede ? "#B85C5C" : activa ? "var(--primary)" : undefined,
                    boxShadow: activa ? "0 6px 18px -12px rgba(0,0,0,.3)" : undefined,
                  }}
                >
                  <button
                    className="flex items-baseline justify-between gap-2 text-left w-full"
                    onClick={() => setSelecionada(activa ? null : m.id)}
                  >
                    <span className="font-medium">
                      {m.nome}
                      {parceira && (
                        <span className="text-xs text-muted-foreground font-normal">
                          {" "}
                          + {parceira.nome}
                        </span>
                      )}
                    </span>
                    <span className="text-xs whitespace-nowrap tabular-nums" style={{ color: cor }}>
                      {ocupacao} / {lugares}
                    </span>
                  </button>

                  <BarraOcupacao ocupacao={ocupacao} lugares={lugares} />

                  {pessoas.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">Mesa vazia.</p>
                  ) : (
                    <ol className="text-sm space-y-1 mt-2">
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
                              onClick={() => setAMover(c)}
                              className="acao-da-linha shrink-0 p-1"
                              title="Mudar de mesa"
                              aria-label={`Mudar ${c.nome} de mesa`}
                            >
                              <ArrowRightLeft
                                className="w-4 h-4"
                                style={{ color: "var(--muted-foreground)" }}
                              />
                            </button>
                            <button
                              onClick={() => guardarConvidado(c.id, null)}
                              className="acao-da-linha shrink-0 p-1 -mr-1"
                              title="Tirar da mesa"
                              aria-label={`Tirar ${c.nome} da mesa`}
                            >
                              <X className="w-4 h-4" style={{ color: "#B85C5C" }} />
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
              Arrasta as mesas para as posicionares. Cada ponto à volta é um lugar; os cheios são
              quem já lá está. Toca numa mesa para a editares.
            </p>
            {/* O transform não muda o espaço ocupado: sem overflow escondido, o
                mapa em tamanho real alargaria a página toda. */}
            <div
              ref={envolvente}
              style={{ height: altura * escala, width: "100%", overflow: "hidden" }}
            >
            <div
              ref={tela}
              className="relative"
              style={{
                width: largura,
                height: altura,
                transform: `scale(${escala})`,
                transformOrigin: "top left",
              }}
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
                const cor = corDaOcupacao(ocupacao, lugares);
                const med = medidas(m.forma, raio);
                return (
                  <div
                    key={m.id}
                    data-mesa={m.id}
                    className="absolute"
                    style={{ left: m.pos_x, top: m.pos_y, width: med.largura, height: med.altura }}
                  >
                    <Lugares
                      largura={med.largura}
                      altura={med.altura}
                      lugares={lugares}
                      ocupacao={ocupacao}
                      cor={cor}
                    />
                    <button
                      onPointerDown={(e) => {
                        // Medir a partir do invólucro, não do botão: o botão está
                        // encolhido lá dentro e a posição guardada é a do invólucro.
                        const alvo = (e.currentTarget as HTMLElement).closest("[data-mesa]");
                        if (!alvo) return;
                        const r = alvo.getBoundingClientRect();
                        arrastando.current = {
                          id: m.id,
                          dx: (e.clientX - r.left) / escala,
                          dy: (e.clientY - r.top) / escala,
                        };
                      }}
                      onClick={() => setSelecionada(activa ? null : m.id)}
                      className="absolute inset-[14px] flex flex-col items-center justify-center text-center transition-shadow"
                      style={{
                        borderRadius: med.cantos,
                        border: `2px solid ${excede ? "#B85C5C" : activa ? "var(--primary)" : "color-mix(in oklab, var(--gold) 55%, transparent)"}`,
                        background: activa
                          ? "color-mix(in oklab, var(--primary) 10%, var(--card))"
                          : "var(--card)",
                        boxShadow: activa ? "0 8px 24px -12px rgba(0,0,0,.35)" : "none",
                        cursor: "grab",
                        touchAction: "none",
                      }}
                    >
                      <span className="text-xs sm:text-sm font-medium leading-tight">{m.nome}</span>
                      <span className="text-[0.7rem] tabular-nums" style={{ color: cor }}>
                        {ocupacao} / {lugares}
                      </span>
                      {juntada && <Link2 className="w-3 h-3 mt-0.5 text-muted-foreground" />}
                    </button>
                  </div>
                );
              })}
            </div>
            </div>
          </div>
        )}

        {/* ---- painel lateral (ecrãs grandes) ---- */}
        <div className="hidden lg:block space-y-4 lg:sticky lg:top-4">
          {mesaSel ? (
            <DetalheMesa
              mesa={mesaSel}
              mesas={mesas}
              pessoas={naMesa(mesaSel.id)}
              onGuardarMesa={guardarMesa}
              onAjustarLugares={ajustarLugares}
              onApagarMesa={apagarMesa}
              onRemover={(id) => guardarConvidado(id, null)}
              onFechar={() => setSelecionada(null)}
            />
          ) : (
            <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
              Toca numa mesa para a editares.
            </p>
          )}
          {painelPorSentar}
        </div>
      </div>

      {/* As duas barras do fundo empilham num só contentor: fixas as duas em
          bottom-0, a de cima tapava a de baixo. */}
      {(mesaSel || falhas.length > 0) && (
        <>
          <div aria-hidden style={{ height: (mesaSel ? 76 : 0) + (falhas.length ? 64 : 0) }} />
          <div
            className="fixed inset-x-0 bottom-0 z-50 flex flex-col"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* O que não gravou fica à vista até se resolver, em vez de passar
                num toast que se perde enquanto se fala com outra pessoa. */}
            {falhas.length > 0 && (
              <div
                className="border-t px-4 py-3 flex items-center gap-3 justify-center sm:justify-end sm:px-8"
                style={{
                  background: "var(--card)",
                  borderColor: "color-mix(in oklab, #B85C5C 45%, transparent)",
                  boxShadow: "0 -8px 24px -16px rgba(0,0,0,.35)",
                }}
                role="status"
                aria-live="polite"
              >
                <p className="flex items-center gap-2 text-sm" style={{ color: "#B85C5C" }}>
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {falhas.length === 1
                    ? "1 alteração não ficou guardada."
                    : `${falhas.length} alterações não ficaram guardadas.`}
                </p>
                <Button size="sm" onClick={repetirFalhas} disabled={aRepetir}>
                  {aRepetir ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Tentar de novo
                </Button>
              </div>
            )}

            {mesaSel && (
              <div className="lg:hidden border-t bg-card px-4 py-3 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{mesaSel.nome}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {ocupacaoDoGrupo(mesaSel, mesas, convidados)} de{" "}
                    {lugaresDoGrupo(mesaSel, mesas)} lugares
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSelecionada(null)}>
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={() => setFolhaAberta(true)}>
                  <UserPlus className="w-4 h-4 mr-2" /> Sentar
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {aMover && (
        <Folha sempre titulo="Mudar de mesa" onFechar={() => setAMover(null)}>
          <p className="text-sm text-muted-foreground -mb-1">
            {aMover.nome} — escolhe a mesa de destino.
          </p>
          <ul className="rounded-xl border bg-card divide-y overflow-hidden">
            {mesas
              .filter((m) => m.id !== aMover.mesa_id)
              .map((m) => {
                const lug = lugaresDoGrupo(m, mesas);
                const oc = ocupacaoDoGrupo(m, mesas, convidados);
                const parceira = grupoDaMesa(m, mesas).find((x) => x.id !== m.id);
                return (
                  <li key={m.id}>
                    <button
                      className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
                      onClick={() => {
                        guardarConvidado(aMover.id, m.id);
                        setAMover(null);
                      }}
                    >
                      <span className="min-w-0">
                        <span className="block truncate">{m.nome}</span>
                        {parceira && (
                          <span className="block text-[0.7rem] text-muted-foreground truncate">
                            junta com {parceira.nome}
                          </span>
                        )}
                      </span>
                      <span
                        className="text-xs tabular-nums shrink-0"
                        style={{ color: corDaOcupacao(oc, lug) }}
                      >
                        {oc} / {lug}
                      </span>
                    </button>
                  </li>
                );
              })}
            <li>
              <button
                className="w-full text-left px-4 py-3"
                style={{ color: "#B85C5C" }}
                onClick={() => {
                  guardarConvidado(aMover.id, null);
                  setAMover(null);
                }}
              >
                Tirar das mesas
              </button>
            </li>
          </ul>
        </Folha>
      )}

      {folhaAberta && mesaSel && (
        <Folha titulo={mesaSel.nome} onFechar={() => setFolhaAberta(false)}>
          <DetalheMesa
            mesa={mesaSel}
            mesas={mesas}
            pessoas={naMesa(mesaSel.id)}
            onGuardarMesa={guardarMesa}
            onAjustarLugares={ajustarLugares}
            onApagarMesa={(m) => {
              setFolhaAberta(false);
              apagarMesa(m);
            }}
            onRemover={(id) => guardarConvidado(id, null)}
          />
          {painelPorSentar}
        </Folha>
      )}
    </div>
  );
}

/** Pontos à volta da mesa: um por lugar, cheios os que estão ocupados. */
function Lugares({
  largura,
  altura,
  lugares,
  ocupacao,
  cor,
}: {
  largura: number;
  altura: number;
  lugares: number;
  ocupacao: number;
  cor: string;
}) {
  if (lugares <= 0) return null;
  const tamanho = Math.min(largura, altura) < 120 ? 7 : 9;
  const rx = largura / 2 - 6;
  const ry = altura / 2 - 6;
  return (
    <>
      {Array.from({ length: lugares }).map((_, i) => {
        const angulo = (i / lugares) * 2 * Math.PI - Math.PI / 2;
        const ocupado = i < ocupacao;
        return (
          <span
            key={i}
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              left: largura / 2 + rx * Math.cos(angulo) - tamanho / 2,
              top: altura / 2 + ry * Math.sin(angulo) - tamanho / 2,
              width: tamanho,
              height: tamanho,
              borderRadius: "50%",
              background: ocupado ? cor : "var(--card)",
              border: `1px solid ${ocupado ? cor : "color-mix(in oklab, var(--gold) 45%, transparent)"}`,
            }}
          />
        );
      })}
    </>
  );
}

function BarraOcupacao({ ocupacao, lugares }: { ocupacao: number; lugares: number }) {
  const fracao = lugares > 0 ? Math.min(1, ocupacao / lugares) : 0;
  return (
    <div
      className="h-1 rounded-full mt-2 overflow-hidden"
      style={{ background: "color-mix(in oklab, var(--gold) 18%, transparent)" }}
    >
      <div
        className="h-full rounded-full transition-[width]"
        style={{ width: `${fracao * 100}%`, background: corDaOcupacao(ocupacao, lugares) }}
      />
    </div>
  );
}

/** Painel que sobe de baixo no telemóvel. */
function Folha({
  titulo,
  children,
  onFechar,
  sempre = false,
}: {
  titulo: string;
  children: React.ReactNode;
  onFechar: () => void;
  /** A folha de sentar é só para ecrãs pequenos; a de mudar de mesa serve todos. */
  sempre?: boolean;
}) {
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [onFechar]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-end ${sempre ? "" : "lg:hidden"}`}
    >
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onFechar}
        aria-label="Fechar"
        tabIndex={-1}
      />
      <div className="relative bg-background rounded-t-2xl max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <h3 className="font-medium truncate">{titulo}</h3>
          <Button size="sm" onClick={onFechar}>
            <Check className="w-4 h-4 mr-2" /> Concluído
          </Button>
        </div>
        <div className="overflow-auto p-4 space-y-4">{children}</div>
      </div>
    </div>
  );
}

function ListaPorSentar({
  pessoas,
  busca,
  setBusca,
  soConfirmados,
  setSoConfirmados,
  mesaSel,
  onSentar,
  onLargar,
}: {
  pessoas: Convidado[];
  busca: string;
  setBusca: (v: string) => void;
  soConfirmados: boolean;
  setSoConfirmados: (v: boolean) => void;
  mesaSel: Mesa | null;
  onSentar: (id: string) => void;
  onLargar: (id: string, destino: string | null, sobre: string | null) => void;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="font-medium mb-3">Por sentar ({pessoas.length})</h3>
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
        {pessoas.map((c) => (
          <li key={c.id}>
            <NomeArrastavel
              className="py-2"
              onLargarEm={(destino, sobre) => destino && onLargar(c.id, destino, sobre)}
            >
              {/* A linha toda serve de alvo: no telemóvel um ícone pequeno é
                  difícil de acertar. */}
              <button
                className="min-w-0 flex-1 text-left disabled:cursor-default"
                onClick={() => mesaSel && onSentar(c.id)}
                disabled={!mesaSel}
                title={mesaSel ? `Sentar na ${mesaSel.nome}` : "Escolhe primeiro uma mesa"}
              >
                <span className="block text-sm truncate">{c.nome}</span>
                <span className="block text-[0.7rem] text-muted-foreground truncate">
                  {c.grupo}
                  {porConfirmar(c) ? " · por confirmar" : ""}
                </span>
              </button>
              {mesaSel && (
                <span
                  aria-hidden
                  className="shrink-0 grid place-items-center rounded-md border w-8 h-8"
                >
                  <Plus className="w-4 h-4" />
                </span>
              )}
            </NomeArrastavel>
          </li>
        ))}
        {pessoas.length === 0 && (
          <li className="py-3 text-sm text-muted-foreground">Ninguém por sentar.</li>
        )}
      </ul>
    </div>
  );
}

function DetalheMesa({
  mesa,
  mesas,
  pessoas,
  onGuardarMesa,
  onAjustarLugares,
  onApagarMesa,
  onRemover,
  onFechar,
}: {
  mesa: Mesa;
  mesas: Mesa[];
  pessoas: Convidado[];
  onGuardarMesa: (id: string, campos: Partial<Mesa>) => void;
  onAjustarLugares: (id: string, delta: number) => void;
  onApagarMesa: (mesa: Mesa) => void;
  onRemover: (id: string) => void;
  onFechar?: () => void;
}) {
  const parceira = mesas.find((m) => m.id === mesa.juntada_com || m.juntada_com === mesa.id);
  const [nome, setNome] = useState(mesa.nome);

  // Trocar de mesa seleccionada tem de repor o campo do nome.
  useEffect(() => setNome(mesa.nome), [mesa.id, mesa.nome]);

  function guardarNome() {
    const limpo = nome.trim();
    if (!limpo || limpo === mesa.nome) {
      setNome(mesa.nome);
      return;
    }
    onGuardarMesa(mesa.id, { nome: limpo });
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onBlur={guardarNome}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          className="font-medium"
          aria-label="Nome da mesa"
        />
        {onFechar && (
          <Button size="sm" variant="ghost" onClick={onFechar} aria-label="Fechar">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <label className="text-xs text-muted-foreground w-full sm:w-auto">Lugares</label>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAjustarLugares(mesa.id, -1)}
            aria-label="Menos um lugar"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-10 text-center tabular-nums font-medium">{mesa.lugares}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAjustarLugares(mesa.id, 1)}
            aria-label="Mais um lugar"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {[10, 12].map((n) => (
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

      <div className="flex gap-2 mb-3">
        {["redonda", "oval", "comprida"].map((f) => (
          <Button
            key={f}
            size="sm"
            variant={mesa.forma === f ? "default" : "outline"}
            onClick={() => onGuardarMesa(mesa.id, { forma: f })}
          >
            {f === "redonda" ? "Redonda" : f === "oval" ? "Oval" : "Comprida"}
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
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemover(p.id)}
              aria-label={`Tirar ${p.nome} da mesa`}
            >
              <X className="w-4 h-4" />
            </Button>
          </li>
        ))}
        {pessoas.length === 0 && (
          <li className="py-3 text-sm text-muted-foreground">Mesa vazia.</li>
        )}
      </ul>

      <Button
        size="sm"
        variant="outline"
        className="w-full mt-3"
        style={{ color: "#B85C5C" }}
        onClick={() => onApagarMesa(mesa)}
      >
        <Trash2 className="w-4 h-4 mr-2" /> Apagar esta mesa
      </Button>
    </div>
  );
}

function Resumo({ rotulo, valor, alerta }: { rotulo: string; valor: number; alerta?: boolean }) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <p className="text-[0.7rem] text-muted-foreground leading-tight">{rotulo}</p>
      <p
        className="text-xl md:text-2xl font-medium mt-0.5 tabular-nums"
        style={alerta ? { color: "#B85C5C" } : undefined}
      >
        {valor}
      </p>
    </div>
  );
}
