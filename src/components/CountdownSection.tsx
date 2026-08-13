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

export function CountdownSection() {
  const { t } = useI18n();
  const [time, setTime] = useState(() => diff(Date.now()));

  useEffect(() => {
    setTime(diff(Date.now()));
    const id = setInterval(() => setTime(diff(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="w-full px-5 sm:px-6"
      style={{ backgroundColor: "var(--cream)", paddingTop: 36, paddingBottom: 36 }}
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
        <div className="relative my-6 flex items-center justify-center max-w-sm mx-auto">
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
          <div className="mt-7 grid grid-cols-4 gap-2 sm:gap-3 justify-items-center">
            <Card value={time.days} label={t("count.days")} />
            <Card value={time.hours} label={t("count.hours")} />
            <Card value={time.mins} label={t("count.mins")} />
            <Card value={time.secs} label={t("count.secs")} />
          </div>
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
        maxWidth: 132,
        padding: "14px 6px",
        background: "var(--ivory)",
        border: "1px solid color-mix(in oklab, var(--gold) 45%, transparent)",
        borderRadius: 12,
        boxShadow:
          "0 1px 2px color-mix(in oklab, var(--olive) 4%, transparent), 0 10px 26px -24px color-mix(in oklab, var(--olive) 20%, transparent)",
      }}
    >
      <span
        suppressHydrationWarning
        className="text-[1.7rem] sm:text-3xl md:text-4xl"
        style={{
          fontFamily: "Cinzel, serif",
          fontWeight: 500,
          color: "var(--olive)",
          lineHeight: 1,
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        className="uppercase mt-2 text-[0.55rem] sm:text-[0.68rem] md:text-xs"
        style={{
          fontFamily: "Cinzel, serif",
          color: "color-mix(in oklab, var(--olive) 70%, transparent)",
          letterSpacing: "0.18em",
        }}
      >
        {label}
      </span>
    </div>
  );
}
