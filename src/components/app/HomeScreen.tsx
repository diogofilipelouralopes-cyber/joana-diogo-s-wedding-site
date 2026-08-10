import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plane, Heart, MapPin, Camera, MessageCircleHeart, Gift, Clock } from "lucide-react";
import { Card, Label, Script, Ornament } from "@/components/app/kit";
import { useApp } from "@/lib/app-copy";

const TARGET = new Date("2026-09-19T14:00:00+01:00").getTime();

function useCountdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return useMemo(() => {
    if (now === null) return null;
    const diff = Math.max(0, TARGET - now);
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff / 3600000) % 24),
      m: Math.floor((diff / 60000) % 60),
      s: Math.floor((diff / 1000) % 60),
      over: diff === 0,
    };
  }, [now]);
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <Card className="app-count-card" padded={false}>
      <span className="app-count-value">{value}</span>
      <span className="app-count-label">{label}</span>
    </Card>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export function HomeScreen() {
  const { a } = useApp();
  const cd = useCountdown();

  const shortcuts = [
    { to: "/local", icon: MapPin, label: a("home.q1") },
    { to: "/fotos", icon: Camera, label: a("home.q2") },
    { to: "/mais", icon: MessageCircleHeart, label: a("home.q3"), hash: "mensagens" },
    { to: "/mais", icon: Gift, label: a("home.q4"), hash: "presentes" },
  ] as const;

  return (
    <div className="app-screen">
      {/* HERO */}
      <section className="app-hero">
        <picture>
          <source media="(max-width: 768px)" srcSet="/hero-mobile.jpg" />
          <img
            src="/hero-desktop.jpg"
            alt="Joana e Diogo ao pôr do sol"
            className="app-hero-img"
            width={1920}
            height={1280}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <span className="app-hero-veil" aria-hidden="true" />
        <div className="app-hero-content">
          <h1 className="app-hero-title">{a("home.hero1")}</h1>
          <Script size="2.6rem" className="mt-1">{a("home.hero2")}</Script>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="text-center">
        <Label>{a("home.countdown")}</Label>
        <Script size="1.6rem" className="mt-1">{a("home.countdownSub")}</Script>

        <div className="app-count-grid mt-5">
          <Unit value={cd ? String(cd.d) : "—"} label={a("home.days")} />
          <Unit value={cd ? pad(cd.h) : "—"} label={a("home.hours")} />
          <Unit value={cd ? pad(cd.m) : "—"} label={a("home.mins")} />
          <Unit value={cd ? pad(cd.s) : "—"} label={a("home.secs")} />
        </div>

        {cd?.over ? <Label className="mt-4">{a("home.arrived")}</Label> : null}

        <Link to="/rsvp" className="app-btn-primary mt-6">
          <Plane size={16} strokeWidth={1.3} />
          {a("home.cta")}
        </Link>
      </section>

      <Ornament icon={<Plane size={14} strokeWidth={1.3} />} />

      {/* SHORTCUTS */}
      <section className="app-shortcuts">
        {shortcuts.map(({ to, icon: Icon, label, ...rest }) => (
          <Link
            key={label}
            to={to}
            hash={"hash" in rest ? (rest as { hash: string }).hash : undefined}
            className="app-shortcut"
          >
            <Icon size={22} strokeWidth={1.3} />
            <span>{label}</span>
          </Link>
        ))}
      </section>

      <Ornament icon={<Heart size={14} strokeWidth={1.3} />} />

      {/* CEREMONY */}
      <Card className="text-center">
        <Label size="0.68rem">{a("home.ceremony")}</Label>
        <p className="app-venue mt-2">
          GLICÍNIA
          <br />
          WEDDING HOUSE
        </p>
        <div className="app-inline-meta mt-3">
          <Clock size={14} strokeWidth={1.3} />
          <span>{a("home.ceremonyDesc")}</span>
        </div>
      </Card>
    </div>
  );
}
