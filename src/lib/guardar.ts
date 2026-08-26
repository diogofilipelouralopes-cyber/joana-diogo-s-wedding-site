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

type Pendentes = Map<string, { tabela: string; id: string; campos: Record<string, unknown> }>;

export function useGuardar(aoGuardar?: () => void) {
  const [estado, setEstado] = useState<Estado>("limpo");
  const [quantas, setQuantas] = useState(0);
  const pendentes = useRef<Pendentes>(new Map());

  const marcar = useCallback((tabela: string, id: string, campos: Record<string, unknown>) => {
    const chave = `${tabela}:${id}`;
    const ja = pendentes.current.get(chave);
    pendentes.current.set(chave, { tabela, id, campos: { ...(ja?.campos ?? {}), ...campos } });
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
    document.addEventListener("visibilitychange", aoEsconder);
    window.addEventListener("pagehide", aoEsconder);
    window.addEventListener("beforeunload", aoSair);
    return () => {
      document.removeEventListener("visibilitychange", aoEsconder);
      window.removeEventListener("pagehide", aoEsconder);
      window.removeEventListener("beforeunload", aoSair);
    };
  }, [guardar]);

  return { estado, quantas, marcar, guardar, temPendentes: quantas > 0 };
}
