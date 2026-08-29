import { Plane } from "lucide-react";

/**
 * A marca do casamento: monograma J&D à esquerda, e à direita os nomes e a
 * data separados por um traço tracejado com um avião — a "rota".
 *
 * Tudo dentro é dimensionado em `em`, por isso a marca inteira cresce e
 * encolhe com um único número (`base`). Assim o mesmo desenho serve o
 * cabeçalho, o rodapé e a página, sem cópias com medidas à parte.
 */
export function Marca({
  base = 16,
  cor = "clara",
  soMonograma = false,
  semData = false,
  className = "",
}: {
  /** Tamanho de referência em px. Tudo o resto é proporcional a este valor. */
  base?: number;
  /** "clara" para fundos claros; "escura" para o rodapé. */
  cor?: "clara" | "escura";
  /** Só o J&D, para onde não há largura (telemóvel). */
  soMonograma?: boolean;
  /** Sem a linha da data, para onde ela já apareça mesmo ao lado. */
  semData?: boolean;
  className?: string;
}) {
  // No verde do rodapé o dourado do site fica escuro de mais; ali usa-se um
  // dourado claro, que é o mesmo tom já usado lá para a data.
  const ouro = cor === "escura" ? "#D9B87C" : "var(--gold)";
  const nome = cor === "escura" ? "#F5EFE4" : "var(--olive)";
  const traco =
    cor === "escura"
      ? "color-mix(in oklab, #F5EFE4 45%, transparent)"
      : "color-mix(in oklab, var(--gold) 55%, transparent)";

  const monograma = (
    <span
      style={{
        fontFamily: "Cinzel, serif",
        fontWeight: 600,
        fontSize: "2.05em",
        color: ouro,
        lineHeight: 1,
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "baseline",
      }}
    >
      J
      <span
        style={{
          fontFamily: "Allura, 'Great Vibes', cursive",
          fontSize: "0.62em",
          margin: "0 0.06em",
          position: "relative",
          top: "-0.06em",
        }}
      >
        &amp;
      </span>
      D
    </span>
  );

  if (soMonograma) {
    return (
      <span
        className={className}
        style={{ fontSize: base, display: "inline-flex", alignItems: "center" }}
      >
        {monograma}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{ fontSize: base, display: "inline-flex", alignItems: "center", gap: "0.7em" }}
    >
      {monograma}

      <span
        aria-hidden
        style={{
          width: 1,
          alignSelf: "stretch",
          minHeight: "2.6em",
          background: traco,
        }}
      />

      <span style={{ display: "inline-flex", flexDirection: "column", gap: "0.18em" }}>
        <span
          style={{
            fontFamily: "Cinzel, serif",
            fontWeight: 500,
            fontSize: "0.92em",
            letterSpacing: "0.22em",
            color: nome,
            whiteSpace: "nowrap",
            lineHeight: 1.1,
          }}
        >
          JOANA &amp; DIOGO
        </span>

        {/* A rota: o traço tracejado e o avião no fim. */}
        <span aria-hidden style={{ display: "flex", alignItems: "center", gap: "0.35em" }}>
          <span
            style={{
              flex: 1,
              borderTop: `1px dashed ${traco}`,
            }}
          />
          <Plane
            size="0.78em"
            strokeWidth={1.25}
            style={{ color: ouro, flexShrink: 0, transform: "rotate(-10deg)" }}
          />
        </span>

        {!semData && (
          <span
            style={{
              fontFamily: "Cinzel, serif",
              fontWeight: 500,
              fontSize: "0.82em",
              letterSpacing: "0.22em",
              color: ouro,
              whiteSpace: "nowrap",
              lineHeight: 1.1,
            }}
          >
            19 SETEMBRO 2026
          </span>
        )}
      </span>
    </span>
  );
}
