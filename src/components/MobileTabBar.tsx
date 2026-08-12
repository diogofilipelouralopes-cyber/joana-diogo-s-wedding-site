import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Home, MapPin, CalendarHeart, Camera, MessageCircleHeart, LayoutGrid } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const TABS = [
  { to: "/", pt: "Início", en: "Home", icon: Home },
  { to: "/evento", pt: "Evento", en: "Event", icon: MapPin },
  { to: "/rsvp", pt: "RSVP", en: "RSVP", icon: CalendarHeart },
  { to: "/fotos", pt: "Fotos", en: "Photos", icon: Camera },
  { to: "/mais", pt: "Mais", en: "More", icon: LayoutGrid },
] as const;

export function MobileTabBar() {
  const { lang } = useI18n();
  const [mounted, setMounted] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const bar = (
    <nav className="mobile-tabbar" aria-label={lang === "en" ? "Main navigation" : "Navegação principal"}>
      <ul className="mtb-pill">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
          return (
            <li key={tab.to} className="mtb-item">
              <Link to={tab.to} className="mtb-btn" data-active={active ? "true" : "false"}>
                <Icon size={20} strokeWidth={1.6} />
                <span className="mtb-label">{lang === "en" ? tab.en : tab.pt}</span>
              </Link>
            </li>
          );
        })}
        <li className="mtb-item">
          <button
            type="button"
            className="mtb-btn"
            onClick={() => window.dispatchEvent(new CustomEvent("wedding-chat:toggle"))}
            aria-label={lang === "en" ? "Chat" : "Assistente"}
          >
            <MessageCircleHeart size={20} strokeWidth={1.6} />
            <span className="mtb-label">{lang === "en" ? "Chat" : "Chat"}</span>
          </button>
        </li>
      </ul>
      <style>{`
        .mobile-tabbar {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: calc(10px + env(safe-area-inset-bottom, 0px));
          z-index: 55;
          width: min(460px, calc(100vw - 16px));
        }
        @media (min-width: 768px) { .mobile-tabbar { display: none; } }
        body.drawer-open .mobile-tabbar,
        body.lightbox-open .mobile-tabbar {
          opacity: 0;
          pointer-events: none;
        }
        .mtb-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          padding: 6px 6px;
          border-radius: 999px;
          background: color-mix(in oklab, var(--ivory, var(--background)) 92%, transparent);
          backdrop-filter: blur(16px) saturate(130%);
          border: 1px solid color-mix(in oklab, var(--gold) 36%, transparent);
          box-shadow: 0 10px 30px rgba(0,0,0,0.14);
        }
        .mtb-item { flex: 1; display: flex; justify-content: center; }
        .mtb-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          width: 100%;
          min-height: 46px;
          padding: 5px 2px;
          border-radius: 18px;
          color: color-mix(in oklab, var(--gold) 88%, #6b5a2e);
          transition: color 0.2s ease, background 0.2s ease;
        }
        .mtb-btn[data-active="true"] {
          color: var(--olive);
          background: color-mix(in oklab, var(--gold) 18%, transparent);
        }
        .mtb-label {
          font-family: "Cinzel", serif;
          font-size: 0.5rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1;
        }
      `}</style>
    </nav>
  );

  return createPortal(bar, document.body);
}
