import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Inscrições fechadas · Joana & Diogo" },
      { name: "description", content: "As inscrições estão fechadas. Apenas administradores autorizados podem aceder." },
      { property: "og:title", content: "Inscrições fechadas · Joana & Diogo" },
      { property: "og:description", content: "As inscrições estão fechadas. Apenas administradores autorizados." },
      { property: "og:url", content: "https://joanaediogo-com.lovable.app/signup" },
      { name: "robots", content: "noindex,nofollow" },
    ],
    links: [{ rel: "canonical", href: "https://joanaediogo-com.lovable.app/signup" }],
  }),
  component: SignupClosedPage,
});

function SignupClosedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="max-w-md text-center">
        <Lock className="w-7 h-7 text-primary mx-auto mb-4" strokeWidth={1.5} />
        <h1 className="font-display text-3xl text-primary mb-3">Inscrições fechadas</h1>
        <p className="text-foreground/70 mb-8">
          Apenas administradores autorizados.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-primary text-primary-foreground uppercase tracking-[0.2em] text-xs"
        >
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}
