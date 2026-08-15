import { useEffect, useState } from "react";
import { MapPin, Camera, Gift, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Monogram } from "@/components/Monogram";
import { downloadWeddingICS } from "@/lib/calendar";
import { AppButton, AppCard, TileButton } from "./ui";
import type { TabId } from "./BottomTabBar";
import heroMobile from "@/assets/hero-mobile.jpg";

const TARGET = new Date("2026-09-19T14:00:00+01:00").getTime();
const WHATSAPP_URL = "https://wa.me/351912345678";

function diff(now: number) {
  const d = Math.max(0, TARGET - now);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    mins: Math.floor((d / 60000) % 60),
    secs: Math.floor((d / 1000) % 60),
    over: d <= 0,
  };
}

export function HomeTab({ go }: { go: (t: TabId) => void }) {
  const { t, lang } = useI18n();
  const [time, setTime] = useState(() => diff(Date.now()));

  useEffect(() => {
    setTime(diff(Date.now()));
    const id = setInterval(() => setTime(diff(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="app-hero">
        <img src={heroMobile} alt="Joana e Diogo" className="app-hero-img" />
        <div className="app-hero-veil" aria-hidden="true" />
        <div className="app-hero-content">
          <Monogram size={132} />
          <h1 className="app-hero-title">{t("hero.tagline")}</h1>
          <p className="app-hero-script">{t("hero.tagline.script")}</p>
          <span className="app-hero-rule" aria-hidden="true" />
          <p className="app-hero-date">19 · 09 · 2026</p>
          <p className="app-hero-place">Glicínia Wedding House · Freamunde</p>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="app-section">
        <p className="app-kicker app-center">{t("count.title")}</p>
        {time.over ? (
          <p className="app-count-over">{t("count.over")}</p>
        ) : (
          <div className="app-count-grid">
            <CountCard value={time.days} label={t("count.days")} />
            <CountCard value={time.hours} label={t("count.hours")} />
            <CountCard value={time.mins} label={t("count.mins")} />
            <CountCard value={time.secs} label={t("count.secs")} />
          </div>
        )}

        <div className="app-stack">
          <AppButton onClick={() => go("rsvp")}>{t("hero.cta")}</AppButton>
          <AppButton variant="outline" onClick={downloadWeddingICS}>
            {t("hero.cal")}
          </AppButton>
        </div>

        <div className="app-tile-grid">
          <TileButton
            icon={<MapPin size={22} strokeWidth={1.3} />}
            label={lang === "en" ? "Venue" : "Local"}
            onClick={() => go("local")}
          />
          <TileButton
            icon={<Camera size={22} strokeWidth={1.3} />}
            label={lang === "en" ? "Photos" : "Fotos"}
            onClick={() => go("fotos")}
          />
          <TileButton
            icon={<Gift size={22} strokeWidth={1.3} />}
            label={lang === "en" ? "Gifts" : "Presentes"}
            onClick={() => go("mais")}
          />
          <TileButton
            icon={<MessageCircle size={22} strokeWidth={1.3} />}
            label={lang === "en" ? "Contact" : "Contactos"}
            href={WHATSAPP_URL}
          />
        </div>

        {/* O DIA */}
        <AppCard className="app-timeline-card">
          <p className="app-kicker">{lang === "en" ? "The day" : "O dia"}</p>
          <ol className="app-timeline">
            <li>
              <span className="app-dot" aria-hidden="true" />
              <p className="app-time">13H30 — 13H45</p>
              <p className="app-body">
                {lang === "en"
                  ? "Guests arrive. Come a little earlier to settle in calmly."
                  : "Chegada dos convidados. Vem um pouco antes para te acomodares com calma."}
              </p>
            </li>
            <li>
              <span className="app-dot app-dot-full" aria-hidden="true" />
              <p className="app-time">14H00</p>
              <p className="app-body">
                {lang === "en"
                  ? "Ceremony, on time. The reception follows at the same venue."
                  : "Cerimónia, pontualmente. A receção segue no mesmo local."}
              </p>
            </li>
          </ol>
          <p className="app-note">
            {lang === "en"
              ? "The rest of the programme will be shared closer to the day."
              : "O resto do programa será partilhado mais perto do dia."}
          </p>
        </AppCard>
      </section>
    </>
  );
}

function CountCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="app-count-card">
      <span suppressHydrationWarning className="app-count-value">
        {String(value).padStart(2, "0")}
      </span>
      <span className="app-count-label">{label}</span>
    </div>
  );
}
