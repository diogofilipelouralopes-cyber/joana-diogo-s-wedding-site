import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Download,
  LogOut,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Music2,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Joana & Diogo" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminRouteComponent,
});

function AdminRouteComponent() {
  const location = useLocation();
  return location.pathname === "/admin" ? <AdminPage /> : <Outlet />;
}

interface Rsvp {
  id: string;
  name: string;
  phone: string | null;
  guests: number;
  attending: boolean;
  allergies: string | null;
  song_suggestion: string | null;
  created_at: string;
}

function AdminPage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [session, setSession] = useState<unknown>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      if (!s) {
        setIsAdmin(false);
        setAuthChecked(true);
      }
    });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setSession(null);
        setAuthChecked(true);
        navigate({ to: "/admin/login" });
        return;
      }
      const { data: isAllowed } = await supabase.rpc("has_role", {
        _user_id: data.session.user.id,
        _role: "admin",
      });
      if (!isAllowed) {
        await supabase.auth.signOut();
        toast.error("Sem permissões de administrador.");
        navigate({ to: "/" });
        return;
      }
      setSession(data.session);
      setIsAdmin(true);
      setAuthChecked(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Não foi possível carregar.");
        else setRsvps((data ?? []) as Rsvp[]);
        setLoading(false);
      });
  }, [isAdmin]);

  const filtered = useMemo(() => {
    return rsvps.filter((r) => {
      if (filter === "yes" && !r.attending) return false;
      if (filter === "no" && r.attending) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          r.name.toLowerCase().includes(s) ||
          (r.phone ?? "").toLowerCase().includes(s) ||
          (r.allergies ?? "").toLowerCase().includes(s) ||
          (r.song_suggestion ?? "").toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [rsvps, filter, search]);

  const stats = useMemo(() => {
    const yes = rsvps.filter((r) => r.attending);
    const no = rsvps.filter((r) => !r.attending);
    const totalGuests = yes.reduce((sum, r) => sum + (r.guests || 0), 0);
    return { yes: yes.length, no: no.length, total: rsvps.length, totalGuests };
  }, [rsvps]);

  function exportCSV() {
    const headers = [
      "Nome",
      "Telefone",
      "Vai",
      "Pessoas",
      "Alergias",
      "Música",
      "Submetido em",
    ];
    const rows = filtered.map((r) => [
      r.name,
      r.phone ?? "",
      r.attending ? "Sim" : "Não",
      String(r.guests),
      r.allergies ?? "",
      r.song_suggestion ?? "",
      new Date(r.created_at).toLocaleString("pt-PT"),
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            const c = cell.replace(/"/g, '""');
            return /[",\n;]/.test(c) ? `"${c}"` : c;
          })
          .join(";"),
      )
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <Toaster position="top-center" />
        <div className="max-w-md text-center">
          <h1 className="font-display text-4xl text-primary mb-3">Área restrita</h1>
          <p className="text-foreground/70 mb-6">É necessário iniciar sessão.</p>
          <Link
            to="/admin/login"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground uppercase tracking-[0.2em] text-sm"
          >
            Iniciar sessão
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <Toaster position="top-center" />
        <div className="max-w-md text-center">
          <h1 className="font-display text-4xl text-primary mb-3">Sem permissões</h1>
          <p className="text-foreground/70 mb-6">
            Esta conta não tem acesso de administrador.
          </p>
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Painel
            </p>
            <h1 className="font-display text-2xl text-primary">Respostas RSVP</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" /> CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Respostas" value={stats.total} icon={<Users className="w-5 h-5" />} />
          <StatCard
            label="Confirmados"
            value={stats.yes}
            icon={<CheckCircle2 className="w-5 h-5" />}
            tone="positive"
          />
          <StatCard
            label="Não vão"
            value={stats.no}
            icon={<XCircle className="w-5 h-5" />}
            tone="muted"
          />
          <StatCard
            label="Total pessoas"
            value={stats.totalGuests}
            icon={<Users className="w-5 h-5" />}
            tone="positive"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Procurar por nome, telefone, alergia, música..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1 border border-border bg-card p-1">
            {(["all", "yes", "no"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "Todos" : f === "yes" ? "Sim" : "Não"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">Sem respostas.</div>
        ) : (
          <div className="border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr className="text-left text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3 text-center">Vai</th>
                  <th className="px-4 py-3 text-center">Pessoas</th>
                  <th className="px-4 py-3">Alergias</th>
                  <th className="px-4 py-3">Música</th>
                  <th className="px-4 py-3">Quando</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-foreground/80">
                      {r.phone ? (
                        <a href={`tel:${r.phone}`} className="hover:text-primary">
                          {r.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {r.attending ? (
                        <span className="inline-flex items-center gap-1 text-primary">
                          <CheckCircle2 className="w-4 h-4" /> Sim
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <XCircle className="w-4 h-4" /> Não
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{r.guests}</td>
                    <td className="px-4 py-3 text-foreground/75 max-w-[200px] truncate">
                      {r.allergies || "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground/75 max-w-[220px] truncate">
                      {r.song_suggestion ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Music2 className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                          {r.song_suggestion}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString("pt-PT", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "default" | "positive" | "muted";
}) {
  return (
    <div className="bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <div
          className={
            tone === "positive"
              ? "text-primary"
              : tone === "muted"
                ? "text-muted-foreground"
                : "text-foreground/70"
          }
        >
          {icon}
        </div>
      </div>
      <p className="font-display text-4xl text-foreground">{value}</p>
    </div>
  );
}
