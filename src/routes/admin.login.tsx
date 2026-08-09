import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { adminCodeLogin } from "@/lib/admin-auth.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Loader2, Heart, KeyRound } from "lucide-react";

function safeNext(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  if (!value.startsWith("/") || value.startsWith("//")) return undefined;
  return value;
}

export const Route = createFileRoute("/admin/login")({
  validateSearch: (s: Record<string, unknown>): { next?: string } => {
    const next = safeNext(s.next);
    return next ? { next } : {};
  },
  head: () => ({
    meta: [
      { title: "Acesso · Admin · Joana & Diogo" },
      {
        name: "description",
        content: "Acesso restrito ao painel de administração do casamento de Joana e Diogo.",
      },
      { property: "og:title", content: "Acesso · Admin" },
      { property: "og:description", content: "Acesso restrito ao painel de administração." },
      { property: "og:url", content: "https://joanaediogo-com.lovable.app/admin/login" },
      { name: "robots", content: "noindex,nofollow" },
    ],
    links: [{ rel: "canonical", href: "https://joanaediogo-com.lovable.app/admin/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const login = useServerFn(adminCodeLogin);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await login({ data: { code } });
      if (!result.ok) {
        setError("Código inválido.");
        setCode("");
        setLoading(false);
        return;
      }
      await supabase.auth.setSession(result.tokens);
      if (next) window.location.replace(next);
      else navigate({ to: "/admin" });
    } catch {
      setError("Código inválido.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <Toaster position="top-center" />
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Heart className="w-6 h-6 text-primary mx-auto mb-3" strokeWidth={1.5} />
          <h1 className="font-display text-3xl text-primary">Painel de gestão</h1>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-2">
            Joana &amp; Diogo
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 bg-card border border-border p-7">
          <div>
            <Label
              htmlFor="code"
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              Código de acesso
            </Label>
            <Input
              id="code"
              type="password"
              inputMode="text"
              autoComplete="off"
              autoFocus
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              required
              className="mt-2 tracking-widest"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-destructive text-center">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading || !code} className="w-full">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <KeyRound className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Entrar
              </>
            )}
          </Button>

          <p className="text-[11px] text-center text-muted-foreground">
            Acesso reservado aos noivos.
          </p>
        </form>
      </div>
    </div>
  );
}
