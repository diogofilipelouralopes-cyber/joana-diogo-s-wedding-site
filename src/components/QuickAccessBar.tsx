import { useEffect, useState } from "react";
import { MapPin, Camera, Music, AlertTriangle, ExternalLink } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const WEDDING_DATE = new Date("2026-09-19T00:00:00+01:00");
const SHOW_DAYS_BEFORE = 7;

// Durante o desenvolvimento, deixa sempre visível.
// TODO: reativar a condição dos 7 dias antes do casamento (trocar para `false`).
const FORCE_VISIBLE = true;

const WAZE_URL =
  "https://waze.com/ul?q=Glic%C3%ADnia%20Wedding%20House%20Freamunde";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Glic%C3%ADnia+Wedding+House+Freamunde";
const EMERGENCY_URL = "https://wa.me/351967324430";

function shouldShow(): boolean {
  if (FORCE_VISIBLE) return true;
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
        background:
          "color-mix(in oklab, var(--ivory, var(--background)) 82%, transparent)",
        backdropFilter: "blur(14px) saturate(120%)",
        WebkitBackdropFilter: "blur(14px) saturate(120%)",
        borderTop:
          "1px solid color-mix(in oklab, var(--gold) 38%, transparent)",
        boxShadow: "0 -4px 24px color-mix(in oklab, var(--gold) 12%, transparent)",
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
              className="w-56 p-2"
              style={{
                background:
                  "color-mix(in oklab, var(--ivory, var(--background)) 92%, transparent)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border:
                  "1px solid color-mix(in oklab, var(--gold) 40%, transparent)",
              }}
            >
              <a
                href={WAZE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="qa-popover-link"
              >
                Waze <ExternalLink size={14} />
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="qa-popover-link"
              >
                Google Maps <ExternalLink size={14} />
              </a>
            </PopoverContent>
          </Popover>
        </li>
        <li className="flex-1">
          <button
            type="button"
            onClick={() => scrollToId("fotos")}
            className="qa-btn"
          >
            <Camera size={20} strokeWidth={1.6} />
            <span>Fotos</span>
          </button>
        </li>
        <li className="flex-1">
          <button
            type="button"
            onClick={() => scrollToId("musica")}
            className="qa-btn"
          >
            <Music size={20} strokeWidth={1.6} />
            <span>Música</span>
          </button>
        </li>
        <li className="flex-1">
          <a
            href={EMERGENCY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="qa-btn"
          >
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
          gap: 5px;
          padding: 11px 4px;
          color: color-mix(in oklab, var(--gold) 88%, #6b5a2e);
          font-family: "Cinzel", serif;
          font-size: 0.56rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .qa-btn:hover, .qa-btn:focus-visible {
          color: color-mix(in oklab, var(--gold) 60%, #000);
          background: color-mix(in oklab, var(--gold) 10%, transparent);
          outline: none;
        }
        .qa-popover-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.875rem;
          color: var(--foreground);
          transition: background 0.2s ease;
        }
        .qa-popover-link:hover {
          background: color-mix(in oklab, var(--gold) 14%, transparent);
        }
      `}</style>
    </nav>
  );
}
