import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Mail, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { adminSessionStatus } from "@/lib/admin-auth.functions";
import { listEmails, previewEmail, saveEmail } from "@/lib/email-content.functions";

export const Route = createFileRoute("/admin/emails")({
  head: () => ({
    meta: [
      { title: "Emails · Admin" },
      { name: "description", content: "Editar assunto e conteúdo dos emails automáticos." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminEmailsPage,
});

interface Detail {
  label: string;
  value: string;
}

interface EmailRow {
  key: string;
  display_name: string;
  subject: string;
  preheader: string;
  greeting: string;
  body: string;
  details: Detail[];
  button_label: string;
  button_url: string;
  signature: string;
}

function AdminEmailsPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [emails, setEmails] = useState<EmailRow[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<EmailRow | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await adminSessionStatus();
      if (!status.authenticated) {
        navigate({ to: "/admin/login" });
        return;
      }
      try {
        const { emails: rows } = await listEmails();
        setEmails(rows as EmailRow[]);
        setSelectedKey(rows[0]?.key ?? null);
        setDraft((rows[0] as EmailRow) ?? null);
      } catch {
        toast.error("Não foi possível carregar os emails.");
      }
      setChecking(false);
    })();
  }, [navigate]);

  const refreshPreview = useCallback(async (row: EmailRow) => {
    setLoadingPreview(true);
    try {
      const result = await previewEmail({ data: row });
      setPreview(result.html);
    } catch {
      setPreview("");
    }
    setLoadingPreview(false);
  }, []);

  useEffect(() => {
    if (!draft) return;
    const id = setTimeout(() => void refreshPreview(draft), 400);
    return () => clearTimeout(id);
  }, [draft, refreshPreview]);

  const select = (row: EmailRow) => {
    setSelectedKey(row.key);
    setDraft(row);
  };

  const update = (patch: Partial<EmailRow>) =>
    setDraft((d) => (d ? { ...d, ...patch } : d));

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      await saveEmail({ data: draft });
      setEmails((list) => list.map((e) => (e.key === draft.key ? draft : e)));
      toast.success("Email guardado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível guardar.");
    }
    setSaving(false);
  };

  const previewSrc = useMemo(() => preview, [preview]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="painel min-h-screen bg-background px-4 py-8 md:px-8">
      <Toaster />
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              to="/admin"
              className="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar ao painel
            </Link>
            <h1 className="flex items-center gap-2 text-2xl font-semibold">
              <Mail className="h-5 w-5" /> Emails
            </h1>
            <p className="text-sm text-muted-foreground">
              Edita o assunto e o conteúdo de cada email automático. Usa{" "}
              <code className="rounded bg-muted px-1">{"{{nome}}"}</code> para o nome do convidado.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving || !draft}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar
          </Button>
        </div>

        <div className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {emails.map((row) => {
            const active = row.key === selectedKey;
            return (
              <button
                key={row.key}
                type="button"
                onClick={() => select(row)}
                aria-pressed={active}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <span className="block text-sm font-medium">
                  {row.display_name || row.key}
                </span>
                <span className="mt-1 block truncate text-xs text-muted-foreground">
                  {row.subject}
                </span>
              </button>
            );
          })}
        </div>

        {draft && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  value={draft.subject}
                  onChange={(e) => update({ subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preheader">Pré-visualização (texto curto no topo)</Label>
                <Input
                  id="preheader"
                  value={draft.preheader}
                  onChange={(e) => update({ preheader: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="greeting">Saudação</Label>
                <Input
                  id="greeting"
                  value={draft.greeting}
                  onChange={(e) => update({ greeting: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Conteúdo (linha em branco = novo parágrafo)</Label>
                <Textarea
                  id="body"
                  rows={8}
                  value={draft.body}
                  onChange={(e) => update({ body: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Detalhes (Local, Hora, Dress code…)</Label>
                {draft.details.map((d, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      className="w-40"
                      placeholder="Título"
                      value={d.label}
                      onChange={(e) =>
                        update({
                          details: draft.details.map((x, j) =>
                            j === i ? { ...x, label: e.target.value } : x,
                          ),
                        })
                      }
                    />
                    <Input
                      placeholder="Texto"
                      value={d.value}
                      onChange={(e) =>
                        update({
                          details: draft.details.map((x, j) =>
                            j === i ? { ...x, value: e.target.value } : x,
                          ),
                        })
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        update({ details: draft.details.filter((_, j) => j !== i) })
                      }
                      aria-label="Remover detalhe"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => update({ details: [...draft.details, { label: "", value: "" }] })}
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar detalhe
                </Button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="btn-label">Texto do botão</Label>
                  <Input
                    id="btn-label"
                    value={draft.button_label}
                    onChange={(e) => update({ button_label: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="btn-url">Link do botão</Label>
                  <Input
                    id="btn-url"
                    value={draft.button_url}
                    onChange={(e) => update({ button_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature">Assinatura</Label>
                <Input
                  id="signature"
                  value={draft.signature}
                  onChange={(e) => update({ signature: e.target.value })}
                />
              </div>
            </div>

            <div className="rounded-lg border">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <span className="text-sm font-medium">Pré-visualização</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => draft && void refreshPreview(draft)}
                  disabled={loadingPreview}
                >
                  {loadingPreview ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <iframe
                title="Pré-visualização do email"
                srcDoc={previewSrc}
                className="h-[720px] w-full rounded-b-lg bg-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
