import { Music } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const SPOTIFY_URL =
  "https://open.spotify.com/playlist/22miI5eBxNfpStFtTP6gsS?si=30fa27d53e8b420f&pt=d93c8227004fab7190f30ac5db20b50f";

export function PlaylistSection() {
  const { t } = useI18n();

  return (
    <section
      id="musica"
      className="py-20 sm:py-28 px-5 sm:px-6 scroll-mt-24"
      style={{ background: "var(--cream)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2
            className="uppercase text-xl sm:text-2xl md:text-3xl"
            style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.3em", fontWeight: 500 }}
          >
            {t("playlist.title")}
          </h2>
          <p
            className="italic mt-3 text-3xl sm:text-4xl"
            style={{ fontFamily: "Allura, 'Great Vibes', cursive", color: "var(--gold)", lineHeight: 1.1 }}
          >
            {t("playlist.subtitle")}
          </p>
          <div className="divider-ornament mt-6 max-w-xs mx-auto">
            <Music className="w-4 h-4" strokeWidth={1.25} />
          </div>
        </div>

        <div
          className="mx-auto p-5 sm:p-8"
          style={{
            maxWidth: 820,
            background: "var(--ivory)",
            border: "1px solid var(--gold)",
            borderRadius: 12,
            boxShadow:
              "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 18px 40px -22px color-mix(in oklab, var(--olive) 25%, transparent)",
          }}
        >
          <iframe
            title="Spotify playlist"
            style={{ borderRadius: 12, border: 0, display: "block" }}
            src="https://open.spotify.com/embed/playlist/22miI5eBxNfpStFtTP6gsS?utm_source=generator&theme=0"
            width="100%"
            height={400}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />

          <p
            className="text-center mt-6 text-sm sm:text-base"
            style={{ color: "var(--olive)", fontFamily: "Lato, sans-serif" }}
          >
            {t("playlist.desc")}
          </p>

          <div className="mt-6 flex justify-center">
            <a
              href={SPOTIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="playlist-cta inline-flex items-center gap-2 px-7 py-4 uppercase transition-all hover:-translate-y-0.5"
              style={{
                fontFamily: "Cinzel, serif",
                letterSpacing: "0.22em",
                fontSize: "0.75rem",
                background: "var(--olive)",
                color: "var(--cream)",
                borderRadius: 8,
                minHeight: 44,
                border: "1px solid var(--olive)",
              }}
            >
              <Music size={16} strokeWidth={1.5} />
              {t("playlist.cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
