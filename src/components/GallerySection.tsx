import { useState } from "react";
import { Heart, ZoomIn } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useI18n } from "@/lib/i18n";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

const photos = [g1, g2, g3, g4, g5, g6];

// Varied row spans on a 12-row CSS grid → masonry feel
const spans = [22, 28, 18, 24, 20, 26];

export function GallerySection() {
  const { t } = useI18n();
  const [index, setIndex] = useState<number>(-1);

  return (
    <section id="gallery" className="py-28 sm:py-40 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
            {t("gallery.kicker")}
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-primary">
            {t("gallery.title")}
          </h2>
          <div className="divider-ornament mt-6 max-w-xs mx-auto">
            <Heart className="w-3 h-3" strokeWidth={1} />
          </div>
        </div>

        {/* Masonry-like grid with varied heights via grid-row span */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            gridAutoRows: "10px",
          }}
        >
          <style>{`
            @media (min-width: 640px) {
              #gallery .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            }
            @media (min-width: 1024px) {
              #gallery .gallery-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            }
          `}</style>
        </div>

        <div
          className="gallery-grid grid gap-4"
          style={{
            gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            gridAutoRows: "10px",
          }}
        >
          {photos.map((src, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
              style={{
                gridRow: `span ${spans[i % spans.length]}`,
                borderRadius: 8,
              }}
              aria-label={`${t("gallery.open")} ${i + 1}`}
            >
              <img
                src={src}
                alt={`${t("gallery.photo")} ${i + 1}`}
                loading="lazy"
                width={1024}
                height={1024}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Olive overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{
                  background: "color-mix(in oklab, var(--olive) 40%, transparent)",
                }}
              >
                <ZoomIn
                  size={36}
                  strokeWidth={1.25}
                  style={{ color: "var(--gold)" }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        open={index >= 0}
        index={Math.max(0, index)}
        close={() => setIndex(-1)}
        slides={photos.map((src, i) => ({
          src,
          alt: `${t("gallery.photo")} ${i + 1}`,
        }))}
        animation={{ fade: 350, swipe: 400 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: {
            backgroundColor: "color-mix(in oklab, var(--olive) 90%, transparent)",
          },
          icon: { color: "var(--gold)" },
          button: { filter: "none", color: "var(--gold)" },
        }}
        render={{
          slideFooter: ({ slide }) => {
            const i = photos.findIndex((p) => p === slide.src);
            return (
              <div
                className="absolute left-0 right-0 bottom-4 text-center pointer-events-none"
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "var(--gold)",
                  letterSpacing: "0.25em",
                  fontSize: "0.85rem",
                }}
              >
                {i + 1} / {photos.length}
              </div>
            );
          },
        }}
      />
    </section>
  );
}
