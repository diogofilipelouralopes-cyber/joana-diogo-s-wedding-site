import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Loader2, Mail, Bot } from "lucide-react";

function safeNext(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  if (!value.startsWith("/") || value.startsWith("//")) return undefined;
  return value;
}

/**
 * Email sign-in kept ONLY for the MCP OAuth consent screen, which requires a
 * real backend auth session to approve an assistant. Human access to /admin
 * uses the access code at /admin/login.
 */
export const Route = createFileRoute("/admin/oauth-login")({
  validateSearch: (s: Record<string, unknown>): { next?: string } => {
    const next = safeNext(s.next);
    return next ? { next } : {};
  },
  head: () => ({
    meta: [
      { title: "Autorizar assistente · Joana & Diogo" },
      {
        name: "description",
        content: "Início de sessão usado para autorizar assistentes AI a ligarem-se ao site.",
      },
      { property: "og:title", content: "Autorizar assistente" },
      { property: "og:description", content: "Início de sessão para autorizar assistentes AI." },
      { property: "og:url", content: "https://joanaediogo-com.lovable.app/admin/oauth-login" },
      { name: "robots", content: "noindex,nofollow" },
    ],
    links: [
      { rel: "canonical", href: "https://joanaediogo-com.lovable.app/admin/oauth-login" },
    ],
  }),
  component: OAuthLoginPage,
});

function OAuthLoginPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      if (next) window.location.replace(next);
      else navigate({ to: "/admin" });
    });
  }, [navigate, next]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}${next ?? "/admin"}`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível enviar o link.");
      return;
    }
    setSent(true);
    toast.success("Link de acesso enviado para o teu email.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <Toaster position="top-center" />
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Bot className="w-6 h-6 text-primary mx-auto mb-3" strokeWidth={1.5} />
          <h1 className="font-display text-3xl text-primary">Autorizar assistente</h1>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-2">
            Joana &amp; Diogo
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 bg-card border border-border p-7">
          <p className="text-xs text-muted-foreground">
            Esta página serve apenas para autorizar assistentes AI. Para entrares no painel,
            usa o código de acesso.
          </p>
          <div>
            <Label
              htmlFor="email"
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSent(false);
              }}
              required
              className="mt-2"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Enviar link de acesso
              </>
            )}
          </Button>

          {sent && (
            <p className="text-[11px] text-center text-muted-foreground">
              Verifica o teu email (e a pasta de spam) e clica no link.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
