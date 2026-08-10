import { useState } from "react";
import { z } from "zod";
import { Plane, Heart, Check, X, Minus, Plus, ArrowLeft } from "lucide-react";
import { Card, Label, Script } from "@/components/app/kit";
import { useApp } from "@/lib/app-copy";
import { supabase } from "@/integrations/supabase/client";
import { syncRsvpToSheet, sendRsvpEmails } from "@/lib/rsvp.functions";

type Errors = Partial<Record<"name" | "email" | "phone" | "attending", string>>;

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  error,
  multiline,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "text" | "email" | "tel";
  error?: string;
  multiline?: boolean;
}) {
  return (
    <div className="app-field">
      <label htmlFor={id} className="app-label" style={{ fontSize: "0.62rem" }}>
        {label}
      </label>
      {multiline ? (
        <textarea id={id} rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
        />
      )}
      {error ? <p className="app-error">{error}</p> : null}
    </div>
  );
}

export function RsvpWizard() {
  const { a } = useApp();
  const [step, setStep] = useState(1);
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    attending: null as null | boolean,
    guests: 1,
    diet: "",
    song: "",
    note: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  function validateStep1() {
    const e: Errors = {};
    if (f.name.trim().length < 3) e.name = a("rsvp.errName");
    if (!z.string().email().safeParse(f.email.trim()).success) e.email = a("rsvp.errEmail");
    if (!/^\d{9}$/.test(f.phone.replace(/\s+/g, ""))) e.phone = a("rsvp.errPhone");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && f.attending === null) {
      setErrors({ attending: a("rsvp.errAttend") });
      return;
    }
    setErrors({});
    setStep((s) => Math.min(4, s + 1));
  }

  async function submit() {
    setLoading(true);
    const phone = f.phone.replace(/\s+/g, "");
    const attending = f.attending === true;

    syncRsvpToSheet({
      data: {
        nome: f.name.trim(),
        email: f.email.trim(),
        telefone: phone,
        pessoas: f.guests,
        presenca: attending ? "sim" : "nao",
        restricoes: f.diet.trim(),
        musica: f.song.trim(),
        mensagem: f.note.trim(),
      },
    }).catch(() => {});

    try {
      const { error } = await supabase.from("rsvps").insert({
        name: f.name.trim(),
        email: f.email.trim(),
        phone,
        guests: f.guests,
        attending,
        allergies: f.diet.trim() || null,
        song_suggestion: f.song.trim() || null,
        message: f.note.trim() || null,
      });
      if (error) throw error;

      sendRsvpEmails({
        data: {
          name: f.name.trim(),
          email: f.email.trim(),
          guests: f.guests,
          attending,
          allergies: f.diet.trim(),
          song: f.song.trim(),
          message: f.note.trim(),
        },
      }).catch(() => {});

      setDone(true);
    } catch {
      setErrors({ name: a("rsvp.errSubmit") });
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="app-screen">
        <Card className="text-center py-10">
          <div className="app-plane-track">
            <Plane size={22} strokeWidth={1.3} className="app-plane" />
          </div>
          <Script size="2.4rem" className="mt-4">
            {a("rsvp.thanks")}
          </Script>
          <p className="app-body mt-3">{a("rsvp.thanksDesc")}</p>
          <Heart size={22} strokeWidth={1.2} className="app-heart-pulse mx-auto mt-5" />
          <button
            type="button"
            className="app-btn-outline mt-6"
            onClick={() => {
              setDone(false);
              setStep(1);
            }}
          >
            {a("rsvp.again")}
          </button>
        </Card>
      </div>
    );
  }

  const pct = ((step - 1) / 3) * 100;

  return (
    <div className="app-screen">
      <header className="text-center pt-1">
        <Label size="0.72rem">{a("rsvp.title")}</Label>
        <p className="app-body mt-2">{a("rsvp.sub")}</p>
      </header>

      {/* Progress: plane travelling along a dashed line */}
      <div className="app-progress" aria-hidden="true">
        <span className="app-progress-line" />
        <span className="app-progress-plane" style={{ left: `calc(${pct}% )` }}>
          <Plane size={17} strokeWidth={1.3} />
        </span>
      </div>

      <Card>
        {step === 1 ? (
          <>
            <Label size="0.68rem">{a("rsvp.s1")}</Label>
            <div className="mt-4 space-y-4">
              <Field id="n" label={a("rsvp.name")} value={f.name} onChange={(v) => set("name", v)} error={errors.name} />
              <Field
                id="e"
                label={a("rsvp.email")}
                type="email"
                inputMode="email"
                value={f.email}
                onChange={(v) => set("email", v)}
                error={errors.email}
              />
              <Field
                id="p"
                label={a("rsvp.phone")}
                type="tel"
                inputMode="tel"
                value={f.phone}
                onChange={(v) => set("phone", v)}
                error={errors.phone}
              />
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Label size="0.68rem">{a("rsvp.s2")}</Label>
            <div className="app-grid-2 mt-4">
              <button
                type="button"
                className="app-choice"
                data-active={f.attending === true}
                onClick={() => set("attending", true)}
              >
                <Check size={18} strokeWidth={1.3} />
                <span>{a("rsvp.yes")}</span>
              </button>
              <button
                type="button"
                className="app-choice"
                data-active={f.attending === false}
                onClick={() => set("attending", false)}
              >
                <X size={18} strokeWidth={1.3} />
                <span>{a("rsvp.no")}</span>
              </button>
            </div>
            {errors.attending ? <p className="app-error mt-2">{errors.attending}</p> : null}

            {f.attending === true ? (
              <div className="mt-6">
                <Label size="0.62rem">{a("rsvp.people")}</Label>
                <div className="app-stepper mt-2">
                  <button type="button" onClick={() => set("guests", Math.max(1, f.guests - 1))} aria-label="-">
                    <Minus size={16} strokeWidth={1.3} />
                  </button>
                  <span>{f.guests}</span>
                  <button type="button" onClick={() => set("guests", Math.min(5, f.guests + 1))} aria-label="+">
                    <Plus size={16} strokeWidth={1.3} />
                  </button>
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Label size="0.68rem">{a("rsvp.s3")}</Label>
            <div className="mt-4 space-y-4">
              <Field id="d" label={a("rsvp.diet")} value={f.diet} onChange={(v) => set("diet", v)} />
              <Field id="s" label={a("rsvp.song")} value={f.song} onChange={(v) => set("song", v)} />
              <Field id="m" label={a("rsvp.note")} value={f.note} onChange={(v) => set("note", v)} multiline />
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <Label size="0.68rem">{a("rsvp.s4")}</Label>
            <dl className="app-summary mt-4">
              <div>
                <dt>{a("rsvp.name")}</dt>
                <dd>{f.name || a("rsvp.none")}</dd>
              </div>
              <div>
                <dt>{a("rsvp.email")}</dt>
                <dd>{f.email || a("rsvp.none")}</dd>
              </div>
              <div>
                <dt>{a("rsvp.presence")}</dt>
                <dd>{f.attending ? `${a("rsvp.yes")} · ${f.guests}` : a("rsvp.no")}</dd>
              </div>
              <div>
                <dt>{a("rsvp.diet")}</dt>
                <dd>{f.diet || a("rsvp.none")}</dd>
              </div>
            </dl>
          </>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          {step > 1 ? (
            <button type="button" className="app-btn-outline flex-1" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft size={15} strokeWidth={1.3} />
              {a("rsvp.back")}
            </button>
          ) : null}
          <button
            type="button"
            className="app-btn-primary flex-1"
            disabled={loading}
            onClick={() => (step === 4 ? submit() : next())}
          >
            <Plane size={15} strokeWidth={1.3} />
            {loading ? a("rsvp.sending") : step === 4 ? a("rsvp.send") : a("rsvp.next")}
          </button>
        </div>
      </Card>
    </div>
  );
}
