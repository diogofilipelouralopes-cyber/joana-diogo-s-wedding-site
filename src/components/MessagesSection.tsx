import { useState } from "react";
import { z } from "zod";
import { MessageCircleHeart, User, Send, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  nome: z.string().trim().min(2).max(100),
  mensagem: z.string().trim().min(10).max(1000),
});

export function MessagesSection() {
  const { t } = useI18n();
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [honeypot, setHoneypot] = useState(""); // bot trap
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [showAgain, setShowAgain] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return; // bot
    const parsed = schema.safeParse({ nome, mensagem });
    if (!parsed.success) {
      toast.error(t("msg.err.invalid"));
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("mensagens").insert({
      nome: parsed.data.nome,
      mensagem: parsed.data.mensagem,
    });
    setSubmitting(false);
    if (error) {
      toast.error(t("msg.err.submit"));
      return;
    }
    setFadingOut(true);
    setTimeout(() => {
      setDone(true);
      setFadingOut(false);
    }, 500);
    setTimeout(() => setShowAgain(true), 6000);
  }

  function reset() {
    setNome("");
    setMensagem("");
    setDone(false);
    setShowAgain(false);
  }

  const charCount = mensagem.length;

  return (
    <section
      id="mensagens"
      className="px-5 sm:px-6 scroll-mt-24"
      style={{ background: "var(--cream)", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="uppercase text-xl sm:text-2xl md:text-3xl"
            style={{
              fontFamily: "Cinzel, serif",
              color: "var(--olive)",
              letterSpacing: "0.3em",
              fontWeight: 500,
            }}
          >
            {t("msg.title")}
          </h2>
          <p
            className="italic mt-3 text-3xl sm:text-4xl"
            style={{
              fontFamily: "Allura, 'Great Vibes', cursive",
              color: "var(--gold)",
              lineHeight: 1.1,
            }}
          >
            {t("msg.subtitle")}
          </p>
          <div className="divider-ornament mt-6 max-w-xs mx-auto">
            <MessageCircleHeart className="w-4 h-4" strokeWidth={1.25} />
          </div>
        </div>

        {/* Card */}
        <div
          className="mx-auto"
          style={{
            maxWidth: 600,
            background: "var(--ivory)",
            border: "1px solid color-mix(in oklab, var(--gold) 55%, transparent)",
            borderRadius: 12,
            padding: "clamp(28px, 5vw, 50px)",
            boxShadow:
              "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 18px 40px -22px color-mix(in oklab, var(--olive) 25%, transparent)",
          }}
        >
          {!done ? (
            <div
              style={{
                transition: "opacity 500ms ease",
                opacity: fadingOut ? 0 : 1,
              }}
            >
              <p
                className="text-center text-base mb-7"
                style={{
                  fontFamily: "Lato, sans-serif",
                  color: "var(--olive)",
                  lineHeight: 1.6,
                }}
              >
                {t("msg.intro")}
              </p>

              <form onSubmit={onSubmit} className="space-y-6" noValidate>
                {/* Honeypot */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    width: 1,
                    height: 1,
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                />

                {/* Nome */}
                <FloatingField
                  id="msg-nome"
                  label={t("msg.field.name")}
                  icon={User}
                  value={nome}
                  onChange={setNome}
                />

                {/* Mensagem */}
                <FloatingField
                  id="msg-text"
                  label={t("msg.field.message")}
                  value={mensagem}
                  onChange={(v) => setMensagem(v.slice(0, 1000))}
                  multiline
                  placeholder={t("msg.placeholder")}
                  counter={`${charCount} / 1000`}
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 uppercase transition-all hover:-translate-y-0.5"
                  style={{
                    background: "var(--olive)",
                    color: "var(--cream)",
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.8rem",
                    letterSpacing: "0.25em",
                    minHeight: 52,
                    padding: "16px 32px",
                    borderRadius: 8,
                    boxShadow: "0 4px 16px rgba(107, 122, 79, 0.3)",
                    opacity: submitting ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) e.currentTarget.style.background = "var(--gold)";
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) e.currentTarget.style.background = "var(--olive)";
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("msg.sending")}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" strokeWidth={1.5} />
                      {t("msg.send")}
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-6 rsvp-confirm">
              <Heart
                className="mx-auto rsvp-heart-pulse"
                size={56}
                strokeWidth={1.25}
                fill="var(--gold)"
                style={{ color: "var(--gold)" }}
              />
              <p
                className="italic mt-4"
                style={{
                  fontFamily: "Allura, 'Great Vibes', cursive",
                  color: "var(--gold)",
                  fontSize: "2.5rem",
                  lineHeight: 1.1,
                }}
              >
                {t("msg.thanks")}
              </p>
              <p
                className="mt-3 text-base"
                style={{
                  fontFamily: "Lato, sans-serif",
                  color: "var(--olive)",
                  lineHeight: 1.6,
                }}
              >
                {t("msg.thanksDesc")}
              </p>
              {showAgain && (
                <button
                  onClick={reset}
                  className="mt-7 inline-flex items-center gap-2 px-6 py-3 uppercase transition-all hover:-translate-y-0.5"
                  style={{
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.25em",
                    color: "var(--gold)",
                    border: "1px solid var(--gold)",
                    borderRadius: 8,
                    background: "transparent",
                  }}
                >
                  {t("msg.another")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FloatingField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  multiline,
  placeholder,
  counter,
}: {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
  counter?: string;
}) {
  const inputCls =
    "peer w-full bg-transparent outline-none text-base sm:text-[0.95rem] py-3 placeholder:italic placeholder:text-[color:var(--olive)]/40 " +
    (Icon ? "pl-8 " : "pl-0 ") +
    "pr-0 text-[color:var(--foreground)]";
  const hasValue = value.length > 0;
  return (
    <div className="relative">
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            strokeWidth={1.5}
            className="absolute left-0 top-3.5 text-[color:var(--olive)] opacity-70"
          />
        )}
        {multiline ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? " "}
            rows={6}
            style={{ minHeight: 180 }}
            className={inputCls + " resize-y"}
          />
        ) : (
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder=" "
            className={inputCls}
          />
        )}
        <label
          htmlFor={id}
          className={
            "pointer-events-none absolute left-0 transition-all " +
            (Icon ? "ml-8 " : "") +
            (hasValue
              ? "top-0 text-[10px] tracking-[0.2em] uppercase text-[color:var(--olive)]/70"
              : "top-3 text-[color:var(--olive)]/60")
          }
          style={{ fontFamily: "Cinzel, serif" }}
        >
          {label}
        </label>
        <div
          aria-hidden
          className="absolute left-0 right-0 bottom-0"
          style={{ borderBottom: "1px solid color-mix(in oklab, var(--olive) 30%, transparent)" }}
        />
      </div>
      {counter && (
        <div
          className="text-right text-[11px] mt-1"
          style={{ color: "var(--olive)", opacity: 0.6 }}
        >
          {counter}
        </div>
      )}
    </div>
  );
}
