import { useState } from "react";
import { z } from "zod";
import { User, Mail, Phone, Music, Heart, X, Plane, Send, CheckCircle2, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { syncRsvpToSheet, sendRsvpEmails, checkRsvpDuplicate } from "@/lib/rsvp.functions";


type FormErrors = Partial<
  Record<"name" | "email" | "phone" | "guests" | "attending" | "allergies" | "song" | "message", string>
>;

/* ---------- Floating-label field ---------- */
function FloatingField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  inputMode,
  error,
  multiline,
  rows = 3,
  required,
}: {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  error?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}) {
  const hasValue = value.length > 0;
  const inputCls =
    "peer w-full bg-transparent outline-none text-base sm:text-[0.95rem] py-3 placeholder-transparent " +
    (Icon ? "pl-8 " : "pl-0 ") +
    "pr-0 text-[color:var(--foreground)]";

  return (
    <div className="relative">
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            strokeWidth={1.5}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-[color:var(--olive)] opacity-70"
          />
        )}
        {multiline ? (
          <textarea
            id={id}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder=" "
            className={inputCls + " resize-none"}
            aria-invalid={!!error}
          />
        ) : (
          <input
            id={id}
            type={type}
            inputMode={inputMode}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder=" "
            className={inputCls}
            aria-invalid={!!error}
          />
        )}

        <label
          htmlFor={id}
          className={
            "pointer-events-none absolute transition-all duration-200 " +
            "font-[Cinzel] uppercase tracking-[0.2em] text-[color:var(--olive)] " +
            (Icon ? "left-8 " : "left-0 ") +
            (hasValue
              ? "top-0 text-[0.65rem] -translate-y-2"
              : "top-1/2 -translate-y-1/2 text-[0.7rem] opacity-70 ") +
            "peer-focus:top-0 peer-focus:text-[0.65rem] peer-focus:-translate-y-2 peer-focus:opacity-100 peer-focus:text-[color:var(--gold)]"
          }
        >
          {label}
          {required && " *"}
        </label>

        <span
          className="absolute left-0 right-0 bottom-0 h-px transition-colors"
          style={{ background: error ? "var(--destructive)" : "var(--olive)" }}
        />
        <span
          className="absolute left-0 right-0 bottom-0 h-[2px] origin-center scale-x-0 peer-focus:scale-x-100 transition-transform"
          style={{ background: "var(--gold)" }}
        />
      </div>
      {error && (
        <p className="mt-2 text-xs text-[color:var(--destructive)] font-[Lato]">{error}</p>
      )}
    </div>
  );
}

