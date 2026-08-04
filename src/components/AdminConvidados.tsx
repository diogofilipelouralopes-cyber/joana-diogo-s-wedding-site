import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Search, Pencil, Users, Utensils } from "lucide-react";

export interface Guest {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  guests: number;
  attending: boolean;
  allergies: string | null;
  song_suggestion: string | null;
  message: string | null;
  family_group: string | null;
  table_number: string | null;
  accommodation: string | null;
  transport: string | null;
  internal_notes: string | null;
  created_at: string;
}

export const GUEST_COLUMNS =
  "id, name, email, phone, guests, attending, allergies, song_suggestion, message, family_group, table_number, accommodation, transport, internal_notes, created_at";

type Presence = "all" | "yes" | "no";

export function AdminConvidados() {
  const [rows, setRows] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [presence, setPresence] = useState<Presence>("all");
  const [onlyRestrictions, setOnlyRestrictions] = useState(false);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("rsvps")
      .select(GUEST_COLUMNS)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Não foi possível carregar os convidados.");
        else setRows((data ?? []) as unknown as Guest[]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (presence === "yes" && !r.attending) return false;
      if (presence === "no" && r.attending) return false;
      if (onlyRestrictions && !(r.allergies && r.allergies.trim())) return false;
      if (!s) return true;
      return (
        r.name.toLowerCase().includes(s) ||
        (r.email ?? "").toLowerCase().includes(s) ||
        (r.family_group ?? "").toLowerCase().includes(s)
      );
    });
  }, [rows, search, presence, onlyRestrictions]);

  async function save(draft: Guest) {
    setSaving(true);
    const { error } = await supabase
      .from("rsvps")
      .update({
        family_group: draft.family_group?.trim() || null,
        table_number: draft.table_number?.trim() || null,
        accommodation: draft.accommodation?.trim() || null,
        transport: draft.transport?.trim() || null,
        internal_notes: draft.internal_notes?.trim() || null,
      })
      .eq("id", draft.id);
    setSaving(false);
    if (error) {
      toast.error("Erro ao guardar.");
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === draft.id ? draft : r)));
    setEditing(null);
    toast.success("✅ Convidado atualizado");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, email ou grupo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {([
            { k: "all", l: "Todos" },
            { k: "yes", l: "Confirmados" },
            { k: "no", l: "Não vão" },
          ] as { k: Presence; l: string }[]).map((c) => (
            <Chip key={c.k} active={presence === c.k} onClick={() => setPresence(c.k)} label={c.l} />
          ))}
          <Chip
            active={onlyRestrictions}
            onClick={() => setOnlyRestrictions((v) => !v)}
            label="Com restrições"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">Sem convidados.</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto bg-card border border-border rounded-md">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Nome", "Contacto", "Pessoas", "Estado", "Grupo", "Mesa", "Alojamento", "Transporte", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-normal whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{r.name}</p>
                      {r.allergies && (
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Utensils className="w-3 h-3" /> {r.allergies}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      <p className="truncate max-w-[200px]">{r.email || "—"}</p>
                      <p className="text-[11px] text-muted-foreground">{r.phone || "—"}</p>
                    </td>
                    <td className="px-4 py-3">{r.guests}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{
                          background: r.attending ? "color-mix(in oklab, var(--primary) 12%, transparent)" : "var(--muted)",
                          color: r.attending ? "var(--primary)" : "var(--muted-foreground)",
                        }}
                      >
                        {r.attending ? "Confirmado" : "Não vai"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground/80">{r.family_group || "—"}</td>
                    <td className="px-4 py-3 text-foreground/80">{r.table_number || "—"}</td>
                    <td className="px-4 py-3 text-foreground/80">{r.accommodation || "—"}</td>
                    <td className="px-4 py-3 text-foreground/80">{r.transport || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditing(r)}
                        aria-label={`Editar ${r.name}`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-primary hover:scale-110 transition-all"
                      >
                        <Pencil size={16} strokeWidth={1.75} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-md p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg text-foreground">{r.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{r.email || "sem email"}</p>
                    <p className="text-xs text-muted-foreground">{r.phone || "sem telefone"}</p>
                  </div>
                  <button
                    onClick={() => setEditing(r)}
                    aria-label={`Editar ${r.name}`}
                    className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-primary"
                  >
                    <Pencil size={16} strokeWidth={1.75} />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/80">
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3 h-3" /> {r.guests}
                  </span>
                  <span>{r.attending ? "Confirmado" : "Não vai"}</span>
                  {r.family_group && <span>Grupo: {r.family_group}</span>}
                  {r.table_number && <span>Mesa: {r.table_number}</span>}
                  {r.accommodation && <span>Alojamento: {r.accommodation}</span>}
                  {r.transport && <span>Transporte: {r.transport}</span>}
                </div>
                {r.allergies && (
                  <p className="mt-2 text-xs text-muted-foreground flex items-start gap-1">
                    <Utensils className="w-3 h-3 mt-0.5" /> {r.allergies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {editing && (
        <EditGuestDialog guest={editing} saving={saving} onCancel={() => !saving && setEditing(null)} onSave={save} />
      )}
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-2 text-[11px] uppercase tracking-[0.14em] rounded-full border transition-all"
      style={{
        background: active ? "var(--primary)" : "transparent",
        color: active ? "var(--primary-foreground)" : "var(--muted-foreground)",
        borderColor: active ? "var(--primary)" : "var(--border)",
      }}
    >
      {label}
    </button>
  );
}

function EditGuestDialog({
  guest,
  saving,
  onCancel,
  onSave,
}: {
  guest: Guest;
  saving: boolean;
  onCancel: () => void;
  onSave: (g: Guest) => void;
}) {
  const [draft, setDraft] = useState<Guest>(guest);

  return (
    <Dialog open onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{guest.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Field label="Grupo / Família">
            <Input
              value={draft.family_group ?? ""}
              onChange={(e) => setDraft({ ...draft, family_group: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Mesa">
              <Input
                value={draft.table_number ?? ""}
                onChange={(e) => setDraft({ ...draft, table_number: e.target.value })}
              />
            </Field>
            <Field label="Transporte">
              <Input
                value={draft.transport ?? ""}
                onChange={(e) => setDraft({ ...draft, transport: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Alojamento">
            <Input
              value={draft.accommodation ?? ""}
              onChange={(e) => setDraft({ ...draft, accommodation: e.target.value })}
            />
          </Field>
          <Field label="Notas internas">
            <textarea
              value={draft.internal_notes ?? ""}
              onChange={(e) => setDraft({ ...draft, internal_notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={() => onSave(draft)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
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
