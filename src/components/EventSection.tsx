import { Clock, Heart, MapPin, Plane, ParkingCircle, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Glic%C3%ADnia+Wedding+House+Freamunde";

export function EventSection() {
  const { t } = useI18n();

  return (
    <section id="event" className="py-10 sm:py-16 md:py-24 px-5 sm:px-6 bg-secondary/40 scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6 sm:mb-12">
          <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
            {t("event.kicker")}
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-primary">{t("event.title")}</h2>
          <div className="divider-ornament mt-5 max-w-xs mx-auto">
            <Heart className="w-3 h-3" strokeWidth={1} />
          </div>
        </div>

        <div
          className="mx-auto p-5 sm:p-8"
          style={{
            maxWidth: 900,
            background: "var(--ivory)",
            border: "1px solid var(--gold)",
            borderRadius: 12,
            boxShadow:
              "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 18px 40px -22px color-mix(in oklab, var(--olive) 25%, transparent)",
          }}
        >
          <div className="text-center">
            <h3
              className="uppercase text-base sm:text-lg md:text-xl"
              style={{
                fontFamily: "Cinzel, serif",
                color: "var(--olive)",
                letterSpacing: "0.25em",
                fontWeight: 500,
              }}
            >
              Glicínia Wedding House
            </h3>

            <div className="relative my-5 flex items-center justify-center max-w-xs mx-auto">
              <span
                aria-hidden
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
                style={{ borderTop: "1px dashed var(--olive)", opacity: 0.4 }}
              />
              <span
                className="relative inline-flex items-center justify-center px-3"
                style={{ background: "var(--ivory)" }}
              >
                <Heart size={14} strokeWidth={1} fill="var(--gold)" style={{ color: "var(--gold)" }} />
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
              <Clock className="w-4 h-4" strokeWidth={1.5} style={{ color: "var(--olive)", opacity: 0.7 }} />
              <p className="text-xs sm:text-sm" style={{ color: "var(--foreground)", opacity: 0.85 }}>
                {t("event.desc")} · {t("event.place")}
              </p>
            </div>
          </div>

          {/* Embedded interactive map */}
          <div
            className="mt-6 overflow-hidden"
            style={{ borderRadius: 8, border: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)" }}
          >
            <iframe
              title="Glicínia Wedding House — mapa"
              src="https://www.google.com/maps?q=Glic%C3%ADnia+Wedding+House+Freamunde&output=embed"
              width="100%"
              height="280"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full border-0 sm:h-[400px]"
              style={{ height: 280 }}
            />
          </div>

          {/* Travel cards */}
          <div className="mt-7">
            <p
              className="text-center uppercase text-xs sm:text-sm mb-4"
              style={{
                fontFamily: "Cinzel, serif",
                color: "var(--olive)",
                letterSpacing: "0.3em",
                fontWeight: 500,
              }}
            >
              {t("travel.title")}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <TravelCard icon={<MapPin size={28} strokeWidth={1.5} />} title={t("travel.porto")} desc={t("travel.porto.desc")} />
              <TravelCard icon={<MapPin size={28} strokeWidth={1.5} />} title={t("travel.aveiro")} desc={t("travel.aveiro.desc")} />
              <TravelCard icon={<Plane size={28} strokeWidth={1.5} />} title={t("travel.airport")} desc={t("travel.airport.desc")} />
              <TravelCard icon={<ParkingCircle size={28} strokeWidth={1.5} />} title={t("travel.parking")} desc={t("travel.parking.desc")} />
            </div>
          </div>

          <div className="mt-7 flex justify-center">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 uppercase transition-all hover:-translate-y-0.5"
              style={{
                fontFamily: "Cinzel, serif",
                letterSpacing: "0.25em",
                fontSize: "0.75rem",
                color: "var(--gold)",
                border: "1px solid var(--gold)",
                borderRadius: 8,
                background: "transparent",
                minHeight: 44,
              }}
            >
              <ExternalLink size={14} strokeWidth={1.5} />
              {t("event.maps")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function TravelCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div
      className="travel-card text-center transition-all"
      style={{
        background: "var(--ivory)",
        border: "1px solid color-mix(in oklab, var(--gold) 55%, transparent)",
        borderRadius: 8,
        padding: "16px 12px",
      }}
    >
      <div className="flex justify-center" style={{ color: "var(--olive)" }}>
        {icon}
      </div>
      <p
        className="uppercase mt-3 text-xs"
        style={{
          fontFamily: "Cinzel, serif",
          color: "var(--olive)",
          letterSpacing: "0.2em",
          fontWeight: 500,
        }}
      >
        {title}
      </p>
      <p
        className="mt-1 text-sm"
        style={{ fontFamily: "Lato, sans-serif", color: "var(--gold)", fontWeight: 400 }}
      >
        {desc}
      </p>
    </div>
  );
}
