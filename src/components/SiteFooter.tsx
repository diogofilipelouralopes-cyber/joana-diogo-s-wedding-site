import { Plane, Heart, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";

function MonogramSimple({ size = 100 }: { size?: number }) {
  const initialsSize = `${size * 0.6}px`;
  const ampSize = `${size * 0.55}px`;
  return (
    <span
      aria-label="J&D"
      style={{
        fontFamily: "Cinzel, serif",
        fontSize: initialsSize,
        color: "var(--gold)",
        letterSpacing: "0.05em",
        fontWeight: 500,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "baseline",
        gap: "0.05em",
      }}
    >
      J
      <span
        style={{
          fontFamily: "Allura, 'Great Vibes', cursive",
          fontStyle: "italic",
          fontSize: ampSize,
          color: "var(--gold)",
          lineHeight: 1,
          transform: "translateY(0.1em)",
          display: "inline-block",
        }}
      >
        &amp;
      </span>
      D
    </span>
  );
}

function GoldDivider() {
  const iconStyle = {
    color: "var(--gold)",
    backgroundColor: "var(--olive-dark, #5C6A43)",
  } as const;

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="relative w-full max-w-md mx-auto"
      style={{ height: "40px", margin: "8px auto" }}
    >
      <div
        className="absolute left-0 right-0 top-1/2"
        style={{ borderTop: "1px dashed var(--gold)", opacity: 0.45 }}
      />
      <div className="absolute inset-0 flex items-center justify-center gap-6">
        <span className="inline-flex items-center justify-center" style={{ ...iconStyle, padding: "0 8px" }}>
          <Plane size={16} strokeWidth={1.25} />
        </span>
        <span className="inline-flex items-center justify-center" style={{ ...iconStyle, padding: "0 8px" }}>
          <Heart size={16} strokeWidth={1.25} />
        </span>
        <span className="inline-flex items-center justify-center" style={{ ...iconStyle, padding: "0 8px" }}>
          <MapPin size={16} strokeWidth={1.25} />
        </span>
      </div>
    </div>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer
      className="text-center px-5 sm:px-6"
      style={{
        backgroundColor: "#6B7A4F",
        color: "#F5EFE4",
        paddingTop: "64px",
        paddingBottom: "64px",
      }}
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-5 sm:gap-6">
        <MonogramSimple size={90} />

        <p
          className="italic text-xl sm:text-2xl"
          style={{
            fontFamily: "Allura, 'Great Vibes', cursive",
            color: "var(--gold)",
            lineHeight: 1,
          }}
        >
          {t("footer.tagline")}
        </p>

        <p
          className="uppercase text-base sm:text-xl"
          style={{
            fontFamily: "Cinzel, serif",
            color: "#F5EFE4",
            letterSpacing: "0.3em",
            fontWeight: 500,
          }}
        >
          Joana &amp; Diogo
        </p>

        <p
          className="text-sm sm:text-lg"
          style={{
            fontFamily: "Cinzel, serif",
            color: "var(--gold)",
            letterSpacing: "0.3em",
          }}
        >
          19 · 09 · 2026
        </p>

        <GoldDivider />

        <p
          className="italic text-xs sm:text-sm"
          style={{
            fontFamily: "Lato, sans-serif",
            color: "#F5EFE4",
            opacity: 0.85,
          }}
        >
          {t("footer.made")}
        </p>
      </div>
    </footer>
  );
}
