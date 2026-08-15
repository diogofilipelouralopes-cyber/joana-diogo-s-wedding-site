import { Home, MapPin, Camera, CalendarCheck, MoreHorizontal } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export type TabId = "inicio" | "local" | "fotos" | "rsvp" | "mais";

const TABS: { id: TabId; pt: string; en: string; Icon: any }[] = [
  { id: "inicio", pt: "Início", en: "Home", Icon: Home },
  { id: "local", pt: "Local", en: "Venue", Icon: MapPin },
  { id: "fotos", pt: "Fotos", en: "Photos", Icon: Camera },
  { id: "rsvp", pt: "RSVP", en: "RSVP", Icon: CalendarCheck },
  { id: "mais", pt: "Mais", en: "More", Icon: MoreHorizontal },
];

export function BottomTabBar({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
}) {
  const { lang } = useI18n();
  return (
    <nav className="app-tabbar" aria-label={lang === "en" ? "Main navigation" : "Navegação principal"}>
      <div className="app-tabbar-inner">
        {TABS.map(({ id, pt, en, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className="app-tab"
            data-active={active === id ? "true" : "false"}
            aria-current={active === id ? "page" : undefined}
          >
            <Icon size={21} strokeWidth={1.3} aria-hidden="true" />
            <span className="app-tab-label">{lang === "en" ? en : pt}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
