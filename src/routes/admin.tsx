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
  Trash2,
  Pencil,
  MessageCircleHeart,
  Mail,
  Phone,
  Utensils,
  Inbox,
} from "lucide-react";
import { AdminMensagens } from "@/components/AdminMensagens";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  email: string | null;
  phone: string | null;
  guests: number;
  attending: boolean;
  allergies: string | null;
  song_suggestion: string | null;
  message: string | null;
  created_at: string;
}

type FilterKey = "all" | "yes" | "no" | "restrictions";

function AdminPage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [session, setSession] = useState<unknown>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<Rsvp | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [fadingIds, setFadingIds] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Rsvp | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"rsvps" | "mensagens">("rsvps");
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Fetch unread messages count for tab badge
  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from("mensagens")
      .select("id", { count: "exact", head: true })
      .eq("lida", false)
      .then(({ count }) => setUnreadCount(count ?? 0));
  }, [isAdmin, tab]);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s) {
      toast.error("Sessão expirada.");
      setDeleting(false);
      return;
    }
    const target = toDelete;
    const { error } = await supabase.from("rsvps").delete().eq("id", target.id);
    setDeleting(false);
    if (error) {
      toast.error("Erro ao eliminar. Tenta novamente.");
      return;
    }
    setToDelete(null);
    setFadingIds((prev) => new Set(prev).add(target.id));
    toast.success(`✅ RSVP de ${target.name} eliminado`);
    setTimeout(() => {
      setRsvps((prev) => prev.filter((r) => r.id !== target.id));
      setFadingIds((prev) => {
        const n = new Set(prev);
        n.delete(target.id);
        return n;
      });
    }, 300);
  }

  async function saveEdit(updated: Rsvp) {
    setSaving(true);
    const { error } = await supabase
      .from("rsvps")
      .update({
        name: updated.name.trim(),
        email: updated.email?.trim() || null,
        phone: updated.phone?.trim() || null,
        guests: updated.guests,
        attending: updated.attending,
        allergies: updated.allergies?.trim() || null,
        song_suggestion: updated.song_suggestion?.trim() || null,
        message: updated.message?.trim() || null,
      })
      .eq("id", updated.id);
    setSaving(false);
    if (error) {
      toast.error("Erro ao guardar. Tenta novamente.");
      return;
    }
    setRsvps((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditing(null);
    toast.success("✅ RSVP atualizado");
  }

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

  const counts = useMemo(() => {
    const yes = rsvps.filter((r) => r.attending).length;
    const no = rsvps.filter((r) => !r.attending).length;
    const restrictions = rsvps.filter((r) => r.allergies && r.allergies.trim()).length;
    return { all: rsvps.length, yes, no, restrictions };
  }, [rsvps]);

  const filtered = useMemo(() => {
    return rsvps.filter((r) => {
      if (filter === "yes" && !r.attending) return false;
      if (filter === "no" && r.attending) return false;
      if (filter === "restrictions" && !(r.allergies && r.allergies.trim())) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          r.name.toLowerCase().includes(s) ||
          (r.email ?? "").toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [rsvps, filter, search]);

  const stats = useMemo(() => {
    const yes = rsvps.filter((r) => r.attending);
    const totalGuests = yes.reduce((sum, r) => sum + (r.guests || 0), 0);
    return { yes: yes.length, no: rsvps.length - yes.length, total: rsvps.length, totalGuests };
  }, [rsvps]);

  function exportCSV() {
    const headers = [
      "Nome",
      "Email",
      "Telefone",
      "Vai",
      "Pessoas",
      "Restrições",
      "Música",
      "Mensagem",
      "Submetido em",
    ];
    const rows = filtered.map((r) => [
      r.name,
      r.email ?? "",
      r.phone ?? "",
      r.attending ? "Sim" : "Não",
      String(r.guests),
      r.allergies ?? "",
      r.song_suggestion ?? "",
      r.message ?? "",
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
    a.download = `rsvp-casamento-${new Date().toISOString().slice(0, 10)}.csv`;
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

  const filterChips: { key: FilterKey; label: string; count: number; activeBg: string; activeText: string }[] = [
    { key: "all", label: "Todos", count: counts.all, activeBg: "var(--primary)", activeText: "var(--primary-foreground)" },
    { key: "yes", label: "Sim", count: counts.yes, activeBg: "var(--olive, #6B7A4F)", activeText: "#fff" },
    { key: "no", label: "Não", count: counts.no, activeBg: "#B85C5C", activeText: "#fff" },
    { key: "restrictions", label: "Com restrições", count: counts.restrictions, activeBg: "var(--gold, #C9A961)", activeText: "#fff" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Painel
            </p>
            <h1 className="font-display text-2xl text-primary">
              {tab === "rsvps" ? "Respostas RSVP" : "Mensagens"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 -mb-px">
            <TabButton
              active={tab === "rsvps"}
              onClick={() => setTab("rsvps")}
              icon={<Users className="w-4 h-4" />}
              label="RSVPs"
            />
            <TabButton
              active={tab === "mensagens"}
              onClick={() => setTab("mensagens")}
              icon={<MessageCircleHeart className="w-4 h-4" />}
              label="Mensagens"
              badge={unreadCount > 0 ? unreadCount : undefined}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {tab === "mensagens" ? (
          <AdminMensagens />
        ) : (
        <>
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

        {/* Total counter line */}
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-medium text-foreground">{stats.total}</span> RSVPs no total ·{" "}
          <span className="text-primary font-medium">{stats.yes}</span> confirmados ·{" "}
          <span className="font-medium">{stats.no}</span> não vêm
        </p>

        {/* Filters + search + export */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="flex flex-wrap gap-2">
            {filterChips.map((c) => {
              const active = filter === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setFilter(c.key)}
                  className="px-4 py-2 text-xs uppercase tracking-[0.15em] rounded-full border transition-all"
                  style={{
                    background: active ? c.activeBg : "transparent",
                    color: active ? c.activeText : "var(--muted-foreground)",
                    borderColor: active ? c.activeBg : "var(--border)",
                  }}
                >
                  {c.label} ({c.count})
                </button>
              );
            })}
          </div>
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" /> Exportar para CSV
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">Sem respostas.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div
                key={r.id}
                className={`bg-card border border-border rounded-md p-5 transition-opacity duration-300 ${
                  fadingIds.has(r.id) ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-display text-lg text-foreground">{r.name}</h3>
                      {r.attending ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Vai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          <XCircle className="w-3.5 h-3.5" /> Não vai
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5" /> {r.guests} {r.guests === 1 ? "pessoa" : "pessoas"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      {r.email && (
                        <div className="flex items-center gap-2 text-foreground/80 min-w-0">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <a href={`mailto:${r.email}`} className="hover:text-primary truncate">{r.email}</a>
                        </div>
                      )}
                      {r.phone && (
                        <div className="flex items-center gap-2 text-foreground/80">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <a href={`tel:${r.phone}`} className="hover:text-primary">{r.phone}</a>
                        </div>
                      )}
                      {r.allergies && (
                        <div className="flex items-start gap-2 text-foreground/80 sm:col-span-2">
                          <Utensils className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                          <span>{r.allergies}</span>
                        </div>
                      )}
                      {r.song_suggestion && (
                        <div className="flex items-start gap-2 text-foreground/80 sm:col-span-2">
                          <Music2 className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                          <span>{r.song_suggestion}</span>
                        </div>
                      )}
                    </div>

                    {/* Message card */}
                    {r.message && r.message.trim() && (
                      <div
                        className="mt-3 flex items-start gap-3 p-3 rounded-md"
                        style={{
                          background: "color-mix(in oklab, var(--gold, #C9A961) 8%, transparent)",
                          border: "1px solid color-mix(in oklab, var(--gold, #C9A961) 50%, transparent)",
                        }}
                      >
                        <MessageCircleHeart
                          className="w-5 h-5 shrink-0 mt-0.5"
                          style={{ color: "var(--gold, #C9A961)" }}
                        />
                        <p
                          className="text-sm italic leading-relaxed"
                          style={{ color: "var(--olive, #6B7A4F)" }}
                        >
                          {r.message}
                        </p>
                      </div>
                    )}

                    <p className="text-[11px] text-muted-foreground mt-2">
                      {new Date(r.created_at).toLocaleString("pt-PT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-center gap-1 shrink-0">
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => setEditing(r)}
                            aria-label={`Editar RSVP de ${r.name}`}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-[#9CA3AF] hover:text-[var(--olive,#6B7A4F)] hover:scale-110 transition-all cursor-pointer"
                          >
                            <Pencil size={18} strokeWidth={1.75} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Editar este RSVP</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => setToDelete(r)}
                            aria-label={`Eliminar RSVP de ${r.name}`}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-[#9CA3AF] hover:text-[#B85C5C] hover:scale-110 transition-all cursor-pointer"
                          >
                            <Trash2 size={18} strokeWidth={1.75} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Eliminar este RSVP</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        )}
      </main>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && !deleting && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar RSVP?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                {toDelete && (
                  <div className="bg-muted/50 border border-border p-3 text-sm text-foreground space-y-1">
                    <p><span className="text-muted-foreground">Nome:</span> <strong>{toDelete.name}</strong></p>
                    <p><span className="text-muted-foreground">Email:</span> {toDelete.email || "—"}</p>
                    <p><span className="text-muted-foreground">Presença:</span> {toDelete.attending ? "Sim" : "Não"}</p>
                    <p><span className="text-muted-foreground">Pessoas:</span> {toDelete.guests}</p>
                  </div>
                )}
                <p className="text-[#B85C5C] font-medium">Esta ação é irreversível.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); confirmDelete(); }}
              disabled={deleting}
              className="bg-transparent border border-[#B85C5C] text-[#B85C5C] hover:bg-[#B85C5C] hover:text-white"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editing && (
        <EditRsvpDialog
          rsvp={editing}
          saving={saving}
          onCancel={() => !saving && setEditing(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}

function EditRsvpDialog({
  rsvp,
  saving,
  onCancel,
  onSave,
}: {
  rsvp: Rsvp;
  saving: boolean;
  onCancel: () => void;
  onSave: (r: Rsvp) => void;
}) {
  const [draft, setDraft] = useState<Rsvp>(rsvp);

  return (
    <Dialog open onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar RSVP</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Field label="Nome">
            <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input type="email" value={draft.email ?? ""} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          </Field>
          <Field label="Telefone">
            <Input value={draft.phone ?? ""} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Pessoas">
              <Input
                type="number"
                min={1}
                max={10}
                value={draft.guests}
                onChange={(e) => setDraft({ ...draft, guests: Math.max(1, Number(e.target.value) || 1) })}
              />
            </Field>
            <Field label="Presença">
              <select
                value={draft.attending ? "yes" : "no"}
                onChange={(e) => setDraft({ ...draft, attending: e.target.value === "yes" })}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="yes">Sim, vai</option>
                <option value="no">Não vai</option>
              </select>
            </Field>
          </div>
          <Field label="Restrições alimentares">
            <textarea
              value={draft.allergies ?? ""}
              onChange={(e) => setDraft({ ...draft, allergies: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
            />
          </Field>
          <Field label="Música favorita">
            <Input value={draft.song_suggestion ?? ""} onChange={(e) => setDraft({ ...draft, song_suggestion: e.target.value })} />
          </Field>
          <Field label="Mensagem para os noivos">
            <textarea
              value={draft.message ?? ""}
              onChange={(e) => setDraft({ ...draft, message: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={saving}>Cancelar</Button>
          <Button onClick={() => onSave(draft)} disabled={saving || !draft.name.trim()}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{label}</label>
      {children}
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
