import { createFileRoute } from "@tanstack/react-router";
import { RsvpForm } from "@/components/RsvpForm";
import { Header } from "@/components/Header";
import { StorySection } from "@/components/StorySection";
import { JourneyQuoteSection } from "@/components/JourneyQuoteSection";
import { GallerySection } from "@/components/GallerySection";
import { Monogram } from "@/components/Monogram";
import { GiftsSection } from "@/components/GiftsSection";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { MapPin, Clock, Hotel, Heart, CalendarPlus, Shirt, Car, Plane } from "lucide-react";

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

function downloadICS() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Joana & Diogo//Wedding//EN",
    "BEGIN:VEVENT",
    "UID:joana-diogo-2026@wedding",
    "DTSTAMP:20260101T000000Z",
    "DTSTART:20260919T130000Z",
    "DTEND:20260920T040000Z",
    "SUMMARY:Casamento Joana & Diogo",
    "LOCATION:Glicínia Wedding House, Freamunde, Portugal",
    "DESCRIPTION:Cerimónia às 14h00",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Joana-Diogo-2026.ics";
  link.click();
  URL.revokeObjectURL(url);
}

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

      {/* STORY */}
      <StorySection />

      {/* JOURNEY QUOTE */}
      <JourneyQuoteSection />

      {/* GALLERY */}
      <GallerySection />

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

          <div className="card-gold p-8 sm:p-10 text-center mb-8">
            <h3 className="font-display text-2xl sm:text-3xl text-primary tracking-[0.08em]">
              {t("event.venue")}
            </h3>
            <p className="text-foreground/75 mt-2">{t("event.place")}</p>

            <div className="flex justify-center gap-2 mt-4">
              <Clock className="w-4 h-4 text-primary/70 mt-0.5" strokeWidth={1.5} />
              <p className="text-sm text-foreground/85">{t("event.desc")}</p>
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-xs uppercase tracking-[0.22em] text-primary hover:text-primary/70 underline-offset-4 hover:underline"
            >
              <MapPin className="w-3.5 h-3.5" />
              {t("event.maps")}
            </a>
          </div>

          {/* Embedded map */}
          <div className="overflow-hidden card-gold">
            <iframe
              title="Glicínia Wedding House — mapa"
              src="https://www.google.com/maps?q=Glic%C3%ADnia+Wedding+House+Freamunde&output=embed"
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full border-0"
            />
          </div>
        </div>
      </section>

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

      {/* GIFTS */}
      <GiftsSection />

      {/* SAVE THE DATE / FOOTER */}
      <footer className="py-20 px-6 border-t border-border text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
          {t("footer.tagline")}
        </p>
        <div className="flex justify-center mb-6">
          <Monogram size={200} />
        </div>
        <p className="font-script text-4xl mt-4" style={{ color: "var(--gold)" }}>
          Save the Date
        </p>
      </footer>

      {/* FLOATING ACTIONS */}
      <a
        href="#rsvp"
        className="fixed bottom-6 right-6 z-40 px-5 py-3 bg-primary text-primary-foreground font-display text-sm tracking-[0.15em] uppercase shadow-lg hover:bg-primary/90 transition-all hover:-translate-y-0.5"
      >
        {t("hero.cta")}
      </a>
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
