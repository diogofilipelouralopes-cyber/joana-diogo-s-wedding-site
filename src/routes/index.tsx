import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { DecorativeDivider } from "@/components/DecorativeDivider";
import { CountdownSection } from "@/components/CountdownSection";
import { StorySection } from "@/components/StorySection";
import { GiftsSection } from "@/components/GiftsSection";
import { ThankYouSection } from "@/components/ThankYouSection";
import { MemoriesSection } from "@/components/MemoriesSection";
import { PublicGallerySection } from "@/components/PublicGallerySection";
import { FaqSection } from "@/components/FaqSection";
import { MessagesSection } from "@/components/MessagesSection";
import { EventSection } from "@/components/EventSection";
import { InfoSection } from "@/components/InfoSection";
import { RsvpSection } from "@/components/RsvpSection";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { Heart, CalendarHeart, MapPin } from "lucide-react";

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
    <PageShell>
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

        {/* BOTTOM THIRD: data, local e divisor */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto">
          <div className="hero-text-anim-3 flex items-center justify-center" style={{ marginBottom: 18 }}>
            <span aria-hidden style={{ width: "60px", borderTop: "1px dashed var(--olive)" }} />
            <Heart className="mx-3" size={14} strokeWidth={1.25} style={{ color: "var(--olive)" }} />
            <span aria-hidden style={{ width: "60px", borderTop: "1px dashed var(--olive)" }} />
          </div>

          <p
            className="hero-text-anim-3 hero-text-shadow uppercase text-sm sm:text-base"
            style={{
              fontFamily: "Cinzel, serif",
              color: "var(--olive)",
              letterSpacing: "0.32em",
              fontWeight: 500,
            }}
          >
            19 · 09 · 2026
          </p>
          <p
            className="hero-text-anim-4 hero-text-shadow mt-2 text-xs sm:text-sm"
            style={{
              fontFamily: "Lato, sans-serif",
              color: "color-mix(in oklab, var(--olive) 82%, transparent)",
              letterSpacing: "0.06em",
            }}
          >
            Glicínia Wedding House · {t("event.place")}
          </p>
        </div>
      </section>

      <DecorativeDivider />

      {/* COUNTDOWN */}
      <Reveal><CountdownSection /></Reveal>

      {/* MOBILE: atalhos principais — o resto do conteúdo vive nos separadores */}
      <section className="md:hidden px-5 pt-1 pb-6">
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <Link to="/rsvp" className="btn-pill btn-pill-solid">
            <CalendarHeart size={16} strokeWidth={1.5} />
            {lang === "en" ? "RSVP" : "Confirmar presença"}
          </Link>
          <Link to="/evento" className="btn-pill btn-pill-ghost">
            <MapPin size={16} strokeWidth={1.5} />
            {lang === "en" ? "Event & venue" : "Evento e local"}
          </Link>
        </div>
      </section>


      {/* DESKTOP: página completa (em mobile o conteúdo está nos separadores) */}
      <div className="hidden md:contents">
        <DecorativeDivider />
        <Reveal><StorySection /></Reveal>
        <DecorativeDivider />
        <RsvpSection />
        <DecorativeDivider />
        <EventSection />
        <DecorativeDivider />
        <InfoSection />
        <DecorativeDivider />
        <Reveal><MemoriesSection /></Reveal>
        <DecorativeDivider />
        <Reveal><PublicGallerySection /></Reveal>
        <DecorativeDivider />
        <Reveal><FaqSection /></Reveal>
        <DecorativeDivider />
        <Reveal><MessagesSection /></Reveal>
        <DecorativeDivider />
        <Reveal><GiftsSection /></Reveal>
        <DecorativeDivider />
        <Reveal><ThankYouSection /></Reveal>
        <DecorativeDivider />
      </div>
    </PageShell>
  );
}
