import { Plane } from "lucide-react";

interface MonogramProps {
  size?: number;
  className?: string;
  topText?: string;
  bottomText?: string;
}

/**
 * Circular monogram "J&D" — pure CSS + SVG text-on-path.
 * Double olive border, curved top/bottom text, gold initials, plane accents.
 */
export function Monogram({
  size = 320,
  className = "",
  topText = "JOANA  ✦  DIOGO",
  bottomText = "19  SETEMBRO  2026",
}: MonogramProps) {
  // Scale internal elements relative to base size 320
  const scale = size / 320;
  const planeSize = Math.max(10, Math.round(18 * scale));
  const initialsSize = `${4 * scale}rem`;
  const ampSize = `${3.6 * scale}rem`;
  const fontPx = Math.max(6, Math.round(13 * scale));
  const letterSpacing = Math.max(2, Math.round(4 * scale));

  return (
    <div
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label="Joana & Diogo · 19 Setembro 2026"
    >
      {/* SVG with double border + curved texts */}
      <svg
        viewBox="0 0 320 320"
        width={size}
        height={size}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <defs>
          {/* Top arc: text reads left-to-right along upper circle */}
          <path
            id={`mono-top-${size}`}
            d="M 40,160 A 120,120 0 0 1 280,160"
            fill="none"
          />
          {/* Bottom arc: text reads left-to-right along lower circle */}
          <path
            id={`mono-bottom-${size}`}
            d="M 50,160 A 110,110 0 0 0 270,160"
            fill="none"
          />
        </defs>

        {/* Outer circle */}
        <circle
          cx="160"
          cy="160"
          r="156"
          fill="none"
          stroke="var(--olive)"
          strokeWidth="2"
        />
        {/* Inner circle (double border) */}
        <circle
          cx="160"
          cy="160"
          r="146"
          fill="none"
          stroke="var(--olive)"
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Curved top text */}
        <text
          fill="var(--olive)"
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: `${fontPx}px`,
            letterSpacing: `${letterSpacing}px`,
            fontWeight: 500,
          }}
        >
          <textPath
            href={`#mono-top-${size}`}
            startOffset="50%"
            textAnchor="middle"
          >
            {topText}
          </textPath>
        </text>

        {/* Curved bottom text */}
        <text
          fill="var(--olive)"
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: `${fontPx}px`,
            letterSpacing: `${letterSpacing}px`,
            fontWeight: 500,
          }}
        >
          <textPath
            href={`#mono-bottom-${size}`}
            startOffset="50%"
            textAnchor="middle"
          >
            {bottomText}
          </textPath>
        </text>
      </svg>

      {/* Plane accents on the sides */}
      <Plane
        size={planeSize}
        strokeWidth={1.25}
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: `${6 * scale}px`, color: "var(--gold)", transform: "translateY(-50%) rotate(-90deg)" }}
        aria-hidden="true"
      />
      <Plane
        size={planeSize}
        strokeWidth={1.25}
        className="absolute top-1/2 -translate-y-1/2"
        style={{ right: `${6 * scale}px`, color: "var(--gold)", transform: "translateY(-50%) rotate(90deg)" }}
        aria-hidden="true"
      />

      {/* Centered initials "J&D" */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: initialsSize,
            color: "var(--gold)",
            letterSpacing: "0.05em",
            fontWeight: 500,
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "baseline",
            gap: `${0.15 * scale}rem`,
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
      </div>
    </div>
  );
}
