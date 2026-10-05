import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { AvisoSemRede } from "@/components/AvisoSemRede";
import { toast } from "sonner";
import { Loader2, LogOut, Home, Heart, MessageCircleHeart, Gift, Image as ImageIcon } from "lucide-react";
import { adminLogout } from "@/lib/admin-auth.functions";
import { AdminMensagens } from "@/components/AdminMensagens";
import { AdminVotos } from "@/components/AdminVotos";
import { AdminPrendas } from "@/components/AdminPrendas";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Livro de Memórias · Joana & Diogo" },
      { name: "description", content: "O livro privado de memórias da Joana e do Diogo." },
      { property: "og:title", content: "Livro de Memórias · Joana & Diogo" },
      { property: "og:description", content: "O livro privado de memórias da Joana e do Diogo." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminRouteComponent,
});

function AdminRouteComponent() {
  const location = useLocation();
  return location.pathname === "/admin" ? <AdminPage /> : <Outlet />;
}

type Tab = "votos" | "mensagens" | "prendas";

const SECCOES: { key: Tab; label: string; hint: string; icon: React.ReactNode }[] = [
  { key: "votos", label: "Votos e discursos", hint: "As nossas promessas e as palavras dos amigos", icon: <Heart className="w-5 h-5" strokeWidth={1.4} /> },
  { key: "mensagens", label: "Mensagens", hint: "O que os convidados nos escreveram", icon: <MessageCircleHeart className="w-5 h-5" strokeWidth={1.4} /> },
  { key: "prendas", label: "Prendas", hint: "Quem nos mimou e a quem já agradecemos", icon: <Gift className="w-5 h-5" strokeWidth={1.4} /> },
];

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("votos");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return navigate({ to: "/admin/login" });
      const { data: row, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) {
        toast.error("Não foi possível verificar as permissões. Tenta novamente.");
        setReady(true);
        return;
      }
      if (!row) {
        await supabase.auth.signOut();
        toast.error("Sem permissões.");
        return navigate({ to: "/" });
      }
      setReady(true);
    });
  }, []);

  async function logout() {
    await adminLogout();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const linkCls =
    "inline-flex items-center gap-1.5 px-3 py-2 text-[11px] uppercase tracking-[0.15em] rounded-full border border-border hover:border-primary hover:text-primary transition-colors";

  return (
    <div className="painel min-h-screen bg-background">
      <AvisoSemRede />
      <Toaster position="top-center" />

      <header className="section-cream border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 flex justify-end gap-2">
          <Link to="/" className={linkCls} title="Voltar ao site">
            <Home className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Site</span>
          </Link>
          <button onClick={logout} className={linkCls} title="Sair">
            <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-2">
            Só para nós · 19 de setembro de 2026
          </p>
          <h1 className="font-display text-4xl sm:text-6xl text-primary">Livro de Memórias</h1>
          <p className="mt-2 text-2xl" style={{ fontFamily: "Allura, cursive", color: "var(--gold)" }}>
            Joana &amp; Diogo
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <nav className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-8">
          {SECCOES.map((s) => {
            const active = tab === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setTab(s.key)}
                className="text-left p-3 sm:p-4 rounded-lg border transition-all"
                style={{
                  borderColor: active ? "var(--gold)" : "var(--border)",
                  background: active ? "var(--ivory)" : "transparent",
                  color: active ? "var(--olive)" : "var(--muted-foreground)",
                }}
              >
                {s.icon}
                <span className="block mt-2 text-[11px] uppercase tracking-[0.15em]">{s.label}</span>
                <span className="hidden sm:block text-xs mt-1 opacity-80">{s.hint}</span>
              </button>
            );
          })}
          <Link
            to="/admin/galeria"
            className="p-3 sm:p-4 rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all"
          >
            <ImageIcon className="w-5 h-5" strokeWidth={1.4} />
            <span className="block mt-2 text-[11px] uppercase tracking-[0.15em]">Fotografias</span>
            <span className="hidden sm:block text-xs mt-1 opacity-80">Os álbuns do nosso dia</span>
          </Link>
        </nav>

        {tab === "votos" && <AdminVotos />}
        {tab === "mensagens" && <AdminMensagens />}
        {tab === "prendas" && <AdminPrendas />}
      </main>
    </div>
  );
}
