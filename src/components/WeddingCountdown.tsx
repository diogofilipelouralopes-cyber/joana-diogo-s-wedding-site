import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { downloadWeddingICS } from "@/lib/calendar";
import { compute, SECOND, MINUTE, type CountdownState } from "@/lib/countdown";

const pad = (n: number) => String(n).padStart(2, "0");

/** De quanto em quanto tempo a faixa troca entre a data e a contagem. */
const SWAP_EVERY = 5 * SECOND;

/**
 * Faixa fixa do topo: alterna entre a data e a contagem decrescente.
 *
 * Os dois textos ocupam a mesma célula de grelha, por isso a faixa tem sempre a
 * largura do mais comprido e a altura de uma linha — os ornamentos das pontas
 * não saltam quando o texto troca.
 *
 * Depois do casamento (fase "over") deixa de haver contagem e a data fica fixa.
 */
export function WeddingCountdown() {
  const { t } = useI18n();
  const [state, setState] = useState<CountdownState>(() => compute(Date.now()));
  const [showCount, setShowCount] = useState(false);

  useEffect(() => {
    const tick = () => setState(compute(Date.now()));
    tick();
    // Acabou: não há nada para atualizar, não se arma temporizador nenhum.
    if (state.phase === "over") return;
    // Um tique por segundo só na reta final; no resto do tempo basta ao minuto.
    const period = state.phase === "clock" ? SECOND : MINUTE;
    const id = setInterval(tick, period);
    return () => clearInterval(id);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === "over") return;
    const id = setInterval(() => setShowCount((v) => !v), SWAP_EVERY);
    return () => clearInterval(id);
  }, [state.phase]);

  // Sem contagem: a data fica sozinha, sem alternância.
  if (state.phase === "over") return <WeddingDateButton />;

  return (
    <span className="header-swap">
      <WeddingDateButton hidden={showCount} />
      <CountdownText state={state} t={t} hidden={!showCount} />
    </span>
  );
}

function CountdownText({
  state,
  t,
  hidden,
}: {
  state: CountdownState;
  t: (k: string) => string;
  hidden: boolean;
}) {
  const common = {
    "aria-hidden": hidden,
    "data-hidden": hidden,
  } as const;

  if (state.phase === "today") {
    return (
      <span className="header-date-label header-count-today" {...common}>
        {t("count.today")}
      </span>
    );
  }

  if (state.phase === "clock") {
    // Unidades curtas numa só linha: "d h m s" lê-se igual em português e inglês,
    // e a faixa mantém a altura de uma linha de texto.
    const relogio =
      `${pad(state.days)}d : ${pad(state.hours)}h : ` + `${pad(state.mins)}m : ${pad(state.secs)}s`;
    return (
      <span suppressHydrationWarning className="header-date-label header-count-clock" {...common}>
        {relogio}
      </span>
    );
  }

  return (
    <span className="header-date-label" {...common}>
      {t("count.daysLeft")} <span suppressHydrationWarning>{state.days}</span>{" "}
      {state.days === 1 ? t("count.day") : t("count.days")}
    </span>
  );
}

/** A data com o atalho para o calendário. */
export function WeddingDateButton({
  className = "",
  hidden = false,
}: {
  className?: string;
  hidden?: boolean;
}) {
  const { lang } = useI18n();
  const label = lang === "en" ? "Add to calendar" : "Adicionar ao calendário";
  return (
    <button
      type="button"
      onClick={downloadWeddingICS}
      className={`header-date-label header-date-btn ${className}`}
      title={label}
      aria-label={label}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      data-hidden={hidden}
    >
      {lang === "en" ? "September 19, 2026" : "19 de Setembro de 2026"}
    </button>
  );
}