/* ---------- Main component ---------- */
export function RsvpForm() {
  const { t } = useI18n();

  const schema = z.object({
    name: z.string().trim().min(2, t("rsvp.err.name")).max(100),
    email: z.string().trim().email(t("rsvp.err.email")).max(255),
    phone: z.string().trim().regex(/^\d{9}$/, t("rsvp.err.phone")),
    guests: z.number().int().min(1).max(5),
    attending: z.enum(["yes", "no"]),
    allergies: z.string().trim().max(500).optional().or(z.literal("")),
    song: z.string().trim().max(200).optional().or(z.literal("")),
    message: z.string().trim().max(1000).optional().or(z.literal("")),
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [allergies, setAllergies] = useState("");
  const [song, setSong] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<z.infer<typeof schema> | null>(null);
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  function goNext() {
    if (step === 0) {
      if (!attending) {
        setErrors({ attending: t("rsvp.err.attending") });
        return;
      }
      setErrors({});
      setStep(1);
      return;
    }
    if (step === 1) {
      const partial = z.object({
        name: schema.shape.name,
        email: schema.shape.email,
        phone: schema.shape.phone,
      });
      const res = partial.safeParse({ name, email, phone: phone.replace(/\s+/g, "") });
      if (!res.success) {
        const errs: FormErrors = {};
        for (const issue of res.error.issues) {
          const k = issue.path[0] as keyof FormErrors;
          if (!errs[k]) errs[k] = issue.message;
        }
        setErrors(errs);
        return;
      }
      setErrors({});
      setStep(2);
    }
  }


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < totalSteps - 1) {
      goNext();
      return;
    }
    setSubmitError(null);


    const parsed = schema.safeParse({
      name,
      email,
      phone: phone.replace(/\s+/g, ""),
      guests,
      attending: attending ?? undefined,
      allergies,
      song,
      message,
    });

    if (!parsed.success) {
      const errs: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormErrors;
        if (!errs[k]) errs[k] = issue.message;
      }
      if (!attending) errs.attending = t("rsvp.err.attending");
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    // Bloqueia inscrições repetidas (mesmo email ou telemóvel).
    try {
      const dup = await checkRsvpDuplicate({
        data: { email: parsed.data.email, phone: parsed.data.phone },
      });
      if (dup?.exists) {
        const msg = t("rsvp.err.duplicate");
        setSubmitError(msg);
        setLoading(false);
        toast.error(msg, {
          style: {
            background: "var(--ivory)",
            border: "1px solid var(--gold)",
            color: "var(--olive)",
            fontFamily: "Cinzel, serif",
            letterSpacing: "0.08em",
          },
        });
        return;
      }
    } catch (err) {
      console.error("Verificação de duplicados falhou (não bloqueante):", err);
    }

    // Google Sheet sync goes through a server function that re-validates the
    // payload; the webhook URL never reaches the client bundle.
    syncRsvpToSheet({
      data: {
        nome: parsed.data.name,
        email: parsed.data.email,
        telefone: parsed.data.phone,
        pessoas: parsed.data.guests,
        presenca: parsed.data.attending === "yes" ? "sim" : "nao",
        restricoes: parsed.data.allergies || "",
        musica: parsed.data.song || "",
        mensagem: parsed.data.message || "",
      },
    }).catch((err: unknown) => console.error("Google Sheet falhou (não bloqueante):", err));


    try {
      const { error } = await supabase.from("rsvps").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        guests: parsed.data.guests,
        attending: parsed.data.attending === "yes",
        allergies: parsed.data.allergies || null,
        song_suggestion: parsed.data.song || null,
        message: parsed.data.message || null,
      });

      if (error) throw error;

      // Emails (confirmação ao convidado + notificação interna) — não bloqueantes.
      sendRsvpEmails({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          guests: parsed.data.guests,
          attending: parsed.data.attending === "yes",
          allergies: parsed.data.allergies || "",
          song: parsed.data.song || "",
          message: parsed.data.message || "",
        },
      }).catch((err: unknown) => console.error("Envio de email falhou (não bloqueante):", err));

      setSubmitted(parsed.data);
      setFadingOut(true);
      setTimeout(() => setDone(true), 450);
    } catch {
      const msg = t("rsvp.err.submit");
      setSubmitError(msg);
      toast.error(msg, {
        style: {
          background: "var(--ivory)",
          border: "1px solid var(--destructive)",
          color: "var(--destructive)",
          fontFamily: "Cinzel, serif",
          letterSpacing: "0.1em",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  /* ----------- Confirmation view ----------- */
  if (done && submitted) {
    const data = submitted;
    const attendingLabel = data.attending === "yes" ? t("rsvp.confirm.attending.yes") : t("rsvp.confirm.attending.no");

    function Row({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }) {
      return (
        <div className="flex items-start gap-3 py-2.5 border-b border-[color:var(--gold)]/20 last:border-0">
          {Icon && <Icon size={16} strokeWidth={1.5} className="shrink-0 mt-0.5 text-[color:var(--olive)] opacity-70" />}
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.2em] text-[color:var(--olive)] opacity-70 font-[Cinzel]">
              {label}
            </p>
            <p className="mt-0.5 text-sm sm:text-base break-words" style={{ fontFamily: "Lato, sans-serif", color: "var(--foreground)" }}>
              {value || t("rsvp.confirm.notProvided")}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="rsvp-confirm mx-auto"
        style={{
          maxWidth: 600,
          background: "var(--ivory)",
          border: "1px solid var(--gold)",
          borderRadius: 12,
          padding: "40px 20px",
          boxShadow:
            "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 18px 40px -22px color-mix(in oklab, var(--olive) 25%, transparent)",
        }}
      >
        <div className="text-center">
          <div className="rsvp-plane-track mx-auto" aria-hidden="true">
            <Plane size={32} strokeWidth={1.25} className="rsvp-plane" style={{ color: "var(--gold)" }} />
          </div>

          <p
            className="font-script text-4xl sm:text-5xl mt-2"
            style={{
              fontFamily: "Allura, 'Great Vibes', cursive",
              color: "var(--gold)",
              lineHeight: 1.1,
            }}
          >
            {t("rsvp.thanks")}
          </p>

          <p
            className="mt-3 max-w-md mx-auto text-sm sm:text-base"
            style={{
              fontFamily: "Lato, sans-serif",
              color: "var(--foreground)",
              lineHeight: 1.6,
            }}
          >
            {t("rsvp.thanksDesc")}
          </p>
        </div>

        <div
          className="mt-6 rounded-lg p-4 sm:p-5"
          style={{ background: "color-mix(in oklab, var(--gold) 8%, transparent)", border: "1px solid color-mix(in oklab, var(--gold) 30%, transparent)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={18} strokeWidth={1.5} style={{ color: "var(--olive)" }} />
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] font-[Cinzel]" style={{ color: "var(--olive)" }}>
              {t("rsvp.confirm.subtitle")}
            </p>
          </div>

          <Row label={t("rsvp.name")} value={data.name} icon={User} />
          <Row label={t("rsvp.email")} value={data.email} icon={Mail} />
          <Row label={t("rsvp.phone")} value={data.phone} icon={Phone} />
          <Row
            label={t("rsvp.guests")}
            value={`${data.guests} ${data.guests === 1 ? t("rsvp.guests.one") : t("rsvp.guests.many")}`}
            icon={Heart}
          />
          <Row label={t("rsvp.attend")} value={attendingLabel} icon={data.attending === "yes" ? Heart : X} />
          <Row label={t("rsvp.allergies")} value={data.allergies || ""} />
          <Row label={t("rsvp.song")} value={data.song || ""} icon={Music} />
          <Row label={t("rsvp.message")} value={data.message || ""} />
        </div>

        <button
          type="button"
          onClick={() => {
            setDone(false);
            setSubmitted(null);
            setName("");
            setEmail("");
            setPhone("");
            setGuests(1);
            setAttending(null);
            setAllergies("");
            setSong("");
            setMessage("");
            setFadingOut(false);
            setStep(0);

          }}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
          style={{
            padding: "14px 24px",
            background: "transparent",
            color: "var(--olive)",
            borderRadius: 8,
            fontFamily: "Cinzel, serif",
            letterSpacing: "0.2em",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            border: "1px solid var(--olive)",
            minHeight: 44,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--olive)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--ivory)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--olive)";
          }}
        >
          <RotateCcw size={16} strokeWidth={1.5} />
          {t("rsvp.confirm.another")}
        </button>
      </div>
    );
  }

  /* ----------- Form view ----------- */
  return (
    <div
      className={"mx-auto transition-opacity duration-500 " + (fadingOut ? "opacity-0" : "opacity-100")}
      style={{ maxWidth: 600 }}
    >
      <div
        className="px-6 py-8 sm:px-10 sm:py-12 md:p-[48px]"
        style={{
          background: "var(--ivory)",
          border: "1px solid var(--gold)",
          borderRadius: 12,
          boxShadow:
            "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 18px 40px -22px color-mix(in oklab, var(--olive) 25%, transparent)",
        }}
      >
        <h3
          className="text-center text-lg sm:text-xl"
          style={{
            fontFamily: "Cinzel, serif",
            color: "var(--olive)",
            letterSpacing: "0.3em",
            fontWeight: 500,
            textTransform: "uppercase",
          }}
        >
          {t("rsvp.title")}
        </h3>

        <div className="mt-5 mb-6">
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === step ? 28 : 14,
                  background: i <= step ? "var(--gold)" : "color-mix(in oklab, var(--olive) 25%, transparent)",
                }}
              />
            ))}
          </div>
          <p
            className="mt-3 text-center"
            style={{
              fontFamily: "Cinzel, serif",
              color: "var(--olive)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontSize: "0.65rem",
            }}
          >
            {t("rsvp.step")} {step + 1} {t("rsvp.of")} {totalSteps} · {t(`rsvp.step${step + 1}` as never)}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {step === 0 && (
            <>
              <div>
                <p
                  className="mb-3"
                  style={{
                    fontFamily: "Cinzel, serif",
                    color: "var(--olive)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                  }}
                >
                  {t("rsvp.attend")} *
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending("yes")}
                    className="flex items-center justify-center gap-2 py-4 px-4 rounded-md transition-all"
                    style={{
                      background: attending === "yes" ? "var(--olive)" : "transparent",
                      color: attending === "yes" ? "var(--ivory)" : "var(--olive)",
                      border: "1px solid var(--olive)",
                      fontFamily: "Cinzel, serif",
                      letterSpacing: "0.15em",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      minHeight: 44,
                    }}
                  >
                    <Heart size={16} strokeWidth={1.5} fill={attending === "yes" ? "var(--gold)" : "transparent"} />
                    {t("rsvp.yes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("no")}
                    className="flex items-center justify-center gap-2 py-4 px-4 rounded-md transition-all"
                    style={{
                      background: attending === "no" ? "var(--olive)" : "transparent",
                      color: attending === "no" ? "var(--ivory)" : "var(--olive)",
                      border: "1px solid var(--olive)",
                      fontFamily: "Cinzel, serif",
                      letterSpacing: "0.15em",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      minHeight: 44,
                    }}
                  >
                    <X size={16} strokeWidth={1.5} />
                    {t("rsvp.no")}
                  </button>
                </div>
                {errors.attending && (
                  <p className="mt-2 text-xs text-[color:var(--destructive)]">{errors.attending}</p>
                )}
              </div>

              {attending === "yes" && (
                <div>
                  <label
                    htmlFor="rsvp-guests"
                    className="block mb-2"
                    style={{
                      fontFamily: "Cinzel, serif",
                      color: "var(--olive)",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontSize: "0.7rem",
                    }}
                  >
                    {t("rsvp.guests")} *
                  </label>
                  <div className="relative">
                    <select
                      id="rsvp-guests"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-transparent appearance-none py-3 pr-8 outline-none text-base sm:text-[0.95rem] text-[color:var(--foreground)]"
                      style={{ borderBottom: "1px solid var(--olive)", minHeight: 44 }}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? t("rsvp.guests.one") : t("rsvp.guests.many")}
                        </option>
                      ))}
                    </select>
                    <span
                      aria-hidden="true"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[color:var(--olive)] opacity-70"
                    >
                      ▾
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <FloatingField id="rsvp-name" label={t("rsvp.name")} icon={User} value={name} onChange={setName} error={errors.name} required />
              <FloatingField id="rsvp-email" label={t("rsvp.email")} icon={Mail} type="email" inputMode="email" value={email} onChange={setEmail} error={errors.email} required />
              <FloatingField
                id="rsvp-phone"
                label={t("rsvp.phone")}
                icon={Phone}
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(v) => setPhone(v.replace(/[^\d]/g, "").slice(0, 9))}
                error={errors.phone}
                required
              />
            </>
          )}

          {step === 2 && (
            <>
              <FloatingField id="rsvp-allergies" label={t("rsvp.allergies")} value={allergies} onChange={setAllergies} error={errors.allergies} multiline rows={2} />
              <FloatingField id="rsvp-song" label={t("rsvp.song")} icon={Music} value={song} onChange={setSong} error={errors.song} />
              <FloatingField id="rsvp-message" label={t("rsvp.message")} value={message} onChange={setMessage} error={errors.message} multiline rows={3} />
            </>
          )}

          {submitError && (
            <p className="text-sm text-center" style={{ color: "var(--destructive)" }} role="alert">
              {submitError}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            {step > 0 && (
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  setStep((s) => s - 1);
                }}
                className="inline-flex items-center justify-center gap-2 transition-all"
                style={{
                  flex: "0 0 auto",
                  padding: "14px 20px",
                  background: "transparent",
                  color: "var(--olive)",
                  borderRadius: 8,
                  fontFamily: "Cinzel, serif",
                  letterSpacing: "0.15em",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  border: "1px solid var(--olive)",
                  minHeight: 44,
                }}
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
                {t("rsvp.back")}
              </button>
            )}

            {step < totalSteps - 1 ? (
              <button
                key="rsvp-next"
                type="button"
                onClick={goNext}

                className="flex-1 inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                style={{
                  padding: "16px 24px",
                  background: "var(--olive)",
                  color: "var(--cream)",
                  borderRadius: 8,
                  fontFamily: "Cinzel, serif",
                  letterSpacing: "0.2em",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  border: "none",
                  minHeight: 44,
                }}
              >
                {t("rsvp.next")}
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
            ) : (
              <button
                key="rsvp-submit"
                type="submit"

                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{
                  padding: "16px 24px",
                  background: "var(--olive)",
                  color: "var(--cream)",
                  borderRadius: 8,
                  fontFamily: "Cinzel, serif",
                  letterSpacing: "0.2em",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  border: "none",
                  minHeight: 44,
                  boxShadow: "0 6px 18px -10px color-mix(in oklab, var(--olive) 70%, transparent)",
                }}
              >
                <Send size={16} strokeWidth={1.5} />
                {loading ? t("rsvp.sending") : t("rsvp.send")}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
