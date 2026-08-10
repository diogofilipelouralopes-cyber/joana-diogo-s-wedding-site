import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  MessageCircleHeart,
  Gift,
  HelpCircle,
  Phone,
  Lock,
  ChevronDown,
  Copy,
  Heart,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Card, Label, Script, Ornament } from "@/components/app/kit";
import { useApp } from "@/lib/app-copy";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const IBAN_PT = "PT50 0035 0836 0068 8932 0308 1";
const IBAN_REV = "BE66 6502 5539 2943";
const MBWAY = "+351 912 633 104";
const WHATSAPP = "https://wa.me/351912633104";

function Section({
  id,
  icon,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card padded={false} className="overflow-hidden">
      <button type="button" className="app-row" onClick={onToggle} aria-expanded={open} aria-controls={id}>
        <span className="app-row-icon">{icon}</span>
        <span className="app-row-title">{title}</span>
        <ChevronDown size={16} strokeWidth={1.3} className="app-row-chevron" data-open={open} />
      </button>
      {open ? (
        <div id={id} className="px-5 pb-5">
          {children}
        </div>
      ) : null}
    </Card>
  );
}

function CopyLine({ label, value }: { label: string; value: string }) {
  const { a } = useApp();
  return (
    <div className="app-copyline">
      <div className="min-w-0">
        <p className="app-label" style={{ fontSize: "0.6rem" }}>
          {label}
        </p>
        <p className="app-body break-words">{value}</p>
      </div>
      <button
        type="button"
        className="app-btn-outline shrink-0"
        onClick={() => {
          navigator.clipboard.writeText(value.replace(/\s/g, ""));
          toast.success(a("gifts.copied"));
        }}
      >
        <Copy size={14} strokeWidth={1.3} />
        {a("gifts.copy")}
      </button>
    </div>
  );
}

function GuestBook() {
  const { a } = useApp();
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function send() {
    if (nome.trim().length < 2 || mensagem.trim().length < 10) {
      toast.error(a("rsvp.errSubmit"));
      return;
    }
    setSending(true);
    const { error } = await supabase
      .from("mensagens")
      .insert({ nome: nome.trim(), mensagem: mensagem.trim() });
    setSending(false);
    if (error) {
      toast.error(a("rsvp.errSubmit"));
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center py-3">
        <Heart size={20} strokeWidth={1.2} className="app-heart-pulse mx-auto" />
        <Script size="1.8rem" className="mt-2">
          {a("rsvp.thanks")}
        </Script>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Script size="1.4rem" className="text-center">
        {a("msg.sub")}
      </Script>
      <div className="app-field">
        <label htmlFor="gb-n" className="app-label" style={{ fontSize: "0.62rem" }}>
          {a("rsvp.name")}
        </label>
        <input id="gb-n" value={nome} onChange={(e) => setNome(e.target.value)} />
      </div>
      <div className="app-field">
        <label htmlFor="gb-m" className="app-label" style={{ fontSize: "0.62rem" }}>
          {a("rsvp.note")}
        </label>
        <textarea id="gb-m" rows={4} value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
      </div>
      <button type="button" className="app-btn-primary w-full" disabled={sending} onClick={send}>
        <Send size={15} strokeWidth={1.3} />
        {sending ? a("rsvp.sending") : a("more.messages")}
      </button>
    </div>
  );
}

export function MoreScreen() {
  const { a } = useApp();
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (k: string) => setOpen((p) => (p === k ? null : k));

  const faqs = [
    [t("faq.q1"), t("faq.a1")],
    [t("faq.q2"), t("faq.a2")],
    [t("faq.q3"), t("faq.a3")],
    [t("faq.q4"), t("faq.a4")],
    [t("faq.q5"), t("faq.a5")],
    [t("faq.q6"), t("faq.a6")],
    [t("faq.q7"), t("faq.a7")],
    [t("faq.q8"), t("faq.a8")],
  ];

  return (
    <div className="app-screen">
      <header className="text-center pt-1">
        <Label size="0.72rem">{a("more.title")}</Label>
      </header>

      <Section
        id="mensagens"
        icon={<MessageCircleHeart size={18} strokeWidth={1.3} />}
        title={a("more.messages")}
        open={open === "mensagens"}
        onToggle={() => toggle("mensagens")}
      >
        <GuestBook />
      </Section>

      <Section
        id="presentes"
        icon={<Gift size={18} strokeWidth={1.3} />}
        title={a("more.gifts")}
        open={open === "presentes"}
        onToggle={() => toggle("presentes")}
      >
        <p className="app-body">{a("gifts.desc")}</p>
        <div className="mt-4 space-y-3">
          <CopyLine label={a("gifts.iban")} value={IBAN_PT} />
          <CopyLine label={a("gifts.rev")} value={IBAN_REV} />
          <CopyLine label={a("gifts.mbway")} value={MBWAY} />
        </div>
      </Section>

      <Section
        id="faq"
        icon={<HelpCircle size={18} strokeWidth={1.3} />}
        title={a("more.faq")}
        open={open === "faq"}
        onToggle={() => toggle("faq")}
      >
        <div className="app-faq">
          {faqs.map(([q, ans]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p className="app-body">{ans}</p>
            </details>
          ))}
        </div>
      </Section>

      <Card padded={false}>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="app-row">
          <span className="app-row-icon">
            <Phone size={18} strokeWidth={1.3} />
          </span>
          <span className="app-row-title">{a("more.whatsapp")}</span>
        </a>
      </Card>

      <Card padded={false}>
        <Link to="/admin" className="app-row">
          <span className="app-row-icon">
            <Lock size={18} strokeWidth={1.3} />
          </span>
          <span className="app-row-title">
            {a("more.private")}
            <span className="app-row-sub">{a("more.privateSub")}</span>
          </span>
        </Link>
      </Card>

      <Ornament icon={<Heart size={14} strokeWidth={1.3} />} />
      <p className="app-body text-center pb-2">{a("more.footer")}</p>
    </div>
  );
}
