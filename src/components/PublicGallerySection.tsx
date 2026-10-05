import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Camera, X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { casamentoJaFoi } from "@/lib/fase-do-site";

const BUCKET = "wedding-photos";

type Album = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_published: boolean;
};

type Photo = {
  id: string;
  album_id: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
};

export function PublicGallerySection() {
  const { t, lang } = useI18n();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Carregar álbuns publicados + as suas fotos
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);

      const { data: albumData } = await supabase
        .from("wedding_albums")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (!active) return;
      const pubAlbums = (albumData ?? []) as Album[];
      setAlbums(pubAlbums);

      if (pubAlbums.length === 0) {
        setLoading(false);
        return;
      }

      const albumIds = pubAlbums.map((a) => a.id);
      const { data: photoData } = await supabase
        .from("wedding_photos")
        .select("*")
        .in("album_id", albumIds)
        .order("sort_order", { ascending: true });

      if (!active) return;
      const list = (photoData ?? []) as Photo[];
      setPhotos(list);

      // Gerar signed URLs em lote (bucket é privado neste workspace)
      if (list.length > 0) {
        const paths = list.map((p) => p.storage_path);
        const { data: signed } = await supabase.storage
          .from(BUCKET)
          .createSignedUrls(paths, 3600);
        const map: Record<string, string> = {};
        signed?.forEach((s, i) => {
          if (s.signedUrl) map[list[i].id] = s.signedUrl;
        });
        if (active) setUrls(map);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );
  const next = useCallback(
    () => setLightbox((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  );

  // Deslizar (swipe) no telemóvel
  const touchX = useRef<number | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchX.current;
      touchX.current = null;
      if (start === null) return;
      const delta = (e.changedTouches[0]?.clientX ?? start) - start;
      if (Math.abs(delta) < 45) return;
      if (delta < 0) next();
      else prev();
    },
    [next, prev],
  );


  // Teclado no lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.body.classList.add("lightbox-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.body.classList.remove("lightbox-open");
    };
  }, [lightbox, closeLightbox, prev, next]);

  // Antes do casamento ainda não há álbuns publicados: mostra o aviso de "em breve".
  // Assim que o primeiro álbum for publicado, este bloco desaparece sozinho e
  // dá lugar à galeria a sério — não é preciso remover nada à mão.
  if (!loading && albums.length === 0) {
    return (
      <section
        id="galeria"
        className="section section-cream">
        <div className="max-w-md mx-auto text-center">
          <h2
            className="uppercase text-base sm:text-xl"
            style={{
              fontFamily: "Cinzel, serif",
              color: "var(--olive)",
              letterSpacing: "0.25em",
              fontWeight: 500,
            }}
          >
            {lang === "en" ? "Our Gallery" : "A Nossa Galeria"}
          </h2>

          <div
            className="mt-4 sm:mt-6 px-5 py-6 sm:py-8"
            style={{
              background: "var(--ivory)",
              border: "1px dashed var(--gold)",
              borderRadius: "var(--card-radius)",
            }}
          >
            <Camera
              className="mx-auto w-6 h-6"
              strokeWidth={1.25}
              style={{ color: "var(--olive)", opacity: 0.7 }}
            />
            <p
              className="italic mt-2 text-2xl sm:text-3xl"
              style={{
                fontFamily: "Allura, 'Great Vibes', cursive",
                color: "var(--gold)",
                lineHeight: 1.1,
              }}
            >
              {lang === "en" ? "coming soon" : "em breve"}
            </p>
            <p className="mt-2 text-xs sm:text-sm" style={{ color: "var(--olive)", opacity: 0.8 }}>
              {casamentoJaFoi()
                ? lang === "en"
                  ? "We are choosing our favourite photos of the day. They will be here very soon."
                  : "Estamos a escolher as nossas fotografias preferidas do dia. Ficam aqui muito em breve."
                : lang === "en"
                  ? "After the wedding, our favourite photos will be here."
                  : "Depois do casamento, as nossas fotografias preferidas ficam aqui."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const title = lang === "en" ? "Our Gallery" : "A Nossa Galeria";
  const subtitle = lang === "en" ? "moments we want to share" : "momentos que queremos partilhar";

  return (
    <section id="galeria" className="section section-cream">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-7 sm:mb-10">
          <h2
            className="uppercase text-xl sm:text-2xl md:text-3xl"
            style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.3em", fontWeight: 500 }}
          >
            {title}
          </h2>
          <p
            className="italic mt-3 text-3xl sm:text-4xl"
            style={{ fontFamily: "Allura, 'Great Vibes', cursive", color: "var(--gold)", lineHeight: 1.1 }}
          >
            {subtitle}
          </p>
          <div className="divider-ornament mt-6 max-w-xs mx-auto">
            <Camera className="w-4 h-4" strokeWidth={1.25} />
          </div>
          {!loading && photos.length > 0 && (
            <p
              className="mt-4 text-[11px] sm:text-xs uppercase"
              style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", opacity: 0.65, letterSpacing: "0.22em" }}
            >
              {photos.length} {lang === "en" ? "photos" : "fotografias"}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-10" style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.1em" }}>
            {lang === "en" ? "Loading photos…" : "A carregar fotos…"}
          </div>
        ) : (
          albums.map((album) => {
            const albumPhotos = photos.filter((p) => p.album_id === album.id);
            if (albumPhotos.length === 0) return null;
            return (
              <div key={album.id} className="mb-12">
                {albums.length > 1 && (
                  <div className="text-center mb-6">
                    <h3
                      className="uppercase text-sm sm:text-base"
                      style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.2em" }}
                    >
                      {album.title}
                    </h3>
                    <span className="album-rule" />
                  </div>
                )}
                <div className="gallery-masonry">
                  {albumPhotos.map((photo) => {
                    const globalIndex = photos.findIndex((p) => p.id === photo.id);
                    const url = urls[photo.id];
                    return (
                      <button
                        key={photo.id}
                        type="button"
                        className="gallery-item"
                        onClick={() => setLightbox(globalIndex)}
                        aria-label={photo.caption ?? "Ver foto"}
                      >
                        {url ? (
                          <img src={url} alt={photo.caption ?? ""} loading="lazy" />
                        ) : (
                          <div className="gallery-placeholder" />
                        )}
                        <span className="gallery-veil" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Lightbox (via Portal, fica acima de tudo) */}
      {lightbox !== null && photos[lightbox] && createPortal(
        <div
          className="lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Fechar">
            <X size={26} />
          </button>
          <button
            className="lightbox-nav lightbox-prev"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Anterior"
          >
            <ChevronLeft size={28} />
          </button>
          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img
              key={photos[lightbox].id}
              src={urls[photos[lightbox].id]}
              alt={photos[lightbox].caption ?? ""}
              className="lightbox-img"
            />
            <figcaption className="lightbox-caption">
              <span>{photos[lightbox].caption ?? ""}</span>
              <span className="lightbox-meta">
                <a
                  href={urls[photos[lightbox].id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lightbox-download"
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const url = urls[photos[lightbox].id];
                    try {
                      const blob = await (await fetch(url)).blob();
                      const obj = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = obj;
                      a.download = photos[lightbox].storage_path.split("/").pop() || "foto.jpg";
                      a.click();
                      setTimeout(() => URL.revokeObjectURL(obj), 1000);
                    } catch {
                      window.open(url, "_blank", "noopener");
                    }
                  }}
                >
                  <Download size={14} />
                  {lang === "en" ? "Download" : "Descarregar"}
                </a>
                <span className="lightbox-count">{lightbox + 1} / {photos.length}</span>
              </span>
            </figcaption>
          </figure>
          <button
            className="lightbox-nav lightbox-next"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Seguinte"
          >
            <ChevronRight size={28} />
          </button>
        </div>,
        document.body
      )}

      <style>{`
        #galeria { scroll-margin-top: 84px; }
        .album-rule {
          display: block;
          width: 52px;
          height: 1px;
          margin: 10px auto 0;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }
        .gallery-masonry {
          column-count: 2;
          column-gap: 10px;
        }
        @media (min-width: 640px) {
          .gallery-masonry { column-count: 3; column-gap: 14px; }
        }
        @media (min-width: 1024px) {
          .gallery-masonry { column-count: 4; column-gap: 16px; }
        }
        .gallery-item {
          position: relative;
          display: block;
          width: 100%;
          break-inside: avoid;
          margin-bottom: 10px;
          overflow: hidden;
          border-radius: 10px;
          border: 1px solid color-mix(in oklab, var(--gold) 35%, transparent);
          cursor: pointer;
          background: var(--ivory);
          box-shadow: 0 6px 18px -12px rgba(78, 62, 34, 0.55);
          transition: box-shadow 0.35s ease, transform 0.35s ease, border-color 0.35s ease;
        }
        @media (min-width: 640px) {
          .gallery-item { margin-bottom: 14px; }
        }
        @media (min-width: 1024px) {
          .gallery-item { margin-bottom: 16px; }
        }
        .gallery-item img {
          display: block;
          width: 100%;
          height: auto;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .gallery-veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(50, 40, 22, 0.28), transparent 45%);
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .gallery-item:hover {
          box-shadow: 0 16px 34px -18px rgba(78, 62, 34, 0.75);
          border-color: color-mix(in oklab, var(--gold) 70%, transparent);
          transform: translateY(-2px);
        }
        .gallery-item:hover img { transform: scale(1.05); }
        .gallery-item:hover .gallery-veil { opacity: 1; }
        .gallery-placeholder {
          width: 100%;
          aspect-ratio: 3 / 4;
          background: color-mix(in oklab, var(--gold) 8%, var(--ivory));
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-item, .gallery-item img { transition: none; }
          .gallery-item:hover { transform: none; }
          .gallery-item:hover img { transform: none; }
        }
        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(20, 16, 10, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: lightboxIn 0.22s ease-out;
        }
        @keyframes lightboxIn { from { opacity: 0; } to { opacity: 1; } }
        .lightbox-figure {
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          max-width: 94vw;
        }
        .lightbox-img {
          max-width: 94vw;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 8px 50px rgba(0,0,0,0.6);
          animation: imgIn 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes imgIn { from { opacity: 0; transform: scale(0.985); } to { opacity: 1; transform: none; } }
        .lightbox-caption {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
          color: #F3EADA;
          font-family: Georgia, serif;
          font-size: 13px;
          font-style: italic;
        }
        .lightbox-meta {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }
        .lightbox-download {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: Cinzel, serif;
          font-style: normal;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
          opacity: 0.9;
        }
        .lightbox-download:hover { opacity: 1; }
        .lightbox-count {
          font-family: Cinzel, serif;
          font-style: normal;
          font-size: 11px;
          letter-spacing: 0.16em;
          opacity: 0.65;
        }
        .lightbox-close {
          position: absolute;
          top: calc(16px + env(safe-area-inset-top, 0px));
          right: 16px;
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.45);
          color: #fff;
          transition: background 0.2s ease;
          z-index: 2;
        }
        .lightbox-close:hover { background: rgba(0, 0, 0, 0.7); }
        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.4);
          color: #fff;
          transition: background 0.2s ease;
          z-index: 2;
        }
        .lightbox-nav:hover { background: rgba(0, 0, 0, 0.65); }
        .lightbox-prev { left: 12px; }
        .lightbox-next { right: 12px; }
        @media (max-width: 640px) {
          .lightbox-nav { display: none; }
          .lightbox-caption { font-size: 12px; }
        }
      `}</style>
    </section>
  );
}
