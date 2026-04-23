import { useState } from "react";
import { z } from "zod";
import { User, Mail, Phone, Music, Heart, X, Plane, Send } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
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

      // Mirror to Google Sheet (fire-and-forget, never blocks confirmation)
      const WEBHOOK_URL =
        "https://script.google.com/macros/s/AKfycbxbhmu0sJwJ_gkyvXf2AhmqJapuJqVFgIcKMsqq9rNlM2-hFDGiffrMwlq36txBUeL1/exec";
      const dados = {
        nome: parsed.data.name,
        email: parsed.data.email,
        telefone: parsed.data.phone,
        pessoas: parsed.data.guests,
        presenca: parsed.data.attending === "yes" ? "sim" : "nao",
        restricoes: parsed.data.allergies || "",
        musica: parsed.data.song || "",
        mensagem: parsed.data.message || "",
      };
      fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(dados),
      }).catch((err) => console.error("Erro ao enviar RSVP para Google Sheet:", err));

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
  if (done) {
    return (
      <div
        className="rsvp-confirm mx-auto text-center"
        style={{
          maxWidth: 600,
          background: "var(--ivory)",
          border: "1px solid var(--gold)",
          borderRadius: 12,
          padding: "48px 24px",
          boxShadow:
            "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 18px 40px -22px color-mix(in oklab, var(--olive) 25%, transparent)",
        }}
      >
        <div className="rsvp-plane-track" aria-hidden="true">
          <Plane size={36} strokeWidth={1.25} className="rsvp-plane" style={{ color: "var(--gold)" }} />
        </div>

        <p
          className="font-script text-5xl sm:text-6xl"
          style={{
            fontFamily: "Allura, 'Great Vibes', cursive",
            color: "var(--gold)",
            lineHeight: 1,
            marginTop: 8,
          }}
        >
          {t("rsvp.thanks")}
        </p>

        <p
          className="mt-6 max-w-md mx-auto text-sm sm:text-base"
          style={{
            fontFamily: "Lato, sans-serif",
            color: "var(--foreground)",
            lineHeight: 1.7,
          }}
        >
          {t("rsvp.thanksDesc")}
        </p>

        <div className="mt-6 flex justify-center">
          <Heart
            size={22}
            strokeWidth={1}
            fill="var(--gold)"
            className="rsvp-heart-pulse"
            style={{ color: "var(--gold)" }}
          />
        </div>
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
        className="px-6 py-10 sm:px-12 sm:py-14 md:p-[60px]"
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

        <div className="relative my-6 flex items-center justify-center">
          <span
            className="absolute left-1/2 -translate-x-1/2 right-0 top-1/2 -translate-y-1/2"
            style={{ borderTop: "1px dashed var(--olive)", opacity: 0.4, width: "80%" }}
          />
          <span
            className="relative inline-flex items-center justify-center px-3"
            style={{ background: "var(--ivory)" }}
          >
            <Heart size={14} strokeWidth={1} fill="var(--gold)" style={{ color: "var(--gold)" }} />
          </span>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 sm:space-y-7" noValidate>
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
                <Heart
                  size={16}
                  strokeWidth={1.5}
                  fill={attending === "yes" ? "var(--gold)" : "transparent"}
                />
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

          <FloatingField id="rsvp-allergies" label={t("rsvp.allergies")} value={allergies} onChange={setAllergies} error={errors.allergies} multiline rows={2} />
          <FloatingField id="rsvp-song" label={t("rsvp.song")} icon={Music} value={song} onChange={setSong} error={errors.song} />
          <FloatingField id="rsvp-message" label={t("rsvp.message")} value={message} onChange={setMessage} error={errors.message} multiline rows={3} />

          {submitError && (
            <p className="text-sm text-center" style={{ color: "var(--destructive)" }} role="alert">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{
              padding: "16px 28px",
              background: "var(--olive)",
              color: "var(--cream)",
              borderRadius: 8,
              fontFamily: "Cinzel, serif",
              letterSpacing: "0.25em",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              border: "none",
              minHeight: 44,
              boxShadow: "0 6px 18px -10px color-mix(in oklab, var(--olive) 70%, transparent)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--gold)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--olive)";
            }}
          >
            <Send size={16} strokeWidth={1.5} />
            {loading ? t("rsvp.sending") : t("rsvp.send")}
          </button>
        </form>
      </div>
    </div>
  );
}
