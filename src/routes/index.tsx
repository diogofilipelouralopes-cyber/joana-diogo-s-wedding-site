import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useEffect, useState, lazy, Suspense } from "react";
import { RsvpForm } from "@/components/RsvpForm";
import { Header } from "@/components/Header";
import { StorySection } from "@/components/StorySection";
import { GiftsSection } from "@/components/GiftsSection";
import { MemoriesSection } from "@/components/MemoriesSection";
import { PublicGallerySection } from "@/components/PublicGallerySection";
import { FaqSection } from "@/components/FaqSection";
import { MessagesSection } from "@/components/MessagesSection";
import { SiteFooter } from "@/components/SiteFooter";
import { LiveAnnouncementBanner } from "@/components/LiveAnnouncementBanner";
import { BottomTabBar, type TabId } from "@/components/BottomTabBar";
import { ShareButton } from "@/components/ShareButton";
import { InstallButton } from "@/components/InstallButton";
// Chat widget pulls in shiki/oniguruma (WASM) through streamdown — must never
// enter the SSR/Worker import graph.
const ChatWidget = lazy(() => import("@/components/ChatWidget"));
import { Reveal } from "@/components/Reveal";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider, useI18n } from "@/lib/i18n";
import {
  MapPin,
  Clock,
  Hotel,
  Heart,
  Shirt,
  Car,
  Plane,
  ParkingCircle,
  CalendarHeart,
  Camera,
  Gift,
  MessageCircleHeart,
  Info,
  BookHeart,
  Share2,
  Smartphone,
  ChevronRight,
  ArrowLeft,
  Copy,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

const SITE_URL = "https://joanaediogo.com";

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { q: "A que horas devo chegar?", a: "A cerimónia começa pontualmente às 14h00. Sugerimos chegar entre 15 a 30 minutos antes." },
    { q: "Posso levar acompanhante?", a: "Fala connosco diretamente para que possamos organizar tudo da melhor forma." },
    { q: "Qual é o dress code?", a: "Sintam-se confortáveis e incríveis. Guardem o branco apenas para a noiva." },
    { q: "Há estacionamento no local?", a: "Sim, a Quinta Glicínia dispõe de estacionamento privativo e gratuito." },
    { q: "Há alojamento próximo?", a: "A Quinta Glicínia dispõe de alojamento no local com check-in a partir das 15h00." },
    { q: "Posso tirar fotografias durante a cerimónia?", a: "Pedimos que durante a cerimónia desfrutem do momento; após, à vontade." },
    { q: "Como ofereço um presente?", a: "A vossa presença é o nosso maior presente. Vejam a secção 'Presentes'." },
    { q: "Tenho restrições alimentares. O que faço?", a: "Indica todas as restrições no formulário RSVP e nós tratamos do resto." },
  ].map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const EVENT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Casamento Joana & Diogo",
  startDate: "2026-09-19T14:00:00+01:00",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "Glicínia Wedding House",
    address: { "@type": "PostalAddress", addressLocality: "Freamunde", addressCountry: "PT" },
  },
  organizer: { "@type": "Person", name: "Joana & Diogo" },
  url: SITE_URL + "/",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Joana & Diogo · Casamento 19.09.2026" },
      {
        name: "description",
        content:
          "Joana & Diogo casam-se a 19 de setembro de 2026 na Glicínia Wedding House. Confirma a tua presença, vê fotos e deixa uma mensagem.",
      },
      { property: "og:title", content: "Joana & Diogo · Casamento 19.09.2026" },
      {
        property: "og:description",
        content: "Junta-te a nós na Glicínia Wedding House para celebrar o nosso dia.",
      },
      { property: "og:url", content: SITE_URL + "/" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL + "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preload", as: "image", href: "/hero-desktop.jpg", fetchpriority: "high" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Lato:wght@300;400;700&family=Allura&family=Great+Vibes&display=swap",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(EVENT_JSONLD) },
      { type: "application/ld+json", children: JSON.stringify(FAQ_JSONLD) },
    ],
  }),
  component: () => (
    <I18nProvider>
      <Index />
    </I18nProvider>
  ),
});

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Glic%C3%ADnia+Wedding+House+Freamunde";
const WAZE_URL = "https://waze.com/ul?q=Glic%C3%ADnia%20Wedding%20House%20Freamunde";
const WA_CONTACT = "https://wa.me/351912633104";
const ADDRESS = "Glicínia Wedding House, Freamunde, Paços de Ferreira";

