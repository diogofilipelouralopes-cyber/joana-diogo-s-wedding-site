import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { RsvpWizard } from "@/components/app/RsvpWizard";

const SITE_URL = "https://joanaediogo.com";

export const Route = createFileRoute("/rsvp")({
  head: () => ({
    meta: [
      { title: "Confirmar presença · Joana & Diogo" },
      {
        name: "description",
        content:
          "Confirma a tua presença no casamento de Joana & Diogo a 19 de setembro de 2026. Responde até 1 de agosto de 2026.",
      },
      { property: "og:title", content: "Confirmar presença · Joana & Diogo" },
      { property: "og:description", content: "Responde ao nosso convite em quatro passos simples." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/rsvp" }],
  }),
  component: () => (
    <AppShell>
      <RsvpWizard />
    </AppShell>
  ),
});
