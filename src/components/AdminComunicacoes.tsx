import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { sendOneMonthEmails } from "@/lib/communications.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
  Loader2,
  Mail,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Images,
  ExternalLink,
} from "lucide-react";

interface CommGuest {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  attending: boolean;
}

interface CommRow {
  guest_id: string;
  type: string;
  status: string;
  sent_at: string | null;
}

const WHATSAPP_MESSAGE = (name: string) =>
  `Olá ${name}! Falta apenas 1 semana para o casamento da Joana & Diogo. Toda a informação está em https://joanaediogo-com.lovable.app — até já! ❤️`;

export function AdminComunicacoes() {
  const [guests, setGuests] = useState<CommGuest[]>([]);
  const [comms, setComms] = useState<CommRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [photosUrl, setPhotosUrl] = useState("");
  const [savingUrl, setSavingUrl] = useState(false);
  const [showWhats, setShowWhats] = useState(false);

  const send = useServerFn(sendOneMonthEmails);

  async function loadComms() {
    const { data } = await supabase
      .from("guest_communications")
      .select("guest_id, type, status, sent_at");
    setComms((data ?? []) as CommRow[]);
  }

  useEffect(() => {
    Promise.all([
      supabase.from("rsvps").select("id, name, email, phone, attending"),
      supabase.from("guest_communications").select("guest_id, type, status, sent_at"),
      supabase.from("site_settings").select("value").eq("key", "google_photos_url").maybeSingle(),
    ]).then(([g, c, s]) => {
      setGuests((g.data ?? []) as CommGuest[]);
      setComms((c.data ?? []) as CommRow[]);
      setPhotosUrl(s.data?.value ?? "");
      setLoading(false);
    });
  }, []);

  const sentEmails = useMemo(
    () =>
      new Set(
        comms
          .filter((c) => c.type === "email_1_month" && c.status === "sent")
          .map((c) => c.guest_id),
      ),
    [comms],
  );
  const sentWhats = useMemo(
    () =>
      new Set(
        comms
          .filter((c) => c.type === "whatsapp_1_week" && c.status === "sent")
          .map((c) => c.guest_id),
      ),
    [comms],
  );

  const eligible = useMemo(
    () => guests.filter((g) => g.attending && g.email && g.email.includes("@")),
    [guests],
  );
  const pending = useMemo(
    () => eligible.filter((g) => !sentEmails.has(g.id)),
    [eligible, sentEmails],
  );

  const whatsTargets = useMemo(
    () => guests.filter((g) => g.attending && g.phone && g.phone.trim().length >= 6),
    [guests],
  );

  async function handleSend() {
    setConfirmOpen(false);
    setSending(true);
    try {
      const { results } = await send({ data: { guestIds: pending.map((g) => g.id) } });
      const ok = results.filter((r) => r.status === "sent").length;
      const failed = results.filter((r) => r.status === "failed");
      const skipped = results.filter((r) => r.status === "skipped").length;
      if (ok) toast.success(`✅ ${ok} email(s) enviado(s)`);
      if (skipped) toast.info(`${skipped} ignorado(s)`);
      if (failed.length) toast.error(`${failed.length} falharam: ${failed[0]?.reason ?? ""}`);
      await loadComms();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar emails.");
    } finally {
      setSending(false);
    }
  }

  async function markWhatsSent(guestId: string) {
    const { error } = await supabase.from("guest_communications").insert({
      guest_id: guestId,
      type: "whatsapp_1_week",
      status: "sent",
      sent_at: new Date().toISOString(),
    });
    if (error) {
      toast.error("Não foi possível registar o envio.");
      return;
    }
    await loadComms();
  }

  async function savePhotosUrl() {
    setSavingUrl(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "google_photos_url", value: photosUrl.trim() }, { onConflict: "key" });
    setSavingUrl(false);
    if (error) toast.error("Erro ao guardar o link.");
    else toast.success("✅ Link do álbum guardado");
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campaign: email */}
      <section className="bg-card border border-border rounded-md p-6">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <h3 className="font-display text-xl text-foreground">Email — 1 mês antes</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Enviado apenas a convidados confirmados com email válido.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <Stat label="Elegíveis" value={eligible.length} />
          <Stat label="Já enviados" value={eligible.length - pending.length} />
          <Stat label="Por enviar" value={pending.length} />
        </div>

        <Button
          className="mt-5 w-full sm:w-auto"
          disabled={sending || pending.length === 0}
          onClick={() => setConfirmOpen(true)}
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Mail className="w-4 h-4 mr-2" />
          )}
          Enviar email 1 mês antes
        </Button>
        {pending.length === 0 && (
          <p className="text-xs text-muted-foreground mt-3">
            Todos os convidados elegíveis já receberam esta comunicação.
          </p>
        )}

        <ul className="mt-5 divide-y divide-border/60">
          {eligible.map((g) => (
            <li key={g.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <div className="min-w-0">
                <p className="text-foreground truncate">{g.name}</p>
                <p className="text-xs text-muted-foreground truncate">{g.email}</p>
              </div>
              {sentEmails.has(g.id) ? (
                <span className="inline-flex items-center gap-1 text-xs text-primary shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enviado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <XCircle className="w-3.5 h-3.5" /> Pendente
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Campaign: WhatsApp */}
      <section className="bg-card border border-border rounded-md p-6">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <h3 className="font-display text-xl text-foreground">WhatsApp — 1 semana antes</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Gera os links; o envio é feito manualmente por ti.
            </p>
          </div>
        </div>

        <Button variant="outline" className="mt-5" onClick={() => setShowWhats((v) => !v)}>
          {showWhats ? "Ocultar" : `Gerar WhatsApps (${whatsTargets.length})`}
        </Button>

        {showWhats && (
          <ul className="mt-5 divide-y divide-border/60">
            {whatsTargets.map((g) => {
              const number = (g.phone ?? "").replace(/[^0-9]/g, "");
              const href = `https://wa.me/${number}?text=${encodeURIComponent(WHATSAPP_MESSAGE(g.name.split(" ")[0] ?? g.name))}`;
              return (
                <li key={g.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="text-foreground truncate">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.phone}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {sentWhats.has(g.id) && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => !sentWhats.has(g.id) && markWhatsSent(g.id)}
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-primary hover:underline"
                    >
                      Abrir <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Album */}
      <section className="bg-card border border-border rounded-md p-6">
        <div className="flex items-start gap-3">
          <Images className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <h3 className="font-display text-xl text-foreground">Álbum Google Fotos</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Link partilhado do álbum do casamento.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Input
            value={photosUrl}
            onChange={(e) => setPhotosUrl(e.target.value)}
            placeholder="https://photos.app.goo.gl/..."
          />
          <Button onClick={savePhotosUrl} disabled={savingUrl}>
            {savingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
          </Button>
        </div>
      </section>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar envio</AlertDialogTitle>
            <AlertDialogDescription>
              Vão ser enviados {pending.length} emails para convidados confirmados com email válido.
              Convidados que já receberam esta comunicação são ignorados. Esta ação não pode ser
              revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSend}>
              Enviar {pending.length} emails
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center py-3 rounded-md bg-muted/50">
      <p className="font-display text-2xl text-foreground">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
