import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useEffect, lazy, Suspense } from "react";
import { RsvpForm } from "@/components/RsvpForm";
import { DecorativeDivider } from "@/components/DecorativeDivider";
import { Header } from "@/components/Header";
import { HeroCountdown } from "@/components/HeroCountdown";
import { StorySection } from "@/components/StorySection";

import { GiftsSection } from "@/components/GiftsSection";
import { MemoriesSection, ALBUM_URL } from "@/components/MemoriesSection";
import { PublicGallerySection } from "@/components/PublicGallerySection";
import { FaqSection } from "@/components/FaqSection";
import { MessagesSection } from "@/components/MessagesSection";
import { SiteFooter } from "@/components/SiteFooter";
import { LiveAnnouncementBanner } from "@/components/LiveAnnouncementBanner";
// Chat widget pulls in shiki/oniguruma (WASM) through streamdown — must never
// enter the SSR/Worker import graph.
const ChatWidget = lazy(() => import("@/components/ChatWidget"));
import { Reveal } from "@/components/Reveal";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { Camera, MapPin, Clock, Hotel, Heart, Shirt, Car, ParkingCircle, ExternalLink } from "lucide-react";


const SITE_URL = "https://joanaediogo.com";

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
      { rel: "preload", as: "image", href: "/hero-desktop.jpg", fetchPriority: "high" },
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
  const { t, lang } = useI18n();

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
          <h1 className="sr-only">Joana &amp; Diogo — Casamento 19 de setembro de 2026, Glicínia Wedding House</h1>

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

        {/* BOTTOM THIRD: countdown + divider + buttons */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto">
          <HeroCountdown />

          <div
            className="hero-text-anim-3 flex items-center justify-center"
            style={{ marginTop: 18, marginBottom: 18 }}
          >
            <span aria-hidden style={{ width: "60px", borderTop: "1px dashed var(--olive)" }} />
            <Heart className="mx-3" size={14} strokeWidth={1.25} style={{ color: "var(--olive)" }} />
            <span aria-hidden style={{ width: "60px", borderTop: "1px dashed var(--olive)" }} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Glic%C3%ADnia+Wedding+House+Freamunde"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-directions-btn hero-text-anim-3"
            >
              <MapPin size={17} strokeWidth={1.6} />
              <span>{lang === "en" ? "How to get there" : "Como chegar"}</span>
            </a>

            <a
              href={ALBUM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-directions-btn hero-text-anim-3"
            >
              <Camera size={17} strokeWidth={1.6} />
              <span>{lang === "en" ? "Photos" : "Fotografias"}</span>
            </a>
          </div>

        </div>
      </section>

      <DecorativeDivider />

      {/* EVENT */}
      <section id="event" className="py-6 sm:py-14 md:py-20 px-4 sm:px-6 bg-secondary/40 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-5 sm:mb-12">
            <p className="text-[0.6rem] sm:text-xs uppercase tracking-[0.35em] text-muted-foreground mb-2">
              {t("event.kicker")}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-primary">{t("event.title")}</h2>
            <div className="divider-ornament mt-3 sm:mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>

          <div
            className="mx-auto p-4 sm:p-8"
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

              <div className="relative my-3 sm:my-5 flex items-center justify-center max-w-xs mx-auto">
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

            {/* Travel cards */}
            <div className="mt-5 sm:mt-8">
              <p
                className="text-center uppercase text-xs sm:text-sm mb-3 sm:mb-5"
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "var(--olive)",
                  letterSpacing: "0.3em",
                  fontWeight: 500,
                }}
              >
                {t("travel.title")}
              </p>
              <p
                className="text-center text-sm sm:text-base leading-relaxed"
                style={{ color: "var(--foreground)", opacity: 0.85 }}
              >
                {/* quebra entre destinos, nunca dentro de um */}
                {t("travel.summary")
                  .split(" · ")
                  .map((destino, i) => (
                    <span key={destino}>
                      {i > 0 ? " · " : ""}
                      <span className="whitespace-nowrap">{destino}</span>
                    </span>
                  ))}
              </p>

              <div className="mt-3 flex items-center justify-center gap-2">
                <ParkingCircle size={16} strokeWidth={1.5} style={{ color: "var(--olive)", opacity: 0.7 }} />
                <p className="text-xs sm:text-sm" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                  {t("travel.parking.note")}
                </p>
              </div>
            </div>

            <div className="mt-5 sm:mt-8 flex justify-center">
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
      <section id="info" className="py-6 sm:py-14 md:py-20 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-5 sm:mb-12">
            <p className="text-[0.6rem] sm:text-xs uppercase tracking-[0.35em] text-muted-foreground mb-2">
              {t("info.kicker")}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-primary">{t("info.title")}</h2>
            <div className="divider-ornament mt-3 sm:mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3 sm:gap-6">
            <InfoCard icon={<Shirt className="w-6 h-6" strokeWidth={1.5} />} title={t("info.dress.title")} desc={t("info.dress.desc")} />
            <InfoCard icon={<Hotel className="w-6 h-6" strokeWidth={1.5} />} title={t("info.hotel.title")} desc={t("info.hotel.desc")} />
            <InfoCard icon={<Car className="w-6 h-6" strokeWidth={1.5} />} title={t("info.parking.title")} desc={t("info.parking.desc")} />
          </div>
        </div>
      </section>

      <DecorativeDivider />

      {/* FAQ */}
      <Reveal><FaqSection /></Reveal>

      <DecorativeDivider />

      {/* STORY */}
      <Reveal><StorySection /></Reveal>

      <DecorativeDivider />

      {/* PHOTOS (shared album) */}
      <Reveal><MemoriesSection /></Reveal>

      {/* GALERIA PÚBLICA (álbuns publicados) */}
      <Reveal><PublicGallerySection /></Reveal>

      <DecorativeDivider />

      {/* MESSAGES */}
      <Reveal><MessagesSection /></Reveal>

      <DecorativeDivider />

      {/* GIFTS */}
      <Reveal><GiftsSection /></Reveal>

      <DecorativeDivider />

      {/* RSVP — no fim: todos confirmados, fica para alterações de última hora */}
      <section id="rsvp" className="py-6 sm:py-14 md:py-20 px-4 sm:px-6 bg-secondary/40 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-5 sm:mb-10">
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-primary">{t("rsvp.title")}</h2>
            <div className="divider-ornament mt-3 sm:mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>
          <RsvpForm />
        </div>
      </section>

      </main>

      {/* FOOTER */}
      <SiteFooter />
      </div>

      {/* FLOATING ACTIONS */}

      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </ClientOnly>
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
    <div className="card-gold p-4 sm:p-8">
      <div className="flex items-center gap-3 mb-2 sm:block">
        <div className="text-primary shrink-0 sm:mb-4">{icon}</div>
        <h3 className="font-display text-sm sm:text-lg sm:mb-3 text-primary break-words min-w-0" style={{ letterSpacing: "0.16em" }}>{title}</h3>
      </div>
      <p className="text-[0.82rem] sm:text-sm leading-snug sm:leading-relaxed text-foreground/75">{desc}</p>
    </div>
  );
}
