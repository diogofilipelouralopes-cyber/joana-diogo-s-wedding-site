import { Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Monogram } from "@/components/Monogram";

export function ThankYouSection() {
  const { lang } = useI18n();

  return (
    <section
      className="py-20 sm:py-28 px-5 sm:px-6"
      style={{ background: "var(--ivory)" }}
    >
      <div className="max-w-lg mx-auto text-center">
        <h2
          className="uppercase text-2xl sm:text-3xl md:text-4xl"
          style={{
            fontFamily: "Cinzel, serif",
            color: "var(--olive)",
            letterSpacing: "0.35em",
            fontWeight: 500,
          }}
        >
          {lang === "en" ? "Thank You" : "Obrigado"}
        </h2>

        <p
          className="italic mt-4 text-3xl sm:text-4xl md:text-5xl"
          style={{
            fontFamily: "Allura, 'Great Vibes', cursive",
            color: "var(--gold)",
            lineHeight: 1.2,
          }}
        >
          {lang === "en"
            ? "for being part of our day"
            : "por fazerem parte do nosso dia"}
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-8 max-w-xs mx-auto">
          <span style={{ flex: 1, borderTop: "1px solid color-mix(in oklab, var(--gold) 35%, transparent)" }} />
          <Heart
            size={14}
            strokeWidth={1.25}
            style={{ color: "var(--gold)", flexShrink: 0 }}
          />
          <span style={{ flex: 1, borderTop: "1px solid color-mix(in oklab, var(--gold) 35%, transparent)" }} />
        </div>

        <div className="flex justify-center" style={{ opacity: 0.75 }}>
          <Monogram size={48} />
        </div>
      </div>
    </section>
  );
}
