import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const TARGET = new Date("2026-09-19T14:00:00+01:00").getTime();

function diff(now: number) {
  const d = Math.max(0, TARGET - now);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    mins: Math.floor((d / 60000) % 60),
    secs: Math.floor((d / 1000) % 60),
    over: d <= 0,
  };
}

export function HeroCountdown() {
  const { t } = useI18n();
  const [time, setTime] = useState(() => diff(Date.now()));

  useEffect(() => {
    setTime(diff(Date.now()));
    const id = setInterval(() => setTime(diff(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  if (time.over) {
    return (
      <div className="hero-countdown hero-text-anim-3" aria-live="polite">
        <span className="hero-countdown-over">{t("count.over")}</span>
      </div>
    );
  }

  const items = [
    { value: time.days, label: t("count.days") },
    { value: time.hours, label: t("count.hours") },
    { value: time.mins, label: t("count.mins") },
    { value: time.secs, label: t("count.secs") },
  ];

  return (
    <div className="hero-countdown hero-text-anim-3" aria-live="polite">
      {items.map((item) => (
        <div key={item.label} className="hero-countdown-item">
          <span suppressHydrationWarning className="hero-countdown-value">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="hero-countdown-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
