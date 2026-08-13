import { Heart, Shirt, Hotel, Car } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function InfoSection() {
  const { t } = useI18n();

  return (
    <section id="info" className="py-10 sm:py-16 md:py-24 px-5 sm:px-6 scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-12">
          <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
            {t("info.kicker")}
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-primary">{t("info.title")}</h2>
          <div className="divider-ornament mt-5 max-w-xs mx-auto">
            <Heart className="w-3 h-3" strokeWidth={1} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          <InfoCard icon={<Shirt className="w-6 h-6" strokeWidth={1.5} />} title={t("info.dress.title")} desc={t("info.dress.desc")} />
          <InfoCard icon={<Hotel className="w-6 h-6" strokeWidth={1.5} />} title={t("info.hotel.title")} desc={t("info.hotel.desc")} />
          <InfoCard icon={<Car className="w-6 h-6" strokeWidth={1.5} />} title={t("info.parking.title")} desc={t("info.parking.desc")} />
        </div>
      </div>
    </section>
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
    <div className="card-gold p-5 sm:p-7">
      <div className="text-primary mb-3">{icon}</div>
      <h3 className="font-display text-base sm:text-lg mb-2 text-primary break-words" style={{ letterSpacing: "0.18em" }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-foreground/75">{desc}</p>
    </div>
  );
}
