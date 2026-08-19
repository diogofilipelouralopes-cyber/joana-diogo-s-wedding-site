import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

// Contagem em dias completos: recomeça à meia-noite do dia atual.
// O "grande dia" é 19 de setembro de 2026; a contagem termina quando
// o calendário muda para essa data (meia-noite), não à hora do evento.
const TARGET = new Date("2026-09-19T00:00:00+01:00").getTime();
const MS_PER_DAY = 86_400_000;

function midnightTimestamp(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function diffDays(now: number) {
  const todayMidnight = midnightTimestamp(new Date(now));
  const targetMidnight = midnightTimestamp(new Date(TARGET));
  const days = Math.round((targetMidnight - todayMidnight) / MS_PER_DAY);
  return {
    days: Math.max(0, days),
    isToday: days <= 0,
  };
}

export function HeroCountdown() {
  const { t } = useI18n();
  const [state, setState] = useState(() => diffDays(Date.now()));

  useEffect(() => {
    setState(diffDays(Date.now()));
    // Atualiza a cada minuto; a mudança de dia acontece naturalmente à meia-noite.
    const id = setInterval(() => setState(diffDays(Date.now())), 60_000);
    return () => clearInterval(id);
  }, []);

  if (state.isToday) {
    return (
      <div className="hero-countdown hero-countdown-today hero-text-anim-3" aria-live="polite">
        <span className="hero-countdown-today-text">{t("count.today")}</span>
      </div>
    );
  }

  return (
    <div className="hero-countdown hero-countdown-days hero-text-anim-3" aria-live="polite">
      <span className="hero-countdown-lead">{t("count.daysLeft")}</span>
      <span suppressHydrationWarning className="hero-countdown-value">
        {state.days}
      </span>
      <span className="hero-countdown-label">
        {state.days === 1 ? t("count.day") : t("count.days")}
      </span>
    </div>
  );
}
