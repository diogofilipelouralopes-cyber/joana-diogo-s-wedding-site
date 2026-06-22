import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

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

  // Se não há álbuns publicados, não mostra a secção de todo
  if (!loading && albums.length === 0) return null;

  const title = lang === "en" ? "Our Gallery" : "A Nossa Galeria";
  const subtitle = lang === "en" ? "moments we want to share" : "momentos que queremos partilhar";

  return (
    <section id="galeria" className="py-20 sm:py-28 px-5 sm:px-6 scroll-mt-24" style={{ background: "var(--cream)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
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
                  <h3
                    className="text-center uppercase text-sm sm:text-base mb-6"
                    style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.2em" }}
                  >
                    {album.title}
                  </h3>
                )}
                <div className="gallery-grid">
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
        <div className="lightbox" onClick={closeLightbox} role="dialog" aria-modal="true">
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
          <img
            src={urls[photos[lightbox].id]}
            alt={photos[lightbox].caption ?? ""}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
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
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        @media (min-width: 640px) {
          .gallery-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
        }
        @media (min-width: 1024px) {
          .gallery-grid { grid-template-columns: repeat(4, 1fr); gap: 12px; }
        }
        .gallery-item {
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid color-mix(in oklab, var(--gold) 30%, transparent);
          cursor: pointer;
          background: var(--ivory);
        }
        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .gallery-item:hover img { transform: scale(1.06); }
        .gallery-placeholder {
          width: 100%; height: 100%;
          background: color-mix(in oklab, var(--gold) 8%, var(--ivory));
        }
        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(20, 16, 10, 0.94);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .lightbox-img {
          max-width: 94vw;
          max-height: 86vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 8px 50px rgba(0,0,0,0.6);
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
      `}</style>
    </section>
  );
}
