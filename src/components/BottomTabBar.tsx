import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Home, MapPin, Camera, CalendarHeart, MoreHorizontal } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export type TabId = "home" | "place" | "photos" | "rsvp" | "more";

const TABS: { id: TabId; icon: typeof Home; key: "tab.home" | "tab.place" | "tab.photos" | "tab.rsvp" | "tab.more" }[] = [
  { id: "home", icon: Home, key: "tab.home" },
  { id: "place", icon: MapPin, key: "tab.place" },
  { id: "photos", icon: Camera, key: "tab.photos" },
  { id: "rsvp", icon: CalendarHeart, key: "tab.rsvp" },
  { id: "more", icon: MoreHorizontal, key: "tab.more" },
];

export function BottomTabBar({ tab, onChange }: { tab: TabId; onChange: (t: TabId) => void }) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const bar = (
    <nav className="tabbar" aria-label="Navegação principal">
      {TABS.map(({ id, icon: Icon, key }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={active ? "page" : undefined}
            className="tabbar-btn"
            data-active={active ? "true" : "false"}
          >
            <Icon size={21} strokeWidth={1.3} />
            <span className="tabbar-label">{t(key)}</span>
          </button>
        );
      })}
      <style>{`
        .tabbar {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          z-index: 60;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          background: color-mix(in oklab, var(--ivory) 95%, transparent);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid color-mix(in oklab, var(--gold) 30%, transparent);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        .tabbar-btn {
          min-height: 52px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 6px 2px;
          background: transparent;
          color: color-mix(in oklab, var(--olive) 65%, transparent);
          transition: color 0.2s ease;
        }
        .tabbar-btn[data-active="true"] { color: var(--gold); }
        .tabbar-label {
          font-family: "Cinzel", serif;
          text-transform: uppercase;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          line-height: 1;
        }
        body.drawer-open .tabbar, body.lightbox-open .tabbar { opacity: 0; pointer-events: none; }
      `}</style>
    </nav>
  );

  return createPortal(bar, document.body);
}
