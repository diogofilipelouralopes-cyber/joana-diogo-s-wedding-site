import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Alterações por guardar.
 *
 * O que se escreve fica em espera até se carregar em «Guardar». Como no iPad
 * trocar de aplicação não dá aviso nenhum ao browser, guarda-se também
 * automaticamente quando a página deixa de estar à vista — é a rede de
 * segurança para o caso de a pessoa sair sem carregar no botão.
 */

export type Estado = "limpo" | "pendente" | "a-guardar" | "guardado" | "erro";

type Pendente = { tabela: string; id: string; campos: Record<string, unknown> };
type Pendentes = Map<string, Pendente>;

/**
 * A fila também fica no armazenamento do browser.
 *
 * O Safari do iPad descarta páginas em segundo plano com facilidade: bastava
 * mudar de aplicação um bocado para as alterações por guardar, que só viviam
 * em memória, desaparecerem sem deixar rasto. Assim sobrevivem a fechar o
 * Safari e a reiniciar o iPad.
 */
const CHAVE = "painel-por-guardar";
/** Passado um dia, é mais provável estar velho do que ser útil. */
const VALIDADE = 24 * 60 * 60 * 1000;

function ler(): Pendentes {
  if (typeof window === "undefined") return new Map();
  try {
    const cru = window.localStorage.getItem(CHAVE);
    if (!cru) return new Map();
    const { ts, itens } = JSON.parse(cru) as { ts: number; itens: [string, Pendente][] };
    if (!Array.isArray(itens) || Date.now() - ts > VALIDADE) {
      window.localStorage.removeItem(CHAVE);
      return new Map();
    }
    return new Map(itens);
  } catch {
    return new Map();
  }
}

function escrever(p: Pendentes) {
  if (typeof window === "undefined") return;
  try {
    if (p.size === 0) window.localStorage.removeItem(CHAVE);
    else window.localStorage.setItem(CHAVE, JSON.stringify({ ts: Date.now(), itens: [...p] }));
  } catch {
    // Sem espaço ou em navegação privada: a fila em memória continua a valer.
  }
}

export function useGuardar(aoGuardar?: () => void) {
  const [estado, setEstado] = useState<Estado>("limpo");
  const [quantas, setQuantas] = useState(0);
  const pendentes = useRef<Pendentes>(new Map());

  // Recuperar o que ficou por guardar de uma sessão anterior.
  useEffect(() => {
    const guardadas = ler();
    if (guardadas.size === 0) return;
    guardadas.forEach((v, k) => pendentes.current.set(k, v));
    setQuantas(pendentes.current.size);
    setEstado("pendente");
  }, []);

  const marcar = useCallback((tabela: string, id: string, campos: Record<string, unknown>) => {
    const chave = `${tabela}:${id}`;
    const ja = pendentes.current.get(chave);
    pendentes.current.set(chave, { tabela, id, campos: { ...(ja?.campos ?? {}), ...campos } });
    escrever(pendentes.current);
    setQuantas(pendentes.current.size);
    setEstado("pendente");
  }, []);

  const guardar = useCallback(async () => {
    if (pendentes.current.size === 0) return true;
    setEstado("a-guardar");
    const lista = [...pendentes.current.values()];
    const falhas: string[] = [];
    for (const p of lista) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from(p.tabela as any) as any)
        .update(p.campos)
        .eq("id", p.id);
      if (error) falhas.push(p.id);
      else pendentes.current.delete(`${p.tabela}:${p.id}`);
    }
    escrever(pendentes.current);
    setQuantas(pendentes.current.size);
    if (falhas.length) {
      setEstado("erro");
      return false;
    }
    setEstado("guardado");
    aoGuardar?.();
    setTimeout(() => setEstado((e) => (e === "guardado" ? "limpo" : e)), 2500);
    return true;
  }, [aoGuardar]);

  // Rede de segurança: guardar quando a página sai de vista (trocar de app,
  // bloquear o iPad, fechar o separador) e avisar em quem sai pelo browser.
  useEffect(() => {
    const aoEsconder = () => {
      if (document.visibilityState === "hidden" && pendentes.current.size > 0) void guardar();
    };
    const aoSair = (e: BeforeUnloadEvent) => {
      if (pendentes.current.size > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    // Quando a rede volta, tentar sozinho — é o que o aviso promete.
    const aoVoltarARede = () => {
      if (pendentes.current.size > 0) void guardar();
    };
    document.addEventListener("visibilitychange", aoEsconder);
    window.addEventListener("pagehide", aoEsconder);
    window.addEventListener("beforeunload", aoSair);
    window.addEventListener("online", aoVoltarARede);
    return () => {
      document.removeEventListener("visibilitychange", aoEsconder);
      window.removeEventListener("pagehide", aoEsconder);
      window.removeEventListener("beforeunload", aoSair);
      window.removeEventListener("online", aoVoltarARede);
    };
  }, [guardar]);

  // Trocar de separador no painel desmonta a secção: enviar o que está em
  // espera antes de desaparecer, sem depender do estado do componente.
  useEffect(() => {
    const fila = pendentes.current;
    return () => {
      if (fila.size === 0) return;
      void (async () => {
        for (const p of [...fila.values()]) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error } = await (supabase.from(p.tabela as any) as any)
            .update(p.campos)
            .eq("id", p.id);
          if (!error) fila.delete(`${p.tabela}:${p.id}`);
        }
        escrever(fila);
      })();
    };
  }, []);

  return { estado, quantas, marcar, guardar, temPendentes: quantas > 0 };
}