const HASH_BY_TAB: Record<TabId, string> = {
  home: "inicio",
  place: "local",
  photos: "fotos",
  rsvp: "rsvp",
  more: "mais",
};

function tabFromHash(hash: string): TabId {
  const h = hash.replace("#", "").toLowerCase();
  if (["local", "event", "evento", "travel"].includes(h)) return "place";
  if (["fotos", "photos", "galeria", "gallery"].includes(h)) return "photos";
  if (["rsvp", "confirmar"].includes(h)) return "rsvp";
  if (["mais", "more", "info", "faq", "gifts", "presentes", "mensagens", "story"].includes(h)) return "more";
  return "home";
}

function Index() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<TabId>("home");

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    setTab(tabFromHash(window.location.hash));
    const onHash = () => setTab(tabFromHash(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const goTab = (next: TabId) => {
    setTab(next);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${HASH_BY_TAB[next]}`);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <LiveAnnouncementBanner />
      <div id="top" className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Toaster position="top-center" />
        <Header />

        <main className="app-main" style={{ paddingBottom: 96 }}>
          {tab === "home" && <HomeScreen goTab={goTab} />}
          {tab === "place" && <PlaceScreen />}
          {tab === "photos" && (
            <>
              <Reveal><MemoriesSection /></Reveal>
              <Reveal><PublicGallerySection /></Reveal>
            </>
          )}
          {tab === "rsvp" && (
            <section id="rsvp" className="py-6 sm:py-14 px-4 sm:px-6">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-5 sm:mb-10">
                  <h2 className="font-display text-3xl sm:text-5xl text-primary">{t("rsvp.title")}</h2>
                  <div className="divider-ornament mt-3 sm:mt-6 max-w-xs mx-auto">
                    <Heart className="w-3 h-3" strokeWidth={1} />
                  </div>
                </div>
                <RsvpForm />
              </div>
            </section>
          )}
          {tab === "more" && <MoreScreen />}
        </main>

        <SiteFooter />
      </div>

      <BottomTabBar tab={tab} onChange={goTab} />
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </ClientOnly>
      {/* Acessibilidade de idioma mantida no header */}
      <span className="sr-only">{lang}</span>
    </>
  );
}

/* ---------------- HOME ---------------- */

const TARGET_MIDNIGHT = new Date("2026-09-19T00:00:00+01:00");

function daysLeft() {
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const b = new Date(
    TARGET_MIDNIGHT.getFullYear(),
    TARGET_MIDNIGHT.getMonth(),
    TARGET_MIDNIGHT.getDate()
  ).getTime();
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

function HomeScreen({ goTab }: { goTab: (t: TabId) => void }) {
  const { t } = useI18n();
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysLeft());
    const id = setInterval(() => setDays(daysLeft()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="px-4" style={{ paddingTop: 16 }}>
      <div className="mx-auto w-full" style={{ maxWidth: 560 }}>
        {/* HERO CARD */}
        <section
          className="relative overflow-hidden flex flex-col items-center justify-center text-center px-4"
          style={{
            height: 300,
            borderRadius: 14,
            border: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)",
          }}
        >
          <picture>
            <source media="(max-width: 768px)" srcSet="/hero-mobile.jpg" />
            <img
              src="/hero-desktop.jpg"
              alt="Joana e Diogo ao pôr do sol"
              className="absolute inset-0 w-full h-full object-cover"
              width={1920}
              height={1280}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "color-mix(in oklab, var(--cream) 45%, transparent)" }}
          />
          <div className="relative z-10">
            <h1
              className="uppercase"
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: "0.98rem",
                letterSpacing: "0.25em",
                color: "var(--olive)",
                fontWeight: 500,
              }}
            >
              {t("hero.tagline")}
            </h1>
            <p
              className="italic"
              style={{
                fontFamily: "Allura, 'Great Vibes', cursive",
                color: "var(--gold)",
                fontSize: "2.4rem",
                lineHeight: 1.1,
                marginTop: 8,
              }}
            >
              {t("hero.tagline.script")}
            </p>
          </div>
        </section>

        {/* COUNTDOWN LINE */}
        <p
          className="text-center uppercase"
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            color: "var(--gold)",
            marginTop: 14,
          }}
        >
          {t("home.days")}{" "}
          <span suppressHydrationWarning style={{ color: "var(--olive)", fontSize: "1.15rem" }}>
            {days ?? "—"}
          </span>{" "}
          {t("count.days")} · {t("home.when")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-2" style={{ marginTop: 16 }}>
          <button type="button" onClick={() => goTab("place")} className="btn-solid-olive">
            <MapPin size={17} strokeWidth={1.6} />
            {t("home.cta.directions")}
          </button>
          <button type="button" onClick={() => goTab("rsvp")} className="btn-outline-gold">
            <CalendarHeart size={17} strokeWidth={1.6} />
            {t("home.cta.rsvp")}
          </button>
        </div>

        {/* ESSENTIALS */}
        <div
          style={{
            marginTop: 18,
            background: "var(--ivory)",
            border: "1px solid color-mix(in oklab, var(--gold) 45%, transparent)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <p
            className="uppercase"
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.72rem",
              letterSpacing: "0.25em",
              color: "var(--olive)",
              marginBottom: 12,
            }}
          >
            {t("home.essentials")}
          </p>
          <EssentialRow icon={<CalendarHeart size={16} strokeWidth={1.5} />} text={t("home.e.date")} />
          <EssentialRow icon={<Clock size={16} strokeWidth={1.5} />} text={t("home.e.time")} />
          <EssentialRow icon={<MapPin size={16} strokeWidth={1.5} />} text={t("home.e.place")} />
          <EssentialRow icon={<Shirt size={16} strokeWidth={1.5} />} text={t("home.e.dress")} />
        </div>

        <Ornament icon={<Plane size={14} strokeWidth={1.25} />} />

        {/* SHORTCUTS */}
        <div className="grid grid-cols-2 gap-2">
          <Shortcut icon={<Camera size={22} strokeWidth={1.4} />} label={t("home.s.photos")} onClick={() => goTab("photos")} />
          <Shortcut icon={<CalendarHeart size={22} strokeWidth={1.4} />} label={t("home.s.rsvp")} onClick={() => goTab("rsvp")} />
          <Shortcut icon={<MessageCircleHeart size={22} strokeWidth={1.4} />} label={t("home.s.message")} onClick={() => goTab("more")} />
          <Shortcut icon={<Gift size={22} strokeWidth={1.4} />} label={t("home.s.gifts")} onClick={() => goTab("more")} />
        </div>
      </div>

      <style>{`
        .btn-solid-olive, .btn-outline-gold {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; height: 48px; border-radius: 8px;
          font-family: "Cinzel", serif; text-transform: uppercase;
          font-size: 0.74rem; letter-spacing: 0.2em;
        }
        .btn-solid-olive { background: var(--olive); color: var(--ivory); }
        .btn-outline-gold {
          background: transparent; color: var(--gold);
          border: 1px solid var(--gold);
        }
      `}</style>
    </div>
  );
}

function EssentialRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3" style={{ marginTop: 8 }}>
      <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <span style={{ fontFamily: "Lato, sans-serif", fontSize: "0.86rem", color: "var(--olive)" }}>{text}</span>
    </div>
  );
}

function Ornament({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center" style={{ marginTop: 20, marginBottom: 14 }}>
      <span aria-hidden style={{ width: 60, borderTop: "1px dashed color-mix(in oklab, var(--gold) 60%, transparent)" }} />
      <span className="mx-3" style={{ color: "var(--gold)" }}>{icon}</span>
      <span aria-hidden style={{ width: 60, borderTop: "1px dashed color-mix(in oklab, var(--gold) 60%, transparent)" }} />
    </div>
  );
}

function Shortcut({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2"
      style={{
        background: "var(--ivory)",
        border: "1px solid color-mix(in oklab, var(--gold) 45%, transparent)",
        borderRadius: 10,
        padding: "16px 8px",
        color: "var(--gold)",
        minHeight: 84,
      }}
    >
      {icon}
      <span
        className="uppercase"
        style={{ fontFamily: "Cinzel, serif", fontSize: "0.66rem", letterSpacing: "0.18em", color: "var(--olive)" }}
      >
        {label}
      </span>
    </button>
  );
}

/* ---------------- PLACE ---------------- */

function PlaceScreen() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(ADDRESS).then(() => {
      setCopied(true);
      toast.success(t("place.copied"));
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div id="event" className="px-4" style={{ paddingTop: 16 }}>
      <div className="mx-auto w-full" style={{ maxWidth: 560 }}>
        <div className="text-center">
          <p
            className="uppercase"
            style={{ fontFamily: "Cinzel, serif", fontSize: "0.72rem", letterSpacing: "0.25em", color: "var(--gold)" }}
          >
            {t("place.kicker")}
          </p>
          <h2
            className="uppercase"
            style={{
              fontFamily: "Cinzel, serif",
              color: "var(--olive)",
              letterSpacing: "0.2em",
              fontSize: "1.05rem",
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            Glicínia Wedding House
          </h2>
        </div>

        <div
          className="overflow-hidden"
          style={{
            marginTop: 14,
            background: "var(--ivory)",
            border: "1px solid color-mix(in oklab, var(--gold) 45%, transparent)",
            borderRadius: 12,
          }}
        >
          <iframe
            title="Glicínia Wedding House — mapa"
            src="https://www.google.com/maps?q=Glic%C3%ADnia+Wedding+House+Freamunde&output=embed"
            width="100%"
            height="148"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full border-0"
            style={{ height: 148 }}
          />
          <div style={{ padding: 18 }}>
            <div className="flex items-start gap-2">
              <MapPin size={16} strokeWidth={1.5} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontFamily: "Lato, sans-serif", fontSize: "0.86rem", color: "var(--olive)" }}>
                {t("place.address")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2" style={{ marginTop: 14 }}>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="place-btn place-btn-solid">
                <MapPin size={16} strokeWidth={1.6} /> Google Maps
              </a>
              <a href={WAZE_URL} target="_blank" rel="noopener noreferrer" className="place-btn place-btn-outline">
                <Car size={16} strokeWidth={1.6} /> Waze
              </a>
            </div>

            <div className="flex items-center justify-between gap-3" style={{ marginTop: 14 }}>
              <span
                className="uppercase"
                style={{ fontFamily: "Cinzel, serif", fontSize: "0.66rem", letterSpacing: "0.2em", color: "var(--olive)" }}
              >
                {t("place.addressLabel")}
              </span>
              <button
                type="button"
                onClick={copyAddress}
                className="inline-flex items-center gap-2"
                style={{ color: "var(--gold)", fontFamily: "Lato, sans-serif", fontSize: "0.8rem", minHeight: 44 }}
              >
                <Copy size={14} strokeWidth={1.6} />
                {copied ? t("place.copied") : t("place.copy")}
              </button>
            </div>
          </div>
        </div>

        <Ornament icon={<Plane size={14} strokeWidth={1.25} />} />

        <div className="grid grid-cols-2 gap-2">
          <TravelCard icon={<MapPin size={24} strokeWidth={1.5} />} title={t("travel.porto")} desc={t("travel.porto.desc")} />
          <TravelCard icon={<Plane size={24} strokeWidth={1.5} />} title={t("travel.airport")} desc={t("travel.airport.desc")} />
          <TravelCard icon={<ParkingCircle size={24} strokeWidth={1.5} />} title={t("travel.parking")} desc={t("travel.parking.desc")} />
          <TravelCard icon={<Hotel size={24} strokeWidth={1.5} />} title={t("place.accommodation")} desc={t("place.accommodation.desc")} />
        </div>

        <div
          style={{
            marginTop: 16,
            background: "var(--ivory)",
            border: "1px solid color-mix(in oklab, var(--gold) 45%, transparent)",
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div className="flex items-center gap-2">
            <Clock size={16} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
            <p
              className="uppercase"
              style={{ fontFamily: "Cinzel, serif", fontSize: "0.72rem", letterSpacing: "0.2em", color: "var(--olive)" }}
            >
              {t("place.when.title")}
            </p>
          </div>
          <p style={{ fontFamily: "Lato, sans-serif", fontSize: "0.86rem", color: "var(--olive)", marginTop: 8 }}>
            {t("place.when.desc")}
          </p>
          <a
            href={WA_CONTACT}
            target="_blank"
            rel="noopener noreferrer"
            className="place-btn place-btn-outline"
            style={{ marginTop: 14 }}
          >
            {t("place.contact")}
          </a>
        </div>
      </div>

      <style>{`
        .place-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          height: 48px; border-radius: 8px;
          font-family: "Cinzel", serif; text-transform: uppercase;
          font-size: 0.7rem; letter-spacing: 0.18em;
        }
        .place-btn-solid { background: var(--olive); color: var(--ivory); }
        .place-btn-outline { background: transparent; color: var(--gold); border: 1px solid var(--gold); }
      `}</style>
    </div>
  );
}

/* ---------------- MORE ---------------- */

type MoreId = "info" | "gifts" | "messages" | "story" | "share" | "install";

function MoreScreen() {
  const { t } = useI18n();
  const [sub, setSub] = useState<MoreId | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [sub]);

  if (sub) {
    return (
      <div style={{ paddingTop: 12 }}>
        <div className="px-4">
          <button
            type="button"
            onClick={() => setSub(null)}
            className="inline-flex items-center gap-2"
            style={{
              minHeight: 44,
              color: "var(--gold)",
              fontFamily: "Cinzel, serif",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            <ArrowLeft size={16} strokeWidth={1.6} />
            {t("more.back")}
          </button>
        </div>
        {sub === "info" && <InfoSection />}
        {sub === "gifts" && <GiftsSection />}
        {sub === "messages" && <MessagesSection />}
        {sub === "story" && <StorySection />}
        {sub === "share" && (
          <div className="px-4 py-10 flex justify-center">
            <ShareButton />
          </div>
        )}
        {sub === "install" && (
          <div className="px-4 py-10 flex justify-center">
            <InstallButton />
          </div>
        )}
      </div>
    );
  }

  const rows: { id: MoreId; icon: React.ReactNode; title: string; desc: string }[] = [
    { id: "info", icon: <Info size={18} strokeWidth={1.5} />, title: t("more.info"), desc: t("more.info.desc") },
    { id: "gifts", icon: <Gift size={18} strokeWidth={1.5} />, title: t("more.gifts"), desc: t("more.gifts.desc") },
    { id: "messages", icon: <MessageCircleHeart size={18} strokeWidth={1.5} />, title: t("more.msg"), desc: t("more.msg.desc") },
    { id: "story", icon: <BookHeart size={18} strokeWidth={1.5} />, title: t("more.story"), desc: t("more.story.desc") },
    { id: "share", icon: <Share2 size={18} strokeWidth={1.5} />, title: t("more.share"), desc: t("more.share.desc") },
    { id: "install", icon: <Smartphone size={18} strokeWidth={1.5} />, title: t("more.install"), desc: t("more.install.desc") },
  ];

  return (
    <div style={{ paddingTop: 16 }}>
      <div className="px-4 mx-auto w-full" style={{ maxWidth: 560 }}>
        <div className="text-center">
          <h2
            className="uppercase"
            style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.25em", fontSize: "1.05rem", fontWeight: 500 }}
          >
            {t("more.title")}
          </h2>
          <p
            className="italic"
            style={{ fontFamily: "Allura, 'Great Vibes', cursive", color: "var(--gold)", fontSize: "1.9rem", lineHeight: 1.1 }}
          >
            {t("more.subtitle")}
          </p>
        </div>

        <div
          className="overflow-hidden"
          style={{
            marginTop: 14,
            background: "var(--ivory)",
            border: "1px solid color-mix(in oklab, var(--gold) 45%, transparent)",
            borderRadius: 12,
          }}
        >
          {rows.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSub(r.id)}
              className="w-full flex items-center gap-3 text-left px-4"
              style={{
                height: 56,
                borderTop: i === 0 ? "none" : "1px dashed color-mix(in oklab, var(--gold) 45%, transparent)",
                background: "transparent",
              }}
            >
              <span style={{ color: "var(--gold)", flexShrink: 0 }}>{r.icon}</span>
              <span className="flex-1 min-w-0">
                <span
                  className="block truncate"
                  style={{ fontFamily: "Cinzel, serif", fontSize: "0.8rem", color: "var(--olive)" }}
                >
                  {r.title}
                </span>
                <span
                  className="block truncate"
                  style={{ fontFamily: "Lato, sans-serif", fontSize: "0.72rem", color: "var(--gold)" }}
                >
                  {r.desc}
                </span>
              </span>
              <ChevronRight size={16} strokeWidth={1.5} style={{ color: "var(--gold)", flexShrink: 0 }} />
            </button>
          ))}
        </div>

        <Ornament icon={<HelpCircle size={14} strokeWidth={1.25} />} />
      </div>

      <FaqSection compact />
    </div>
  );
}

function InfoSection() {
  const { t } = useI18n();
  return (
    <section id="info" className="py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-5">
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground mb-2">{t("info.kicker")}</p>
          <h2 className="font-display text-3xl text-primary">{t("info.title")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-6">
          <InfoCard icon={<Shirt className="w-6 h-6" strokeWidth={1.5} />} title={t("info.dress.title")} desc={t("info.dress.desc")} />
          <InfoCard icon={<Hotel className="w-6 h-6" strokeWidth={1.5} />} title={t("info.hotel.title")} desc={t("info.hotel.desc")} />
          <InfoCard icon={<Car className="w-6 h-6" strokeWidth={1.5} />} title={t("info.parking.title")} desc={t("info.parking.desc")} />
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card-gold p-4 sm:p-8">
      <div className="flex items-center gap-3 mb-2 sm:block">
        <div className="text-primary shrink-0 sm:mb-4">{icon}</div>
        <h3 className="font-display text-sm sm:text-lg sm:mb-3 text-primary break-words min-w-0" style={{ letterSpacing: "0.16em" }}>
          {title}
        </h3>
      </div>
      <p className="text-[0.82rem] sm:text-sm leading-snug sm:leading-relaxed text-foreground/75">{desc}</p>
    </div>
  );
}

function TravelCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div
      className="travel-card text-center transition-all p-3 sm:p-5"
      style={{
        background: "var(--ivory)",
        border: "1px solid color-mix(in oklab, var(--gold) 55%, transparent)",
        borderRadius: 8,
      }}
    >
      <div className="flex justify-center" style={{ color: "var(--olive)" }}>
        {icon}
      </div>
      <p
        className="uppercase mt-2 text-[0.68rem] sm:text-xs"
        style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.2em", fontWeight: 500 }}
      >
        {title}
      </p>
      <p className="mt-0.5 text-[0.8rem] sm:text-sm" style={{ fontFamily: "Lato, sans-serif", color: "var(--gold)", fontWeight: 400 }}>
        {desc}
      </p>
    </div>
  );
}
