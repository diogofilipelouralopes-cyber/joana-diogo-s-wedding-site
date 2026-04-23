import { createFileRoute } from "@tanstack/react-router";
import { Countdown } from "@/components/Countdown";
import { RsvpForm } from "@/components/RsvpForm";
import { Header } from "@/components/Header";
import { StorySection } from "@/components/StorySection";
import { GallerySection } from "@/components/GallerySection";
import { Monogram } from "@/components/Monogram";
import { GiftsSection } from "@/components/GiftsSection";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider, useI18n } from "@/lib/i18n";
import heroImg from "@/assets/hero-florals.jpg";
import { MapPin, Clock, Hotel, Heart, CalendarPlus, Shirt, Car, Plane } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Joana & Diogo · 19.09.2026" },
      {
        name: "description",
        content:
          "Joana & Diogo are getting married on September 19, 2026 at Glicínia Wedding House. RSVP today.",
      },
      { property: "og:title", content: "Joana & Diogo · 19.09.2026" },
      {
        property: "og:description",
        content: "Join us at Glicínia Wedding House to celebrate our day.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Lato:wght@300;400;700&family=Allura&family=Great+Vibes&display=swap",
      },
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

function downloadICS() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Joana & Diogo//Wedding//EN",
    "BEGIN:VEVENT",
    "UID:joana-diogo-2026@wedding",
    "DTSTAMP:20260101T000000Z",
    "DTSTART:20260919T130000Z",
    "DTEND:20260920T040000Z",
    "SUMMARY:Casamento Joana & Diogo",
    "LOCATION:Glicínia Wedding House, Freamunde, Portugal",
    "DESCRIPTION:Cerimónia às 14h00",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Joana-Diogo-2026.ics";
  link.click();
  URL.revokeObjectURL(url);
}

function Index() {
  const { t } = useI18n();

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" />
      <Header />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt=""
          width={1080}
          height={1920}
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30 sm:to-transparent" />

        <div className="relative z-10 px-6 sm:px-12 lg:px-24 py-32 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6">
            {t("hero.welcome")}
          </p>

          <div className="mb-8">
            <Monogram
              size={320}
              className="hidden sm:inline-block"
              topText="JOANA  ✦  DIOGO"
              bottomText="19  SETEMBRO  2026"
            />
            <Monogram
              size={240}
              className="sm:hidden"
              topText="JOANA  ✦  DIOGO"
              bottomText="19  SETEMBRO  2026"
            />
          </div>

          <p className="font-display italic text-2xl sm:text-3xl text-foreground/85 mb-2">
            {t("hero.date")}
          </p>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary mb-10 underline-offset-4 hover:underline"
          >
            {t("hero.location")}
          </a>

          <div className="mb-10">
            <Countdown />
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#rsvp"
              className="inline-block px-9 py-4 bg-primary text-primary-foreground font-display text-base tracking-[0.15em] hover:bg-primary/90 transition-colors uppercase"
            >
              {t("hero.cta")}
            </a>
            <button
              onClick={downloadICS}
              className="inline-flex items-center gap-2 px-7 py-4 border border-primary/50 text-primary font-display text-sm tracking-[0.15em] hover:bg-primary/5 transition-colors uppercase"
            >
              <CalendarPlus className="w-4 h-4" strokeWidth={1.5} />
              {t("hero.cal")}
            </button>
          </div>
        </div>
      </section>

      {/* STORY */}
      <StorySection />

      {/* GALLERY */}
      <GallerySection />

      {/* EVENT */}
      <section id="event" className="py-28 sm:py-40 px-6 bg-secondary/40 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
              The Ceremony
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-primary">{t("event.title")}</h2>
            <div className="divider-ornament mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>

          <div className="card-gold p-8 sm:p-10 text-center mb-8">
            <h3 className="font-display text-2xl sm:text-3xl text-primary tracking-[0.08em]">
              {t("event.venue")}
            </h3>
            <p className="text-foreground/75 mt-2">{t("event.place")}</p>

            <div className="flex justify-center gap-2 mt-4">
              <Clock className="w-4 h-4 text-primary/70 mt-0.5" strokeWidth={1.5} />
              <p className="text-sm text-foreground/85">{t("event.desc")}</p>
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-xs uppercase tracking-[0.22em] text-primary hover:text-primary/70 underline-offset-4 hover:underline"
            >
              <MapPin className="w-3.5 h-3.5" />
              {t("event.maps")}
            </a>
          </div>

          {/* Embedded map */}
          <div className="overflow-hidden card-gold">
            <iframe
              title="Glicínia Wedding House — mapa"
              src="https://www.google.com/maps?q=Glic%C3%ADnia+Wedding+House+Freamunde&output=embed"
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full border-0"
            />
          </div>
        </div>
      </section>

      {/* INFORMATION */}
      <section id="info" className="py-28 sm:py-40 px-6 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
              For our guests
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-primary">{t("info.title")}</h2>
            <div className="divider-ornament mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard icon={<Shirt className="w-6 h-6" strokeWidth={1.5} />} title={t("info.dress.title")} desc={t("info.dress.desc")} />
            <InfoCard icon={<Hotel className="w-6 h-6" strokeWidth={1.5} />} title={t("info.hotel.title")} desc={t("info.hotel.desc")} />
            <InfoCard icon={<Car className="w-6 h-6" strokeWidth={1.5} />} title={t("info.parking.title")} desc={t("info.parking.desc")} />
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-28 sm:py-40 px-6 bg-secondary/40 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
              {t("rsvp.subtitle")}
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-primary">{t("rsvp.title")}</h2>
            <div className="divider-ornament mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>
          <RsvpForm />
        </div>
      </section>

      {/* GIFTS */}
      <GiftsSection />

      {/* SAVE THE DATE / FOOTER */}
      <footer className="py-20 px-6 border-t border-border text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
          {t("footer.tagline")}
        </p>
        <div className="flex justify-center mb-6">
          <Monogram size={200} />
        </div>
        <p className="font-script text-4xl mt-4" style={{ color: "var(--gold)" }}>
          Save the Date
        </p>
      </footer>

      {/* FLOATING ACTIONS */}
      <a
        href="#rsvp"
        className="fixed bottom-6 right-6 z-40 px-5 py-3 bg-primary text-primary-foreground font-display text-sm tracking-[0.15em] uppercase shadow-lg hover:bg-primary/90 transition-all hover:-translate-y-0.5"
      >
        {t("hero.cta")}
      </a>
      <WhatsAppFab />
    </div>
  );
}

function InfoCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="card-gold p-8">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="font-display text-xl mb-3 text-primary">{title}</h3>
      <p className="text-sm leading-relaxed text-foreground/75">{desc}</p>
    </div>
  );
}
