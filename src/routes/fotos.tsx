import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PhotosScreen } from "@/components/app/PhotosScreen";

const SITE_URL = "https://joanaediogo.com";

export const Route = createFileRoute("/fotos")({
  head: () => ({
    meta: [
      { title: "Fotografias · Joana & Diogo" },
      {
        name: "description",
        content:
          "O álbum oficial do casamento de Joana & Diogo. Vê as fotografias partilhadas e adiciona as tuas.",
      },
      { property: "og:title", content: "Fotografias · Joana & Diogo" },
      { property: "og:description", content: "Vê e partilha as fotografias do nosso dia." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/fotos" }],
  }),
  component: () => (
    <AppShell>
      <PhotosScreen />
    </AppShell>
  ),
});
