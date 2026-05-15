import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturn,
  head: () => ({ meta: [{ title: "Obrigado — Joana & Diogo" }] }),
});

function CheckoutReturn() {
  const { session_id } = Route.useSearch();

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-secondary/40">
      <div className="card-gold max-w-lg w-full p-10 text-center">
        <Heart className="w-8 h-8 mx-auto text-primary mb-4" strokeWidth={1} />
        <h1 className="font-display text-3xl sm:text-4xl text-primary mb-4">
          {session_id ? "Obrigado do fundo do coração" : "Sem informação de pagamento"}
        </h1>
        <p className="text-foreground/75 mb-8 text-sm sm:text-base">
          {session_id
            ? "O vosso contributo para a nossa lua de mel chegou. Mal podemos esperar para vos abraçar no grande dia."
            : "Não conseguimos encontrar a sessão de pagamento."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary border border-primary/40 px-6 py-3 hover:bg-primary/5 rounded"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
