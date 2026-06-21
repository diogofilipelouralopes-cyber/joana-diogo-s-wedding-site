import { useEffect, useState } from "react";
import { MapPin, Camera, Music, AlertTriangle, ExternalLink } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const WEDDING_DATE = new Date("2026-09-19T00:00:00+01:00");
const SHOW_DAYS_BEFORE = 7;

const WAZE_URL =
  "https://waze.com/ul?q=Glic%C3%ADnia%20Wedding%20House%20Freamunde";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Glic%C3%ADnia+Wedding+House+Freamunde";
const EMERGENCY_URL = "https://wa.me/351967324430";

function shouldShow(): boolean {
  const now = Date.now();
  const diff = WEDDING_DATE.getTime() - now;
  const days = diff / (1000 * 60 * 60 * 24);
  return days <= SHOW_DAYS_BEFORE;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function QuickAccessBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(shouldShow());
    const interval = setInterval(() => setVisible(shouldShow()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <nav
      aria-label="Acesso rápido"
      className="quick-access-bar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 55,
        background: "#0a0a0a",
        borderTop: "1px solid var(--gold)",
        boxShadow: "0 -6px 20px rgba(0,0,0,0.25)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <ul className="flex items-stretch justify-around max-w-2xl mx-auto">
        <li className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="qa-btn">
                <MapPin size={20} strokeWidth={1.6} />
                <span>Localização</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="center"
              className="w-56 p-2 bg-black text-white border-[color:var(--gold)]"
            >
              <a
                href={WAZE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 px-3 py-2 rounded hover:bg-white/10 text-sm"
              >
                Waze <ExternalLink size={14} />
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 px-3 py-2 rounded hover:bg-white/10 text-sm"
              >
                Google Maps <ExternalLink size={14} />
              </a>
            </PopoverContent>
          </Popover>
        </li>
        <li className="flex-1">
          <button
            type="button"
            onClick={() => scrollToId("memories")}
            className="qa-btn"
          >
            <Camera size={20} strokeWidth={1.6} />
            <span>Fotos</span>
          </button>
        </li>
        <li className="flex-1">
          <button
            type="button"
            onClick={() => scrollToId("playlist")}
            className="qa-btn"
          >
            <Music size={20} strokeWidth={1.6} />
            <span>Música</span>
          </button>
        </li>
        <li className="flex-1">
          <a href={EMERGENCY_URL} target="_blank" rel="noopener noreferrer" className="qa-btn">
            <AlertTriangle size={20} strokeWidth={1.6} />
            <span>Emergência</span>
          </a>
        </li>
      </ul>
      <style>{`
        .qa-btn {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 6px;
          color: var(--gold);
          font-family: "Cinzel", serif;
          font-size: 0.62rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .qa-btn:hover, .qa-btn:focus-visible {
          color: #fff;
          background: rgba(255,255,255,0.05);
          outline: none;
        }
        /* Lift other floating elements above the bar */
        body:has(.quick-access-bar) .sticky-rsvp-btn { bottom: 5.5rem; }
        body:has(.quick-access-bar) .install-btn { bottom: 5.5rem; }
        @media (max-width: 640px) {
          body:has(.quick-access-bar) .install-btn { bottom: 9rem; }
        }
      `}</style>
    </nav>
  );
}
