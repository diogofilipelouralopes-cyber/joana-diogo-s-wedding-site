import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PlaceScreen } from "@/components/app/PlaceScreen";

const SITE_URL = "https://joanaediogo.com";

export const Route = createFileRoute("/local")({
  head: () => ({
    meta: [
      { title: "Local · Glicínia Wedding House — Joana & Diogo" },
      {
        name: "description",
        content:
          "Como chegar à Glicínia Wedding House em Freamunde: mapa, distâncias, estacionamento gratuito, alojamento e dress code.",
      },
      { property: "og:title", content: "Local · Glicínia Wedding House" },
      { property: "og:description", content: "Mapa, como chegar, alojamento e dress code." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/local" }],
  }),
  component: () => (
    <AppShell>
      <PlaceScreen />
    </AppShell>
  ),
});
