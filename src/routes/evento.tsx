import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { PageShell } from "@/components/PageShell";
import { EventSection } from "@/components/EventSection";
import { InfoSection } from "@/components/InfoSection";
import { DecorativeDivider } from "@/components/DecorativeDivider";

const SITE_URL = "https://joanaediogo.com";

export const Route = createFileRoute("/evento")({
  head: () => ({
    meta: [
      { title: "Evento · Joana & Diogo — Glicínia Wedding House" },
      {
        name: "description",
        content:
          "Local, horário, mapa e informações práticas do casamento de Joana & Diogo na Glicínia Wedding House, a 19 de setembro de 2026.",
      },
      { property: "og:title", content: "Evento · Joana & Diogo" },
      { property: "og:description", content: "Local, horário e como chegar à Glicínia Wedding House." },
      { property: "og:url", content: SITE_URL + "/evento" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/evento" }],
  }),
  component: () => (
    <I18nProvider>
      <PageShell>
        <EventSection />
        <DecorativeDivider />
        <InfoSection />
      </PageShell>
    </I18nProvider>
  ),
});
