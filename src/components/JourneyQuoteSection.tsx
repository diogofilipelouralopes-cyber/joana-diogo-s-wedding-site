import { Compass } from "lucide-react";

export function JourneyQuoteSection() {
  return (
    <section
      className="w-full px-6 text-center"
      style={{
        paddingTop: "120px",
        paddingBottom: "120px",
        backgroundColor: "var(--ivory)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <p
          className="uppercase"
          style={{
            color: "var(--olive)",
            letterSpacing: "0.25em",
            fontSize: "1.5rem",
            fontFamily: "Cinzel, serif",
            fontWeight: 500,
          }}
        >
          Juntos, em
        </p>

        <p
          className="italic mt-4"
          style={{
            color: "var(--gold)",
            fontFamily: "Allura, 'Great Vibes', cursive",
            fontSize: "3.5rem",
            lineHeight: 1.1,
          }}
        >
          cada destino da vida
        </p>

        {/* Dotted divider with compass */}
        <div className="flex items-center justify-center mt-10 mb-8">
          <span aria-hidden style={{ width: "90px", borderTop: "1px dashed var(--olive)" }} />
          <Compass
            className="mx-3"
            size={20}
            strokeWidth={1.25}
            style={{ color: "var(--olive)" }}
          />
          <span aria-hidden style={{ width: "90px", borderTop: "1px dashed var(--olive)" }} />
        </div>

        <p
          className="italic max-w-xl mx-auto"
          style={{
            color: "var(--olive)",
            fontFamily: "Lato, sans-serif",
            fontSize: "1rem",
            fontWeight: 300,
            lineHeight: 1.7,
          }}
        >
          “Não é apenas sobre o destino, mas sobre quem vai contigo.”
        </p>
      </div>
    </section>
  );
}
