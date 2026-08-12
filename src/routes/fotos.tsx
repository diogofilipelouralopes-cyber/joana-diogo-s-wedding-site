import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { PageShell } from "@/components/PageShell";
import { MemoriesSection } from "@/components/MemoriesSection";
import { PublicGallerySection } from "@/components/PublicGallerySection";
import { DecorativeDivider } from "@/components/DecorativeDivider";

const SITE_URL = "https://joanaediogo.com";

export const Route = createFileRoute("/fotos")({
  head: () => ({
    meta: [
      { title: "Fotos · Joana & Diogo" },
      {
        name: "description",
        content:
          "Álbum partilhado e galeria de fotografias do casamento de Joana & Diogo. Partilha as tuas fotos connosco.",
      },
      { property: "og:title", content: "Fotos · Joana & Diogo" },
      { property: "og:description", content: "Álbum partilhado e galeria de fotografias do nosso casamento." },
      { property: "og:url", content: SITE_URL + "/fotos" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/fotos" }],
  }),
  component: () => (
    <I18nProvider>
      <PageShell>
        <MemoriesSection />
        <DecorativeDivider />
        <PublicGallerySection />
      </PageShell>
    </I18nProvider>
  ),
});
