import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { PageShell } from "@/components/PageShell";
import { StorySection } from "@/components/StorySection";
import { FaqSection } from "@/components/FaqSection";
import { MessagesSection } from "@/components/MessagesSection";
import { GiftsSection } from "@/components/GiftsSection";
import { ThankYouSection } from "@/components/ThankYouSection";
import { DecorativeDivider } from "@/components/DecorativeDivider";

const SITE_URL = "https://joanaediogo.com";

export const Route = createFileRoute("/mais")({
  head: () => ({
    meta: [
      { title: "Mais · História, FAQ e Presentes — Joana & Diogo" },
      {
        name: "description",
        content:
          "A nossa história, perguntas frequentes, livro de mensagens e informação sobre presentes para o casamento de Joana & Diogo.",
      },
      { property: "og:title", content: "Mais · Joana & Diogo" },
      { property: "og:description", content: "História, FAQ, mensagens e presentes." },
      { property: "og:url", content: SITE_URL + "/mais" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/mais" }],
  }),
  component: () => (
    <I18nProvider>
      <PageShell>
        <StorySection />
        <DecorativeDivider />
        <FaqSection />
        <DecorativeDivider />
        <MessagesSection />
        <DecorativeDivider />
        <GiftsSection />
        <DecorativeDivider />
        <ThankYouSection />
      </PageShell>
    </I18nProvider>
  ),
});
