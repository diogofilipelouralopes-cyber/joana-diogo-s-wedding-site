import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { PageShell } from "@/components/PageShell";
import { RsvpSection } from "@/components/RsvpSection";

const SITE_URL = "https://joanaediogo.com";

export const Route = createFileRoute("/rsvp")({
  head: () => ({
    meta: [
      { title: "Confirmar presença · Joana & Diogo" },
      {
        name: "description",
        content:
          "Confirma a tua presença no casamento de Joana & Diogo, a 19 de setembro de 2026, e indica restrições alimentares e sugestões de música.",
      },
      { property: "og:title", content: "Confirmar presença · Joana & Diogo" },
      { property: "og:description", content: "Diz-nos se contamos contigo no dia 19 de setembro de 2026." },
      { property: "og:url", content: SITE_URL + "/rsvp" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/rsvp" }],
  }),
  component: () => (
    <I18nProvider>
      <PageShell>
        <RsvpSection />
      </PageShell>
    </I18nProvider>
  ),
});
