import { useEffect, useRef, useState } from "react";
import { Heart, CalendarPlus } from "lucide-react";
import { Monogram } from "@/components/Monogram";
import { downloadWeddingICS } from "@/lib/calendar";
import { useI18n } from "@/lib/i18n";

const TARGET = new Date("2026-09-19T14:00:00+01:00").getTime();

export function SaveTheDateSection() {
  const { t } = useI18n();
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

  const daysLabel =
    days === null
      ? "—"
      : t("std.daysLeft")
        ? `${t("std.daysLeft")} ${days} ${days === 1 ? t("std.day") : t("std.days")}`
        : `${days} ${days === 1 ? t("std.day") : t("std.days")}`;

  return (
    <section className="w-full px-5 sm:px-6 py-20 sm:py-28 md:py-36" style={{ backgroundColor: "var(--cream)" }}>
      <div
        ref={ref}
        className={visible ? "std-card-in" : "std-card-hidden"}
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "40px 24px",
          backgroundColor: "var(--ivory)",
          border: "1px solid var(--gold)",
          borderRadius: "12px",
          boxShadow:
            "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 18px 40px -22px color-mix(in oklab, var(--olive) 25%, transparent)",
          textAlign: "center",
        }}
      >
        <div className="flex justify-center" aria-hidden="true">
          <span className="inline-flex sm:hidden">
            <Monogram size={150} />
          </span>
          <span className="hidden sm:inline-flex">
            <Monogram size={200} />
          </span>
        </div>

        <p
          className="uppercase mt-8 sm:mt-10 text-sm sm:text-base"
          style={{
            color: "var(--olive)",
            letterSpacing: "0.3em",
            fontFamily: "Cinzel, serif",
            fontWeight: 500,
          }}
        >
          {t("std.title")}
        </p>

        <div className="flex justify-center my-4 sm:my-5">
          <Heart size={16} strokeWidth={1} fill="var(--gold)" style={{ color: "var(--gold)" }} />
        </div>

        <div className="flex flex-col items-center" style={{ fontFamily: "Cinzel, serif", lineHeight: 1 }}>
          <span className="text-5xl sm:text-6xl" style={{ color: "var(--gold)", fontWeight: 500 }}>
            19
          </span>
          <span
            className="uppercase mt-3 text-lg sm:text-2xl"
            style={{ color: "var(--olive)", letterSpacing: "0.4em", fontWeight: 500 }}
          >
            {t("std.month")}
          </span>
          <span
            className="mt-2 text-lg sm:text-2xl"
            style={{ color: "var(--olive)", letterSpacing: "0.2em", fontWeight: 500 }}
          >
            2026
          </span>
        </div>

        <p
          className="uppercase mt-6 sm:mt-8 text-xs sm:text-sm"
          style={{
            color: "var(--olive)",
            letterSpacing: "0.25em",
            fontFamily: "Cinzel, serif",
            fontWeight: 500,
          }}
        >
          {daysLabel}
        </p>

        <button
          onClick={downloadWeddingICS}
          className="inline-flex items-center gap-2 mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 uppercase transition-all hover:-translate-y-0.5"
          style={{
            background: "var(--gold)",
            color: "var(--ivory)",
            border: "none",
            borderRadius: "8px",
            fontFamily: "Cinzel, serif",
            fontSize: "0.8rem",
            letterSpacing: "0.25em",
            fontWeight: 500,
            minHeight: 44,
            boxShadow: "0 6px 18px -10px color-mix(in oklab, var(--gold) 70%, transparent)",
          }}
        >
          <CalendarPlus className="w-4 h-4" strokeWidth={1.5} />
          {t("hero.cal")}
        </button>
      </div>
    </section>
  );
}
