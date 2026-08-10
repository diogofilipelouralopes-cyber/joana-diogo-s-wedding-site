import { MapPin, Clock, ExternalLink, Hotel, Shirt, Plane, ParkingCircle, Car, Heart } from "lucide-react";
import { Card, Label, Script, Ornament } from "@/components/app/kit";
import { useApp } from "@/lib/app-copy";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Glic%C3%ADnia+Wedding+House+Freamunde";
const WHATSAPP = "https://wa.me/351912633104";

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="app-inline-meta justify-start text-left">
      <span className="shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

export function PlaceScreen() {
  const { a } = useApp();

  const routes = [
    { icon: Car, title: a("place.porto"), v: a("place.portoV") },
    { icon: Car, title: a("place.aveiro"), v: a("place.aveiroV") },
    { icon: Plane, title: a("place.airport"), v: a("place.airportV") },
    { icon: ParkingCircle, title: a("place.parking"), v: a("place.parkingV") },
  ];

  return (
    <div className="app-screen">
      <header className="text-center pt-1">
        <Label size="0.72rem">{a("place.kicker")}</Label>
        <p className="app-venue mt-2">
          GLICÍNIA
          <br />
          WEDDING HOUSE
        </p>
      </header>

      <Card padded={false} className="overflow-hidden">
        <iframe
          title="Glicínia Wedding House — mapa"
          src="https://www.google.com/maps?q=Glic%C3%ADnia+Wedding+House+Freamunde&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block w-full border-0"
          style={{ height: 220 }}
        />
        <div className="p-5 space-y-3">
          <Row icon={<MapPin size={15} strokeWidth={1.3} />}>{a("place.address")}</Row>
          <Row icon={<Clock size={15} strokeWidth={1.3} />}>{a("place.time")}</Row>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="app-btn-outline">
            <ExternalLink size={15} strokeWidth={1.3} />
            {a("place.maps")}
          </a>
        </div>
      </Card>

      <Ornament icon={<Plane size={14} strokeWidth={1.3} />} />

      <section>
        <Label className="text-center">{a("place.how")}</Label>
        <div className="app-grid-2 mt-4">
          {routes.map(({ icon: Icon, title, v }) => (
            <Card key={title} className="text-center">
              <Icon size={24} strokeWidth={1.3} className="app-icon-gold mx-auto" />
              <p className="app-label mt-2" style={{ fontSize: "0.66rem" }}>
                {title}
              </p>
              <p className="app-body mt-1">{v}</p>
            </Card>
          ))}
        </div>
      </section>

      <Ornament icon={<Heart size={14} strokeWidth={1.3} />} />

      <Card>
        <Hotel size={22} strokeWidth={1.3} className="app-icon-gold" />
        <Label className="mt-3" size="0.68rem">
          {a("place.stay")}
        </Label>
        <p className="app-body mt-2">{a("place.stayDesc")}</p>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="app-btn-outline mt-4">
          {a("place.stayCta")}
        </a>
      </Card>

      <Card>
        <Shirt size={22} strokeWidth={1.3} className="app-icon-gold" />
        <Label className="mt-3" size="0.68rem">
          {a("place.dress")}
        </Label>
        <p className="app-body mt-2">{a("place.dressDesc")}</p>
        <Script size="1.5rem" className="mt-3">
          Joana &amp; Diogo
        </Script>
      </Card>
    </div>
  );
}
