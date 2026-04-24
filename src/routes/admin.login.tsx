import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Loader2, Heart } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Login · Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [loading, setLoading] = useState(false);
  const friendlyAuthError = (message: string) => {
    if (message.toLowerCase().includes("weak") || message.toLowerCase().includes("pwned")) {
      return "Esta palavra-passe foi recusada por segurança. Escolhe uma nova, forte e única, que nunca tenhas usado noutros sites.";
    }
    if (message.toLowerCase().includes("invalid login credentials")) {
      return "Conta ainda não criada ou palavra-passe incorreta. Se ainda não criaste conta, usa o modo Criar conta.";
    }
    return message;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        toast.error(friendlyAuthError(error.message));
        return;
      }
      navigate({ to: "/admin" });
    } else {
      const redirectUrl = `${window.location.origin}/admin`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
      });
      setLoading(false);
      if (error) {
        toast.error(friendlyAuthError(error.message));
        return;
      }
      toast.success("Conta criada. A entrar no painel...");
      navigate({ to: "/admin" });
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
            <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Palavra-passe
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-2"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "login" ? "Entrar" : "Criar conta"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
            className="w-full"
          >
            {mode === "login" ? "Criar nova conta" : "Já tenho conta — entrar"}
          </Button>
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
