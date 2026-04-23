import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export function FaqSection() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28 px-5 sm:px-6 scroll-mt-24" style={{ background: "var(--ivory)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2
            className="uppercase text-xl sm:text-2xl md:text-3xl"
            style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.3em", fontWeight: 500 }}
          >
            {t("faq.title")}
          </h2>
          <p
            className="italic mt-3 text-3xl sm:text-4xl"
            style={{ fontFamily: "Allura, 'Great Vibes', cursive", color: "var(--gold)", lineHeight: 1.1 }}
          >
            {t("faq.subtitle")}
          </p>
          <div className="divider-ornament mt-6 max-w-xs mx-auto">
            <HelpCircle className="w-4 h-4" strokeWidth={1.25} />
          </div>
        </div>

        <div className="mx-auto" style={{ maxWidth: 820 }}>
          {KEYS.map((k, i) => {
            const isOpen = open === i;
            return (
              <div
                key={k}
                style={{
                  background: "var(--cream)",
                  borderBottom: "1px solid color-mix(in oklab, var(--gold) 50%, transparent)",
                  borderRadius: 4,
                  marginBottom: 6,
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left gap-4 transition-colors"
                  style={{
                    padding: "20px 24px",
                    minHeight: 44,
                    fontFamily: "Cinzel, serif",
                    color: "var(--olive)",
                    fontSize: "1rem",
                    letterSpacing: "0.05em",
                    background: "transparent",
                  }}
                  aria-expanded={isOpen}
                >
                  <span>{t(`faq.q${k}` as never)}</span>
                  <ChevronDown
                    size={18}
                    strokeWidth={1.5}
                    style={{
                      color: "var(--gold)",
                      transition: "transform 0.3s ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                      flexShrink: 0,
                    }}
                  />
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.3s ease",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      style={{
                        padding: "0 24px 22px",
                        fontFamily: "Lato, sans-serif",
                        color: "var(--olive)",
                        fontSize: "0.95rem",
                        lineHeight: 1.7,
                      }}
                    >
                      {t(`faq.a${k}` as never)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
