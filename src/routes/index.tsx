import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { RsvpForm } from "@/components/RsvpForm";
import { DecorativeDivider } from "@/components/DecorativeDivider";
import { CountdownSection } from "@/components/CountdownSection";
import { Header } from "@/components/Header";
import { StorySection } from "@/components/StorySection";

import { GiftsSection } from "@/components/GiftsSection";
import { MemoriesSection } from "@/components/MemoriesSection";
import { PlaylistSection } from "@/components/PlaylistSection";
import { FaqSection } from "@/components/FaqSection";
import { MessagesSection } from "@/components/MessagesSection";
import { SiteFooter } from "@/components/SiteFooter";
import { InstallButton } from "@/components/InstallButton";
import { LiveAnnouncementBanner } from "@/components/LiveAnnouncementBanner";
import { QuickAccessBar } from "@/components/QuickAccessBar";
import { Reveal } from "@/components/Reveal";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { MapPin, Clock, Hotel, Heart, Shirt, Car, Plane, ParkingCircle, ExternalLink } from "lucide-react";


const SITE_URL = "https://joanaediogo-com.lovable.app";

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { q: "A que horas devo chegar?", a: "A cerimónia começa pontualmente às 14h00. Sugerimos chegar entre 15 a 30 minutos antes." },
    { q: "Posso levar acompanhante?", a: "Fala connosco diretamente para que possamos organizar tudo da melhor forma." },
    { q: "Qual é o dress code?", a: "Sintam-se confortáveis e incríveis. Guardem o branco apenas para a noiva." },
    { q: "Há estacionamento no local?", a: "Sim, a Quinta Glicínia dispõe de estacionamento privativo e gratuito." },
    { q: "Há alojamento próximo?", a: "A Quinta Glicínia dispõe de alojamento no local com check-in a partir das 15h00." },
    { q: "Posso tirar fotografias durante a cerimónia?", a: "Pedimos que durante a cerimónia desfrutem do momento; após, à vontade." },
    { q: "Como ofereço um presente?", a: "A vossa presença é o nosso maior presente. Vejam a secção 'Presentes'." },
    { q: "Tenho restrições alimentares. O que faço?", a: "Indica todas as restrições no formulário RSVP e nós tratamos do resto." },
  ].map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const EVENT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Casamento Joana & Diogo",
  startDate: "2026-09-19T14:00:00+01:00",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "Glicínia Wedding House",
    address: { "@type": "PostalAddress", addressLocality: "Freamunde", addressCountry: "PT" },
  },
  organizer: { "@type": "Person", name: "Joana & Diogo" },
  url: SITE_URL + "/",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Joana & Diogo · Casamento 19.09.2026" },
      {
        name: "description",
        content:
          "Joana & Diogo casam-se a 19 de setembro de 2026 na Glicínia Wedding House. Confirma a tua presença, vê fotos e deixa uma mensagem.",
      },
      { property: "og:title", content: "Joana & Diogo · Casamento 19.09.2026" },
      {
        property: "og:description",
        content: "Junta-te a nós na Glicínia Wedding House para celebrar o nosso dia.",
      },
      { property: "og:url", content: SITE_URL + "/" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL + "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preload", as: "image", href: "/hero-desktop.jpg", fetchpriority: "high" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Lato:wght@300;400;700&family=Allura&family=Great+Vibes&display=swap",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(EVENT_JSONLD) },
      { type: "application/ld+json", children: JSON.stringify(FAQ_JSONLD) },
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

  // Always start at the top on load/reload
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <LiveAnnouncementBanner />
      <div id="top" className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Toaster position="top-center" />
      <Header />


      <main>
      {/* HERO */}
      <section
        className="hero-bg hero-section relative flex flex-col items-center text-center overflow-hidden px-5 sm:px-6"
        style={{
          minHeight: "100vh",
          paddingBottom: 60,
          justifyContent: "space-between",
        }}
      >
        <picture className="hero-picture">
          <source media="(max-width: 768px)" srcSet="/hero-mobile.jpg" />
          <img
            src="/hero-desktop.jpg"
            alt="Joana e Diogo ao pôr do sol"
            className="hero-image"
            width={1920}
            height={1280}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="hero-overlay" aria-hidden="true" />

        {/* TOP THIRD: text */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto w-full">
          <p
            className="hero-text-anim-1 hero-text-shadow uppercase text-[1.1rem] sm:text-xl"
            style={{
              color: "var(--olive)",
              letterSpacing: "0.25em",
              fontFamily: "Cinzel, serif",
              fontWeight: 500,
            }}
          >
            {t("hero.tagline")}
          </p>

          <p
            className="hero-text-anim-2 hero-text-shadow italic text-[2.5rem] sm:text-6xl"
            style={{
              color: "var(--gold)",
              fontFamily: "Allura, 'Great Vibes', cursive",
              lineHeight: 1.1,
              marginTop: 20,
            }}
          >
            {t("hero.tagline.script")}
          </p>
        </div>

        {/* BOTTOM THIRD: divider + buttons */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto">
          <div
            className="hero-text-anim-3 flex items-center justify-center"
            style={{ marginBottom: 28 }}
          >
            <span aria-hidden style={{ width: "60px", borderTop: "1px dashed var(--olive)" }} />
            <Heart className="mx-3" size={14} strokeWidth={1.25} style={{ color: "var(--olive)" }} />
            <span aria-hidden style={{ width: "60px", borderTop: "1px dashed var(--olive)" }} />
          </div>

        </div>
      </section>

      <DecorativeDivider />

      {/* COUNTDOWN */}
      <Reveal><CountdownSection /></Reveal>

      <DecorativeDivider />

      {/* STORY */}
      <Reveal><StorySection /></Reveal>

      <DecorativeDivider />

      {/* RSVP — moved up for priority */}
      <section id="rsvp" className="py-20 sm:py-28 md:py-40 px-5 sm:px-6 bg-secondary/40 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
              {t("rsvp.subtitle")}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-primary">{t("rsvp.title")}</h2>
            <div className="divider-ornament mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>
          <RsvpForm />
        </div>
      </section>

      <DecorativeDivider />

      {/* EVENT */}
      <section id="event" className="py-20 sm:py-28 md:py-40 px-5 sm:px-6 bg-secondary/40 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
              {t("event.kicker")}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-primary">{t("event.title")}</h2>
            <div className="divider-ornament mt-6 max-w-xs mx-auto">
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
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full border-0 sm:h-[400px]"
                style={{ height: 320 }}
              />
            </div>

            {/* Travel cards */}
            <div className="mt-8">
              <p
                className="text-center uppercase text-xs sm:text-sm mb-5"
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "var(--olive)",
                  letterSpacing: "0.3em",
                  fontWeight: 500,
                }}
              >
                {t("travel.title")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <TravelCard icon={<MapPin size={32} strokeWidth={1.5} />} title={t("travel.porto")} desc={t("travel.porto.desc")} />
                <TravelCard icon={<MapPin size={32} strokeWidth={1.5} />} title={t("travel.aveiro")} desc={t("travel.aveiro.desc")} />
                <TravelCard icon={<Plane size={32} strokeWidth={1.5} />} title={t("travel.airport")} desc={t("travel.airport.desc")} />
                <TravelCard icon={<ParkingCircle size={32} strokeWidth={1.5} />} title={t("travel.parking")} desc={t("travel.parking.desc")} />
              </div>
            </div>

            <div className="mt-8 flex justify-center">
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

      <DecorativeDivider />

      {/* INFORMATION */}
      <section id="info" className="py-20 sm:py-28 md:py-40 px-5 sm:px-6 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
              {t("info.kicker")}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-primary">{t("info.title")}</h2>
            <div className="divider-ornament mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            <InfoCard icon={<Shirt className="w-6 h-6" strokeWidth={1.5} />} title={t("info.dress.title")} desc={t("info.dress.desc")} />
            <InfoCard icon={<Hotel className="w-6 h-6" strokeWidth={1.5} />} title={t("info.hotel.title")} desc={t("info.hotel.desc")} />
            <InfoCard icon={<Car className="w-6 h-6" strokeWidth={1.5} />} title={t("info.parking.title")} desc={t("info.parking.desc")} />
          </div>
        </div>
      </section>

      <DecorativeDivider />

      {/* PHOTOS (shared album) */}
      <Reveal><MemoriesSection /></Reveal>

      <DecorativeDivider />

      {/* MUSIC (Spotify playlist) */}
      <Reveal><PlaylistSection /></Reveal>

      <DecorativeDivider />

      {/* FAQ */}
      <Reveal><FaqSection /></Reveal>

      <DecorativeDivider />

      {/* MESSAGES */}
      <Reveal><MessagesSection /></Reveal>

      <DecorativeDivider />

      {/* GIFTS */}
      <Reveal><GiftsSection /></Reveal>

      <DecorativeDivider />
      </main>

      {/* FOOTER */}
      <SiteFooter />
      </div>

      {/* FLOATING ACTIONS */}
      <InstallButton />
      <QuickAccessBar />
    </>
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
    <div className="card-gold p-6 sm:p-8">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="font-display text-base sm:text-lg mb-3 text-primary break-words" style={{ letterSpacing: "0.18em" }}>{title}</h3>
      <p className="text-sm leading-relaxed text-foreground/75">{desc}</p>
    </div>
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
        padding: "20px 16px",
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
        style={{
          fontFamily: "Lato, sans-serif",
          color: "var(--gold)",
          fontWeight: 400,
        }}
      >
        {desc}
      </p>
    </div>
  );
}
