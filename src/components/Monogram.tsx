interface MonogramProps {
  size?: number;
  className?: string;
  topText?: string;
  bottomText?: string;
}

/**
 * Vintage-stamp circular monogram "J&D" rendered entirely in SVG so all
 * proportions remain pixel-perfect at every size (60 / 100 / 200 / 320).
 *
 * - Double concentric olive rings (4px apart on the 320 viewBox)
 * - Curved top text ("JOANA & DIOGO") with small Plane glyphs at start/end
 * - Curved bottom text ("19 SETEMBRO 2026")
 * - MapPin glyphs at 9h and 3h on the inner ring
 * - Centered "J&D" — Cinzel bold gold, with a smaller italic script "&"
 */
export function Monogram({
  size = 320,
  className = "",
  topText = "JOANA  &  DIOGO",
  bottomText = "19  SETEMBRO  2026",
}: MonogramProps) {
  // Unique IDs so multiple monograms on one page don't collide
  const uid = `mono-${size}`;

  return (
    <svg
      viewBox="0 0 320 320"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      role="img"
      aria-label="Joana & Diogo · 19 Setembro 2026"
    >
      <defs>
        {/* Top arc — slight inset so text sits inside the inner ring */}
        <path
          id={`${uid}-top`}
          d="M 50,160 A 110,110 0 0 1 270,160"
          fill="none"
        />
        {/* Bottom arc — drawn so text reads left-to-right along the bottom */}
        <path
          id={`${uid}-bottom`}
          d="M 56,160 A 104,104 0 0 0 264,160"
          fill="none"
        />
      </defs>

      {/* Outer ring */}
      <circle
        cx="160"
        cy="160"
        r="156"
        fill="none"
        stroke="#6B7A4F"
        strokeWidth="1.25"
      />
      {/* Inner ring (4px gap on the 320 viewBox) */}
      <circle
        cx="160"
        cy="160"
        r="152"
        fill="none"
        stroke="#6B7A4F"
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Curved top text */}
      <text
        fill="#6B7A4F"
        style={{
          fontFamily: "Cinzel, serif",
          fontSize: "14.4px", // ~0.9rem on a 320 base
          letterSpacing: "4.32px", // ~0.3em
          fontWeight: 500,
        }}
      >
        <textPath href={`#${uid}-top`} startOffset="50%" textAnchor="middle">
          {topText}
        </textPath>
      </text>

      {/* Curved bottom text */}
      <text
        fill="#6B7A4F"
        style={{
          fontFamily: "Cinzel, serif",
          fontSize: "12px", // ~0.75rem
          letterSpacing: "3px", // ~0.25em
          fontWeight: 500,
        }}
      >
        <textPath href={`#${uid}-bottom`} startOffset="50%" textAnchor="middle">
          {bottomText}
        </textPath>
      </text>

      {/* Plane glyphs flanking the curved top text (start and end of arc) */}
      {/* Lucide Plane path, scaled and translated so the icon sits on the arc */}
      <PlaneGlyph x={56} y={104} rotate={-58} />
      <PlaneGlyph x={264} y={104} rotate={58} />

      {/* MapPin glyphs at 9h and 3h on the inner ring */}
      <MapPinGlyph x={14} y={160} />
      <MapPinGlyph x={306} y={160} />

      {/* Centered initials: J  &  D */}
      <text
        x="160"
        y="180"
        textAnchor="middle"
        fill="#B8935A"
        style={{
          fontFamily: "Cinzel, serif",
          fontSize: "72px",
          fontWeight: 700,
          letterSpacing: "2px",
        }}
      >
        <tspan>J</tspan>
        <tspan
          dx="2"
          dy="-10"
          style={{
            fontFamily: "Allura, 'Great Vibes', cursive",
            fontStyle: "italic",
            fontSize: "52px",
            fontWeight: 400,
          }}
        >
          &amp;
        </tspan>
        <tspan dx="2" dy="10">
          D
        </tspan>
      </text>
    </svg>
  );
}

/**
 * Tiny inline Plane glyph (Lucide path) sized for the 320 viewBox.
 * Centered on (x, y), rotated by `rotate` degrees, gold stroke.
 */
function PlaneGlyph({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  // Lucide "plane" path is in a 24x24 viewBox; scale ~0.6 → ~14px.
  const scale = 0.6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale}) translate(-12 -12)`}>
      <path
        d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
        fill="none"
        stroke="#B8935A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/**
 * Tiny inline MapPin glyph (Lucide path) sized for the 320 viewBox.
 */
function MapPinGlyph({ x, y }: { x: number; y: number }) {
  const scale = 0.55;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) translate(-12 -12)`}>
      <path
        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
        fill="none"
        stroke="#6B7A4F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="10"
        r="3"
        fill="none"
        stroke="#6B7A4F"
        strokeWidth="1.5"
      />
    </g>
  );
}
