import { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

const photos = [g1, g2, g3, g4, g5, g6];

export function GallerySection() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? null : (i + 1) % photos.length));
      if (e.key === "ArrowLeft")
        setOpen((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section id="gallery" className="py-28 sm:py-40 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
            {t("gallery.kicker")}
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-primary">{t("gallery.title")}</h2>
          <div className="divider-ornament mt-6 max-w-xs mx-auto">
            <Heart className="w-3 h-3" strokeWidth={1} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {photos.map((src, i) => (
            <button
              key={i}
              onClick={() => setOpen(i)}
              className="group relative overflow-hidden aspect-square focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`${t("gallery.open")} ${i + 1}`}
            >
              <img
                src={src}
                alt={`${t("gallery.photo")} ${i + 1}`}
                loading="lazy"
                width={1024}
                height={1024}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(null);
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            aria-label="Close"
          >
            <X className="w-7 h-7" />
          </button>
          <img
            src={photos[open]}
            alt={`${t("gallery.photo")} ${open + 1}`}
            className="max-h-[90vh] max-w-[95vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
