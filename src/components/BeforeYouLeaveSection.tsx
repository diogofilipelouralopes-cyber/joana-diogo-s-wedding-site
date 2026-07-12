import { Heart, Clock, MapPin, Shirt, PhoneCall, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Glic%C3%ADnia+Wedding+House+Freamunde";

export function BeforeYouLeaveSection() {
  const { t } = useI18n();

  return (
    <section
      id="antes-de-sair"
      className="py-20 sm:py-28 md:py-40 px-5 sm:px-6 scroll-mt-24"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
            {t("beforeLeave.kicker")}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-primary">
            {t("beforeLeave.title")}
          </h2>
          <div className="divider-ornament mt-6 max-w-xs mx-auto">
            <Heart className="w-3 h-3" strokeWidth={1} />
          </div>
          <p
            className="mt-6 text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "var(--foreground)", opacity: 0.8 }}
          >
            {t("beforeLeave.subtitle")}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
          <Reveal delay={0}>
            <BeforeCard
              icon={<Clock size={28} strokeWidth={1.5} />}
              title={t("beforeLeave.arrival.title")}
              body={t("beforeLeave.arrival.body")}
            />
          </Reveal>

          <Reveal delay={80}>
            <BeforeCard
              icon={<MapPin size={28} strokeWidth={1.5} />}
              title={t("beforeLeave.location.title")}
              body={t("beforeLeave.location.body")}
              footer={
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 mt-5 w-full sm:w-auto px-6 py-3 uppercase transition-all hover:-translate-y-0.5"
                  style={{
                    fontFamily: "Cinzel, serif",
                    letterSpacing: "0.25em",
                    fontSize: "0.75rem",
                    color: "var(--gold)",
                    border: "1px solid var(--gold)",
                    borderRadius: 8,
                    background: "transparent",
                    minHeight: 44,
                  }}
                >
                  <MapPin size={14} strokeWidth={1.5} />
                  {t("beforeLeave.location.cta")}
                  <ExternalLink size={12} strokeWidth={1.5} />
                </a>
              }
            />
          </Reveal>

          <Reveal delay={160}>
            <BeforeCard
              icon={<Shirt size={28} strokeWidth={1.5} />}
              title={t("beforeLeave.dress.title")}
              body={t("beforeLeave.dress.body")}
            />
          </Reveal>

          <Reveal delay={240}>
            <BeforeCard
              icon={<PhoneCall size={28} strokeWidth={1.5} />}
              title={t("beforeLeave.help.title")}
              body={t("beforeLeave.help.body")}
              footer={
                <>
                  <div
                    className="mt-5 p-4 text-center"
                    style={{
                      background:
                        "color-mix(in oklab, var(--gold) 8%, transparent)",
                      border:
                        "1px dashed color-mix(in oklab, var(--gold) 50%, transparent)",
                      borderRadius: 10,
                      fontFamily: "Cinzel, serif",
                      color: "var(--olive)",
                      fontSize: "0.85rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {t("beforeLeave.help.pending")}
                  </div>
                  <p
                    className="mt-4 text-sm italic"
                    style={{ color: "var(--foreground)", opacity: 0.75 }}
                  >
                    {t("beforeLeave.help.note")}
                  </p>
                </>
              }
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BeforeCard({
  icon,
  title,
  body,
  footer,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  footer?: React.ReactNode;
}) {
  return (
    <article
      className="before-card h-full transition-all duration-300"
      style={{
        background: "#ffffff",
        borderRadius: 18,
        padding: "32px 28px",
        boxShadow:
          "0 1px 2px color-mix(in oklab, var(--olive) 6%, transparent), 0 12px 30px -18px color-mix(in oklab, var(--olive) 20%, transparent)",
        border:
          "1px solid color-mix(in oklab, var(--gold) 22%, transparent)",
      }}
    >
      <div
        className="inline-flex items-center justify-center mb-5"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "color-mix(in oklab, var(--olive) 10%, transparent)",
          color: "var(--olive)",
        }}
      >
        {icon}
      </div>
      <h3
        className="uppercase text-base sm:text-lg mb-3"
        style={{
          fontFamily: "Cinzel, serif",
          color: "var(--primary, var(--olive))",
          letterSpacing: "0.22em",
          fontWeight: 500,
        }}
      >
        {title}
      </h3>
      <p
        className="text-sm sm:text-base leading-relaxed"
        style={{
          color: "var(--foreground)",
          opacity: 0.82,
          whiteSpace: "pre-line",
        }}
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {footer}
      <style>{`
        .before-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 2px 4px color-mix(in oklab, var(--olive) 8%, transparent),
            0 22px 45px -20px color-mix(in oklab, var(--olive) 28%, transparent);
        }
      `}</style>
    </article>
  );
}
