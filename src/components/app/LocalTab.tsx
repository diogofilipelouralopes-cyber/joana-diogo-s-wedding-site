import { Clock, MapPin, Plane, ParkingCircle, Shirt, Hotel, Car } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AppButton, AppCard, SectionHead } from "./ui";
import venue from "@/assets/venue.jpg";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Glic%C3%ADnia+Wedding+House+Freamunde";
const WAZE_URL = "https://waze.com/ul?q=Glicinia%20Wedding%20House%20Freamunde";

export function LocalTab() {
  const { t, lang } = useI18n();

  return (
    <section className="app-section">
      <SectionHead kicker={t("event.kicker")} script={t("event.title")} />

      <AppCard className="app-venue-card">
        <img src={venue} alt="Glicínia Wedding House" className="app-venue-img" loading="lazy" />
        <div className="app-venue-body">
          <h2 className="app-h2">Glicínia Wedding House</h2>
          <p className="app-inline">
            <Clock size={15} strokeWidth={1.3} aria-hidden="true" />
            <span>{t("event.desc")} · Freamunde</span>
          </p>
          <div className="app-duo">
            <AppButton variant="outline" href={MAPS_URL}>
              Google Maps
            </AppButton>
            <AppButton variant="outline" href={WAZE_URL}>
              Waze
            </AppButton>
          </div>
        </div>
      </AppCard>

      <div className="app-map-frame">
        <iframe
          title="Glicínia Wedding House — mapa"
          src="https://www.google.com/maps?q=Glic%C3%ADnia+Wedding+House+Freamunde&output=embed"
          width="100%"
          height="240"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0, display: "block" }}
        />
      </div>

      <p className="app-kicker app-mt">{t("travel.title")}</p>
      <div className="app-duo-grid">
        <MiniCard icon={<MapPin size={20} strokeWidth={1.3} />} title={t("travel.porto")} desc={t("travel.porto.desc")} />
        <MiniCard icon={<MapPin size={20} strokeWidth={1.3} />} title={t("travel.aveiro")} desc={t("travel.aveiro.desc")} />
        <MiniCard icon={<Plane size={20} strokeWidth={1.3} />} title={t("travel.airport")} desc={t("travel.airport.desc")} />
        <MiniCard icon={<ParkingCircle size={20} strokeWidth={1.3} />} title={t("travel.parking")} desc={t("travel.parking.desc")} />
      </div>

      <p className="app-kicker app-mt">{t("info.kicker")}</p>
      <div className="app-stack">
        <InfoCard icon={<Shirt size={17} strokeWidth={1.3} />} title={t("info.dress.title")} desc={t("info.dress.desc")} />
        <InfoCard icon={<Hotel size={17} strokeWidth={1.3} />} title={t("info.hotel.title")} desc={t("info.hotel.desc")} />
        <InfoCard icon={<Car size={17} strokeWidth={1.3} />} title={t("info.parking.title")} desc={t("info.parking.desc")} />
      </div>

      <p className="app-note app-center">
        {lang === "en"
          ? "Any questions about getting there? Talk to us."
          : "Dúvidas sobre como chegar? Fala connosco."}
      </p>
    </section>
  );
}

function MiniCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <AppCard className="app-mini">
      <span className="app-mini-icon" aria-hidden="true">
        {icon}
      </span>
      <p className="app-mini-title">{title}</p>
      <p className="app-mini-desc">{desc}</p>
    </AppCard>
  );
}

function InfoCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <AppCard className="app-info">
      <p className="app-info-title">
        <span aria-hidden="true">{icon}</span>
        {title}
      </p>
      <p className="app-body">{desc}</p>
    </AppCard>
  );
}
