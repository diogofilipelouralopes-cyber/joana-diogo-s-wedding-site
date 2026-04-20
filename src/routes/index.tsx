import { createFileRoute } from "@tanstack/react-router";
import { Countdown } from "@/components/Countdown";
import { RsvpForm } from "@/components/RsvpForm";
import { Toaster } from "@/components/ui/sonner";
import heroImg from "@/assets/hero-florals.jpg";
import venueImg from "@/assets/venue.jpg";
import { MapPin, Clock, Hotel, Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Joana & Diogo · September 19, 2026" },
      {
        name: "description",
        content:
          "Joana & Diogo are getting married on September 19, 2026 at Glicínia Wedding House. RSVP today.",
      },
      { property: "og:title", content: "Joana & Diogo · September 19, 2026" },
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
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Inter:wght@300;400;500&family=Pinyon+Script&display=swap",
      },
    ],
  }),
  component: Index,
});

const VENUE_ADDRESS = "Glicínia Wedding House, Portugal";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Glic%C3%ADnia+Wedding+House";

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt=""
          width={1080}
          height={1920}
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20 sm:to-transparent" />

        <div className="relative z-10 px-6 sm:px-12 lg:px-24 py-24 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6">
            Save the date
          </p>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.95] text-primary">
            Joana
            <span className="block font-script text-5xl sm:text-6xl lg:text-7xl text-foreground/70 my-2 sm:my-4">
              &amp;
            </span>
            Diogo
          </h1>

          <div className="divider-ornament my-8 max-w-xs">
            <Heart className="w-3 h-3" strokeWidth={1} />
          </div>

          <p className="text-sm sm:text-base uppercase tracking-[0.3em] text-foreground/80 mb-10">
            19 · Setembro · 2026
          </p>

          <div className="mb-10 max-w-md">
            <Countdown />
          </div>

          <a
            href="#rsvp"
            className="inline-block px-10 py-4 bg-primary text-primary-foreground font-display text-lg tracking-wider hover:bg-primary/90 transition-colors"
          >
            Confirmar Presença
          </a>
        </div>
      </section>

      {/* EVENT */}
      <section className="py-24 sm:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
              A cerimónia
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-primary">O Lugar</h2>
            <div className="divider-ornament mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block group overflow-hidden"
            >
              <img
                src={venueImg}
                alt="Glicínia Wedding House"
                width={1536}
                height={1024}
                loading="lazy"
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </a>

            <div className="space-y-6 md:pl-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                  Espaço
                </p>
                <h3 className="font-display text-3xl sm:text-4xl text-primary">
                  Glicínia Wedding House
                </h3>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 mt-1 text-primary/70 shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Hora
                    </p>
                    <p className="font-display text-xl">14:00</p>
                  </div>
                </div>

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <MapPin className="w-5 h-5 mt-1 text-primary/70 shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Morada
                    </p>
                    <p className="font-display text-xl group-hover:text-primary transition-colors">
                      {VENUE_ADDRESS}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 underline underline-offset-4">
                      Abrir no Google Maps →
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFORMATION */}
      <section className="py-24 sm:py-32 px-6 bg-secondary/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
              Para si
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-primary">Informações</h2>
            <div className="divider-ornament mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-background p-8 sm:p-10 border border-border">
              <Hotel className="w-6 h-6 text-primary mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-2xl mb-4 text-primary">Alojamento</h3>
              <ul className="space-y-3 text-sm leading-relaxed text-foreground/80">
                <li>· Hotel disponível no local</li>
                <li>· Check-in a partir das 15:00, após a cerimónia</li>
                <li>· Reservas feitas diretamente com os noivos</li>
              </ul>
            </div>

            <div className="bg-background p-8 sm:p-10 border border-border">
              <Clock className="w-6 h-6 text-primary mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-2xl mb-4 text-primary">O Dia</h3>
              <ul className="space-y-3 text-sm leading-relaxed text-foreground/80">
                <li className="flex justify-between gap-4">
                  <span>Cerimónia</span>
                  <span className="font-display text-base text-primary">14:00</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Cocktail</span>
                  <span className="font-display text-base text-primary">15:30</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Jantar</span>
                  <span className="font-display text-base text-primary">19:30</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Festa</span>
                  <span className="font-display text-base text-primary">22:00</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-24 sm:py-32 px-6 scroll-mt-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
              Por favor responda até 1 de Agosto
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-primary">Confirme Presença</h2>
            <div className="divider-ornament mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
          </div>
          <RsvpForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 border-t border-border text-center">
        <p className="font-script text-3xl text-primary mb-2">Joana &amp; Diogo</p>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          19 · 09 · 2026
        </p>
      </footer>

      {/* FLOATING RSVP BUTTON */}
      <a
        href="#rsvp"
        className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-primary text-primary-foreground font-display text-sm tracking-wider shadow-lg hover:bg-primary/90 transition-all hover:-translate-y-0.5"
      >
        Confirmar Presença
      </a>
    </div>
  );
}
