import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

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
  const [t, setT] = useState(() => diff(Date.now()));

  useEffect(() => {
    const id = setInterval(() => setT(diff(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="w-full px-6"
      style={{ backgroundColor: "var(--cream)", paddingTop: 80, paddingBottom: 80 }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="uppercase"
          style={{
            fontFamily: "Cinzel, serif",
            color: "var(--olive)",
            letterSpacing: "0.3em",
            fontSize: "1.5rem",
            fontWeight: 500,
          }}
        >
          A Contagem Começou
        </h2>

        <p
          className="italic mt-3"
          style={{
            fontFamily: "Allura, 'Great Vibes', cursive",
            color: "var(--gold)",
            fontSize: "2.25rem",
            lineHeight: 1.1,
          }}
        >
          para o nosso grande dia
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
            <Plane
              size={18}
              strokeWidth={1.25}
              style={{ color: "var(--gold)" }}
            />
          </span>
        </div>

        {t.over ? (
          <p
            className="mt-6"
            style={{
              fontFamily: "Cinzel, serif",
              color: "var(--gold)",
              letterSpacing: "0.25em",
              fontSize: "1.6rem",
              textTransform: "uppercase",
            }}
          >
            O dia chegou! 💍
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5 justify-items-center">
            <Card value={t.days} label="Dias" />
            <Card value={t.hours} label="Horas" />
            <Card value={t.mins} label="Minutos" />
            <Card value={t.secs} label="Segundos" />
          </div>
        )}
      </div>
    </section>
  );
}

function Card({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        width: 140,
        padding: 30,
        background: "var(--ivory)",
        border: "1px solid var(--gold)",
        borderRadius: 8,
        boxShadow:
          "0 1px 2px color-mix(in oklab, var(--olive) 6%, transparent), 0 10px 24px -18px color-mix(in oklab, var(--olive) 22%, transparent)",
      }}
    >
      <span
        style={{
          fontFamily: "Cinzel, serif",
          fontWeight: 700,
          color: "var(--gold)",
          fontSize: "3.5rem",
          lineHeight: 1,
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        className="uppercase mt-3"
        style={{
          fontFamily: "Cinzel, serif",
          color: "var(--olive)",
          letterSpacing: "0.2em",
          fontSize: "0.85rem",
        }}
      >
        {label}
      </span>
    </div>
  );
}
