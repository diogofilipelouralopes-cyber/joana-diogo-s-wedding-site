import { useEffect, useState } from "react";
import { Plane } from "lucide-react";
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

// Mensagem dinâmica conforme se aproxima a data (bilingue PT/EN)
function dynamicMessage(days: number, over: boolean, lang: "pt" | "en"): string | null {
  if (over) return null; // a mensagem "É hoje" já é tratada pelo count.over
  const pt: Record<string, string> = {
    far: "",
    month: "Falta pouco mais de um mês 💛",
    twoWeeks: "Faltam apenas duas semanas!",
    week: "Falta só uma semana ✨",
    days: `Faltam apenas ${days} dias!`,
    threeDays: "Faltam 3 dias — quase lá!",
    tomorrow: "É amanhã! 🎉",
  };
  const en: Record<string, string> = {
    far: "",
    month: "Just over a month to go 💛",
    twoWeeks: "Only two weeks left!",
    week: "Just one week to go ✨",
    days: `Only ${days} days to go!`,
    threeDays: "3 days left — almost there!",
    tomorrow: "It's tomorrow! 🎉",
  };
  const dict = lang === "en" ? en : pt;
  let key = "far";
  if (days <= 0) key = "tomorrow";
  else if (days === 1) key = "tomorrow";
  else if (days <= 3) key = "threeDays";
  else if (days <= 7) key = "week";
  else if (days <= 14) key = "twoWeeks";
  else if (days <= 31) key = "days";
  else if (days <= 45) key = "month";
  else key = "far";
  return dict[key] || null;
}

export function CountdownSection() {
  const { t, lang } = useI18n();
  const [time, setTime] = useState(() => diff(Date.now()));

  useEffect(() => {
    setTime(diff(Date.now()));
    const id = setInterval(() => setTime(diff(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  const message = dynamicMessage(time.days, time.over, lang as "pt" | "en");

  return (
    <section
      className="w-full px-5 sm:px-6"
      style={{ backgroundColor: "var(--cream)", paddingTop: 64, paddingBottom: 64 }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="uppercase text-base sm:text-xl md:text-2xl"
          style={{
            fontFamily: "Cinzel, serif",
            color: "var(--olive)",
            letterSpacing: "0.3em",
            fontWeight: 500,
          }}
        >
          {t("count.title")}
        </h2>

        <p
          className="italic mt-3 text-2xl sm:text-3xl md:text-4xl"
          style={{
            fontFamily: "Allura, 'Great Vibes', cursive",
            color: "var(--gold)",
            lineHeight: 1.1,
          }}
        >
          {t("count.subtitle")}
        </p>

        {/* Decorative divider with plane */}
        <div className="relative my-8 flex items-center justify-center max-w-sm mx-auto">
          <span
            aria-hidden
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
            style={{ borderTop: "1px dashed var(--olive)", opacity: 0.4 }}
          />
          <span
            className="relative inline-flex items-center justify-center px-3"
            style={{ background: "var(--cream)" }}
          >
            <Plane size={18} strokeWidth={1.25} style={{ color: "var(--gold)" }} />
          </span>
        </div>

        {time.over ? (
          <p
            className="mt-6 uppercase text-lg sm:text-2xl"
            style={{
              fontFamily: "Cinzel, serif",
              color: "var(--gold)",
              letterSpacing: "0.25em",
            }}
          >
            {t("count.over")}
          </p>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 justify-items-center">
              <Card value={time.days} label={t("count.days")} />
              <Card value={time.hours} label={t("count.hours")} />
              <Card value={time.mins} label={t("count.mins")} />
              <Card value={time.secs} label={t("count.secs")} />
            </div>

            {message && (
              <p
                className="mt-8 text-lg sm:text-xl md:text-2xl"
                style={{
                  fontFamily: "Allura, 'Great Vibes', cursive",
                  color: "var(--olive)",
                  lineHeight: 1.2,
                }}
              >
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function Card({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{
        maxWidth: 140,
        padding: "20px 16px",
        background: "var(--ivory)",
        border: "1px solid var(--gold)",
        borderRadius: 8,
        boxShadow:
          "0 1px 2px color-mix(in oklab, var(--olive) 6%, transparent), 0 10px 24px -18px color-mix(in oklab, var(--olive) 22%, transparent)",
      }}
    >
      <span
        suppressHydrationWarning
        className="text-4xl sm:text-5xl md:text-6xl"
        style={{
          fontFamily: "Cinzel, serif",
          fontWeight: 700,
          color: "var(--gold)",
          lineHeight: 1,
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        className="uppercase mt-3 text-[0.7rem] sm:text-xs md:text-sm"
        style={{
          fontFamily: "Cinzel, serif",
          color: "var(--olive)",
          letterSpacing: "0.2em",
        }}
      >
        {label}
      </span>
    </div>
  );
}
