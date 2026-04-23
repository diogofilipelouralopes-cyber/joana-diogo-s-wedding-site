import { useEffect, useRef, useState } from "react";
import { Heart, CalendarPlus } from "lucide-react";
import { Monogram } from "@/components/Monogram";

const TARGET = new Date("2026-09-19T14:00:00+01:00").getTime();

function downloadICS() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Joana & Diogo//Wedding//EN",
    "BEGIN:VEVENT",
    "UID:joana-diogo-2026@wedding",
    "DTSTAMP:20260101T000000Z",
    "DTSTART:20260919T130000Z",
    "DTEND:20260920T040000Z",
    "SUMMARY:Casamento Joana & Diogo",
    "LOCATION:Glicínia Wedding House, Freamunde, Portugal",
    "DESCRIPTION:Cerimónia às 14h00",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Joana-Diogo-2026.ics";
  link.click();
  URL.revokeObjectURL(url);
}

export function SaveTheDateSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const tick = () =>
      setDays(Math.max(0, Math.ceil((TARGET - Date.now()) / 86400000)));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="w-full px-6 py-28 sm:py-36" style={{ backgroundColor: "var(--cream)" }}>
      <div
        ref={ref}
        className={visible ? "std-card-in" : "std-card-hidden"}
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "60px",
          backgroundColor: "var(--ivory)",
          border: "1px solid var(--gold)",
          borderRadius: "12px",
          boxShadow:
            "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 18px 40px -22px color-mix(in oklab, var(--olive) 25%, transparent)",
          textAlign: "center",
        }}
      >
        {/* Monogram */}
        <div className="flex justify-center">
          <Monogram size={200} />
        </div>

        {/* 40px spacing */}
        <p
          className="uppercase"
          style={{
            marginTop: "40px",
            color: "var(--olive)",
            letterSpacing: "0.3em",
            fontSize: "1.1rem",
            fontFamily: "Cinzel, serif",
            fontWeight: 500,
          }}
        >
          Reserva Esta Data
        </p>

        {/* Filled heart separator */}
        <div className="flex justify-center my-5">
          <Heart
            size={16}
            strokeWidth={1}
            fill="var(--gold)"
            style={{ color: "var(--gold)" }}
          />
        </div>

        {/* Date */}
        <div className="flex flex-col items-center" style={{ fontFamily: "Cinzel, serif", lineHeight: 1 }}>
          <span style={{ fontSize: "4rem", color: "var(--gold)", fontWeight: 500 }}>19</span>
          <span
            className="uppercase mt-3"
            style={{
              fontSize: "1.5rem",
              color: "var(--olive)",
              letterSpacing: "0.4em",
              fontWeight: 500,
            }}
          >
            Setembro
          </span>
          <span
            className="mt-2"
            style={{
              fontSize: "1.5rem",
              color: "var(--olive)",
              letterSpacing: "0.2em",
              fontWeight: 500,
            }}
          >
            2026
          </span>
        </div>

        {/* Countdown */}
        <p
          className="uppercase mt-8"
          style={{
            color: "var(--olive)",
            letterSpacing: "0.25em",
            fontSize: "0.9rem",
            fontFamily: "Cinzel, serif",
            fontWeight: 500,
          }}
        >
          {days === null ? "—" : `Faltam ${days} dia${days === 1 ? "" : "s"}`}
        </p>

        {/* CTA */}
        <button
          onClick={downloadICS}
          className="inline-flex items-center gap-2 mt-8 px-8 py-4 uppercase transition-all hover:-translate-y-0.5"
          style={{
            background: "var(--gold)",
            color: "var(--ivory)",
            border: "none",
            borderRadius: "8px",
            fontFamily: "Cinzel, serif",
            fontSize: "0.85rem",
            letterSpacing: "0.25em",
            fontWeight: 500,
            boxShadow:
              "0 6px 18px -10px color-mix(in oklab, var(--gold) 70%, transparent)",
          }}
        >
          <CalendarPlus className="w-4 h-4" strokeWidth={1.5} />
          Adicionar ao Calendário
        </button>
      </div>
    </section>
  );
}
