import { createFileRoute } from "@tanstack/react-router";
import { RsvpForm } from "@/components/RsvpForm";
import { downloadWeddingICS } from "@/lib/calendar";
import { DecorativeDivider } from "@/components/DecorativeDivider";
import { QuickNav } from "@/components/QuickNav";
import { SaveTheDateSection } from "@/components/SaveTheDateSection";
import { CountdownSection } from "@/components/CountdownSection";
import { Header } from "@/components/Header";
import { StorySection } from "@/components/StorySection";
import { JourneyQuoteSection } from "@/components/JourneyQuoteSection";
import { GallerySection } from "@/components/GallerySection";
import { Monogram } from "@/components/Monogram";
import { GiftsSection } from "@/components/GiftsSection";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyRsvpButton } from "@/components/StickyRsvpButton";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { MapPin, Clock, Hotel, Heart, CalendarPlus, Shirt, Car, Plane, ParkingCircle, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Joana & Diogo · 19.09.2026" },
      {
        name: "description",
        content:
          "Joana & Diogo are getting married on September 19, 2026 at Glicínia Wedding House. RSVP today.",
      },
      { property: "og:title", content: "Joana & Diogo · 19.09.2026" },
      {
        property: "og:description",
        content: "Join us at Glicínia Wedding House to celebrate our day.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Lato:wght@300;400;700&family=Allura&family=Great+Vibes&display=swap",
      },
    ],
  }),
  component: () => (
    <I18nProvider>
      <Index />
    </I18nProvider>
  ),
});

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Glic%C3%ADnia+Wedding+House+Freamunde";


