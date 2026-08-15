import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { I18nProvider } from "@/lib/i18n";

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
      <AppShell />
    </I18nProvider>
  ),
});
