import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const TARGET = new Date("2026-09-19T14:00:00+01:00").getTime();

function calc() {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown() {
  const { t } = useI18n();
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: t("count.days"), value: time.days },
    { label: t("count.hours"), value: time.hours },
    { label: t("count.mins"), value: time.minutes },
    { label: t("count.secs"), value: time.seconds },
  ];

  if (!mounted) return <div className="h-[110px]" aria-hidden />;

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md">
      {items.map((i) => (
        <div
          key={i.label}
          className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl py-3 sm:py-4 text-center shadow-sm"
        >
          <div className="font-display text-2xl sm:text-4xl text-primary tabular-nums leading-none">
            {String(i.value).padStart(2, "0")}
          </div>
          <div className="mt-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {i.label}
          </div>
        </div>
      ))}
    </div>
  );
}
