import { useState } from "react";
import { z } from "zod";
import { MessageCircleHeart, Send, Heart, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const schema = z.object({
  nome: z.string().trim().min(2).max(100),
  mensagem: z.string().trim().min(10).max(1000),
});

export function MessagesSection() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function resetAll() {
    setStep(0);
    setNome("");
    setMensagem("");
    setDone(false);
  }

  async function submit() {
    if (honeypot) return;
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
    setDone(true);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: "var(--card-radius)",
    border: "1px solid color-mix(in oklab, var(--gold) 45%, transparent)",
    background: "var(--ivory)",
    padding: "12px 14px",
    fontFamily: "Lato, sans-serif",
    color: "var(--foreground)",
    outline: "none",
  };

  return (
    <section
      id="mensagens"
      className="section section-ivory">
      <div className="max-w-xl mx-auto text-center">
        <h2
          className="uppercase text-base sm:text-xl"
          style={{
            fontFamily: "Cinzel, serif",
            color: "var(--olive)",
            letterSpacing: "0.28em",
            fontWeight: 500,
          }}
        >
          {t("msg.title")}
        </h2>
        <p
          className="italic mt-1 text-xl sm:text-2xl"
          style={{
            fontFamily: "Allura, 'Great Vibes', cursive",
            color: "var(--gold)",
            lineHeight: 1.1,
          }}
        >
          {t("msg.subtitle")}
        </p>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) resetAll();
          }}
        >
          <DialogTrigger asChild>
            <button
              type="button"
              className="btn btn-primary mt-3"
            >
              <MessageCircleHeart className="w-4 h-4" strokeWidth={1.5} />
              {t("msg.send")}
            </button>
          </DialogTrigger>

          <DialogContent
            className="sm:max-w-md"
            style={{
              background: "var(--ivory)",
              border: "1px solid color-mix(in oklab, var(--gold) 50%, transparent)",
            }}
          >
            <DialogHeader>
              <DialogTitle
                className="uppercase text-sm"
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "var(--olive)",
                  letterSpacing: "0.2em",
                }}
              >
                {t("msg.title")}
              </DialogTitle>
            </DialogHeader>

            {/* Honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />

            {done ? (
              <div className="text-center py-3">
                <Heart
                  className="mx-auto"
                  size={44}
                  strokeWidth={1.25}
                  fill="var(--gold)"
                  style={{ color: "var(--gold)" }}
                />
                <p
                  className="italic mt-2"
                  style={{
                    fontFamily: "Allura, 'Great Vibes', cursive",
                    color: "var(--gold)",
                    fontSize: "2rem",
                    lineHeight: 1.1,
                  }}
                >
                  {t("msg.thanks")}
                </p>
                <p
                  className="mt-1 text-sm"
                  style={{ fontFamily: "Lato, sans-serif", color: "var(--olive)" }}
                >
                  {t("msg.thanksDesc")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--gold)" }}>
                  {lang === "en" ? `Step ${step + 1} of 2` : `Passo ${step + 1} de 2`}
                </p>

                {step === 0 ? (
                  <div className="space-y-2 text-left">
                    <label
                      htmlFor="msg-nome"
                      className="text-[11px] uppercase tracking-[0.2em]"
                      style={{ fontFamily: "Cinzel, serif", color: "var(--olive)" }}
                    >
                      {t("msg.field.name")}
                    </label>
                    <input
                      id="msg-nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                ) : (
                  <div className="space-y-2 text-left">
                    <label
                      htmlFor="msg-text"
                      className="text-[11px] uppercase tracking-[0.2em]"
                      style={{ fontFamily: "Cinzel, serif", color: "var(--olive)" }}
                    >
                      {t("msg.field.message")}
                    </label>
                    <textarea
                      id="msg-text"
                      rows={5}
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value.slice(0, 1000))}
                      placeholder={t("msg.placeholder")}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                    <p className="text-right text-[11px]" style={{ color: "var(--olive)", opacity: 0.6 }}>
                      {mensagem.length} / 1000
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  {step === 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em]"
                      style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", minHeight: 44 }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {lang === "en" ? "Back" : "Voltar"}
                    </button>
                  ) : (
                    <span />
                  )}

                  {step === 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (nome.trim().length < 2) {
                          toast.error(t("msg.err.invalid"));
                          return;
                        }
                        setStep(1);
                      }}
                      className="btn btn-primary"
                     
                    >
                      {lang === "en" ? "Continue" : "Continuar"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submit}
                      disabled={submitting}
                      className="btn btn-primary"
                     
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
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
