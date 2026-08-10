import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { HomeScreen } from "@/components/app/HomeScreen";

const SITE_URL = "https://joanaediogo.com";

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
          "A nossa maior viagem começa a 19 de setembro de 2026 na Glicínia Wedding House. Confirma a tua presença, vê fotos e deixa uma mensagem.",
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
      { rel: "preload", as: "image", href: "/hero-desktop.jpg", fetchpriority: "high" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(EVENT_JSONLD) }],
  }),
  component: () => (
    <AppShell>
      <HomeScreen />
    </AppShell>
  ),
});
