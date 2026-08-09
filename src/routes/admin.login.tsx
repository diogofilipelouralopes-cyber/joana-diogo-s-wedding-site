import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Loader2, Heart, Mail } from "lucide-react";

function safeNext(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  // Only same-origin relative paths are allowed.
  if (!value.startsWith("/") || value.startsWith("//")) return undefined;
  return value;
}

export const Route = createFileRoute("/admin/login")({
  validateSearch: (s: Record<string, unknown>) => ({ next: safeNext(s.next) }),
  head: () => ({
    meta: [
      { title: "Login · Admin · Joana & Diogo" },
      { name: "description", content: "Acesso restrito ao painel de administração do casamento de Joana e Diogo." },
      { property: "og:title", content: "Login · Admin" },
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("magic");
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

    if (mode === "magic") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });
      setLoading(false);
      if (error) {
        toast.error("Não foi possível enviar o link. Verifica o email.");
        return;
      }
      setSent(true);
      toast.success("Link de acesso enviado para o teu email.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Credenciais inválidas.");
      return;
    }
    navigate({ to: "/admin" });
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
            <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
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

          {mode === "password" && (
            <div>
              <Label htmlFor="password" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Palavra-passe
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
              />
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "magic" ? (
              <>
                <Mail className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Enviar link de acesso
              </>
            ) : (
              "Entrar"
            )}
          </Button>

          {sent && mode === "magic" && (
            <p className="text-[11px] text-center text-muted-foreground">
              Verifica o teu email (e a pasta de spam) e clica no link para entrar.
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              setMode(mode === "magic" ? "password" : "magic");
              setSent(false);
            }}
            className="w-full text-[11px] text-center text-muted-foreground hover:text-primary uppercase tracking-[0.15em]"
          >
            {mode === "magic" ? "Entrar com palavra-passe" : "Entrar com link por email"}
          </button>

          <p className="text-[11px] text-center text-muted-foreground uppercase tracking-[0.15em]">
            Inscrições fechadas · acesso restrito
          </p>
        </form>


        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary">
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}
