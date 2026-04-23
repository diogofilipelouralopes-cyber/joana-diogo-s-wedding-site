import { Plane, Heart, MapPin } from "lucide-react";

/**
 * Simplified J&D monogram (no circle) used in the footer.
 */
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

/**
 * Gold variant of the DecorativeDivider for use on the dark olive footer.
 */
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
        <span
          className="inline-flex items-center justify-center"
          style={{ ...iconStyle, padding: "0 8px" }}
        >
          <Plane size={16} strokeWidth={1.25} />
        </span>
        <span
          className="inline-flex items-center justify-center"
          style={{ ...iconStyle, padding: "0 8px" }}
        >
          <Heart size={16} strokeWidth={1.25} />
        </span>
        <span
          className="inline-flex items-center justify-center"
          style={{ ...iconStyle, padding: "0 8px" }}
        >
          <MapPin size={16} strokeWidth={1.25} />
        </span>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer
      className="text-center px-6"
      style={{
        backgroundColor: "#6B7A4F",
        color: "#F5EFE4",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
        <MonogramSimple size={100} />

        <p
          className="italic"
          style={{
            fontFamily: "Allura, 'Great Vibes', cursive",
            color: "var(--gold)",
            fontSize: "1.5rem",
            lineHeight: 1,
          }}
        >
          Com amor,
        </p>

        <p
          className="uppercase"
          style={{
            fontFamily: "Cinzel, serif",
            color: "#F5EFE4",
            letterSpacing: "0.3em",
            fontSize: "1.3rem",
            fontWeight: 500,
          }}
        >
          Joana &amp; Diogo
        </p>

        <p
          style={{
            fontFamily: "Cinzel, serif",
            color: "var(--gold)",
            letterSpacing: "0.3em",
            fontSize: "1.1rem",
          }}
        >
          19 · 09 · 2026
        </p>

        <GoldDivider />

        <p
          className="italic"
          style={{
            fontFamily: "Lato, sans-serif",
            color: "#F5EFE4",
            opacity: 0.85,
            fontSize: "0.9rem",
          }}
        >
          Feito com <span style={{ color: "var(--gold)" }}>♡</span> para a nossa maior viagem
        </p>
      </div>
    </footer>
  );
}
