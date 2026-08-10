import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { MoreScreen } from "@/components/app/MoreScreen";

const SITE_URL = "https://joanaediogo.com";

export const Route = createFileRoute("/mais")({
  head: () => ({
    meta: [
      { title: "Mais · Mensagens, presentes e FAQ — Joana & Diogo" },
      {
        name: "description",
        content:
          "Livro de mensagens, lista de presentes (IBAN, Revolut, MB WAY), perguntas frequentes e contacto do casamento de Joana & Diogo.",
      },
      { property: "og:title", content: "Mais · Joana & Diogo" },
      { property: "og:description", content: "Mensagens, presentes, FAQ e contacto." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/mais" }],
  }),
  component: () => (
    <AppShell>
      <MoreScreen />
    </AppShell>
  ),
});