function Index() {
  const { t } = useI18n();

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" />
      <Header />

      {/* HERO */}
      <section className="hero-map-bg relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-32">
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Monogram */}
          <div className="hero-mono-anim">
            <Monogram
              size={320}
              className="hidden sm:inline-block"
              topText="JOANA  ✦  DIOGO"
              bottomText="19  SETEMBRO  2026"
            />
            <Monogram
              size={240}
              className="sm:hidden"
              topText="JOANA  ✦  DIOGO"
              bottomText="19  SETEMBRO  2026"
            />
          </div>

          <div className="mt-[60px] flex flex-col items-center">
            <p
              className="hero-text-anim-1 uppercase"
              style={{
                color: "var(--olive)",
                letterSpacing: "0.3em",
                fontSize: "1.2rem",
                fontFamily: "Cinzel, serif",
                fontWeight: 500,
              }}
            >
              A Nossa Maior Viagem
            </p>
            <p
              className="hero-text-anim-2 italic mt-3"
              style={{
                color: "var(--gold)",
                fontFamily: "Allura, 'Great Vibes', cursive",
                fontSize: "3rem",
                lineHeight: 1.1,
              }}
            >
              começa agora
            </p>
          </div>

          <div className="hero-text-anim-3 flex items-center justify-center mt-10 mb-10">
            <span aria-hidden style={{ width: "80px", borderTop: "1px dashed var(--olive)" }} />
            <Heart className="mx-3" size={14} strokeWidth={1.25} style={{ color: "var(--olive)" }} />
            <span aria-hidden style={{ width: "80px", borderTop: "1px dashed var(--olive)" }} />
          </div>

          <div className="hero-text-anim-4 flex flex-wrap gap-4 justify-center">
            <a
              href="#rsvp"
              className="inline-block px-10 py-4 font-display text-sm uppercase transition-all hover:-translate-y-0.5"
              style={{
                background: "var(--olive)",
                color: "var(--cream)",
                letterSpacing: "0.25em",
                borderRadius: "8px",
                boxShadow: "0 6px 20px -10px color-mix(in oklab, var(--olive) 60%, transparent)",
              }}
            >
              Confirmar Presença
            </a>
            <button
              onClick={downloadICS}
              className="inline-flex items-center gap-2 px-8 py-4 font-display text-sm uppercase transition-all hover:-translate-y-0.5"
              style={{
                color: "var(--olive)",
                border: "1px solid var(--gold)",
                letterSpacing: "0.25em",
                borderRadius: "8px",
                background: "transparent",
              }}
            >
              <CalendarPlus className="w-4 h-4" strokeWidth={1.5} />
              Adicionar ao Calendário
            </button>
          </div>
        </div>

        <div className="hero-plane-path" aria-hidden="true">
          <Plane className="hero-plane" size={20} strokeWidth={1.25} />
        </div>
      </section>

      {/* QUICK NAV */}
      <QuickNav />

      <DecorativeDivider />

      {/* COUNTDOWN */}
      <CountdownSection />

      <DecorativeDivider />

      {/* STORY */}
      <StorySection />

      <DecorativeDivider />

      {/* JOURNEY QUOTE (Banner) */}
      <JourneyQuoteSection />

      <DecorativeDivider />

      {/* GALLERY */}
      <GallerySection />

      <DecorativeDivider />

      {/* SAVE THE DATE */}
      <SaveTheDateSection />

      <DecorativeDivider />

      {/* EVENT */}
      <section id="event" className="py-28 sm:py-40 px-6 bg-secondary/40 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
              The Ceremony
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-primary">{t("event.title")}</h2>
            <div className="divider-ornament mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>

          <div
            className="mx-auto"
            style={{
              maxWidth: 900,
              background: "var(--ivory)",
              border: "1px solid var(--gold)",
              borderRadius: 12,
              padding: 30,
              boxShadow:
                "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 18px 40px -22px color-mix(in oklab, var(--olive) 25%, transparent)",
            }}
          >
            {/* Venue title */}
            <div className="text-center">
              <h3
                className="uppercase"
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "var(--olive)",
                  letterSpacing: "0.25em",
                  fontSize: "1.4rem",
                  fontWeight: 500,
                }}
              >
                Glicínia Wedding House
              </h3>

              {/* Decorative divider with heart */}
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
                  <Heart
                    size={14}
                    strokeWidth={1}
                    fill="var(--gold)"
                    style={{ color: "var(--gold)" }}
                  />
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 mt-1">
                <Clock className="w-4 h-4" strokeWidth={1.5} style={{ color: "var(--olive)", opacity: 0.7 }} />
                <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.85 }}>
                  {t("event.desc")} · {t("event.place")}
                </p>
              </div>
            </div>

            {/* Embedded interactive map */}
            <div className="mt-6 overflow-hidden" style={{ borderRadius: 8, border: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)" }}>
              <iframe
                title="Glicínia Wedding House — mapa"
                src="https://www.google.com/maps?q=Glic%C3%ADnia+Wedding+House+Freamunde&output=embed"
                width="100%"
                height="400"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full border-0"
              />
            </div>

            {/* Practical info cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PracticalCard icon={<Car size={22} strokeWidth={1.5} />} title="Do Porto" desc="30 minutos de carro" />
              <PracticalCard icon={<Plane size={22} strokeWidth={1.5} />} title="Aeroporto" desc="35 min do Aeroporto Sá Carneiro" />
              <PracticalCard icon={<ParkingCircle size={22} strokeWidth={1.5} />} title="Estacionamento" desc="Gratuito no local" />
            </div>

            {/* CTA */}
            <div className="mt-8 flex justify-center">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 uppercase transition-all hover:-translate-y-0.5"
                style={{
                  fontFamily: "Cinzel, serif",
                  letterSpacing: "0.25em",
                  fontSize: "0.8rem",
                  color: "var(--gold)",
                  border: "1px solid var(--gold)",
                  borderRadius: 8,
                  background: "transparent",
                }}
              >
                <ExternalLink size={14} strokeWidth={1.5} />
                Abrir no Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <DecorativeDivider />

      {/* INFORMATION */}
      <section id="info" className="py-28 sm:py-40 px-6 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
              For our guests
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-primary">{t("info.title")}</h2>
            <div className="divider-ornament mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard icon={<Shirt className="w-6 h-6" strokeWidth={1.5} />} title={t("info.dress.title")} desc={t("info.dress.desc")} />
            <InfoCard icon={<Hotel className="w-6 h-6" strokeWidth={1.5} />} title={t("info.hotel.title")} desc={t("info.hotel.desc")} />
            <InfoCard icon={<Car className="w-6 h-6" strokeWidth={1.5} />} title={t("info.parking.title")} desc={t("info.parking.desc")} />
          </div>
        </div>
      </section>

      <DecorativeDivider />

      {/* RSVP */}
      <section id="rsvp" className="py-28 sm:py-40 px-6 bg-secondary/40 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
              {t("rsvp.subtitle")}
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-primary">{t("rsvp.title")}</h2>
            <div className="divider-ornament mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>
          <RsvpForm />
        </div>
      </section>

      <DecorativeDivider />

      {/* GIFTS */}
      <GiftsSection />

      <DecorativeDivider />

      {/* FOOTER */}
      <SiteFooter />

      {/* FLOATING ACTIONS */}
      <StickyRsvpButton />
      <WhatsAppFab />
    </div>
  );
}

function InfoCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="card-gold p-8">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="font-display text-xl mb-3 text-primary">{title}</h3>
      <p className="text-sm leading-relaxed text-foreground/75">{desc}</p>
    </div>
  );
}

function PracticalCard({
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
      className="text-center"
      style={{
        background: "var(--cream)",
        border: "1px solid color-mix(in oklab, var(--gold) 35%, transparent)",
        borderRadius: 8,
        padding: "20px 16px",
      }}
    >
      <div className="flex justify-center" style={{ color: "var(--olive)" }}>
        {icon}
      </div>
      <p
        className="uppercase mt-3"
        style={{
          fontFamily: "Cinzel, serif",
          color: "var(--olive)",
          letterSpacing: "0.25em",
          fontSize: "0.75rem",
          fontWeight: 500,
        }}
      >
        {title}
      </p>
      <p
        className="mt-1"
        style={{
          fontFamily: "Lato, sans-serif",
          color: "var(--foreground)",
          opacity: 0.8,
          fontSize: "0.85rem",
        }}
      >
        {desc}
      </p>
    </div>
  );
}
