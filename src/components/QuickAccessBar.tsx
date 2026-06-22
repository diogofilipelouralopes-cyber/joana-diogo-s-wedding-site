import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, Camera, CalendarHeart, ExternalLink } from "lucide-react";
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

const CONTACTS = [
  { name: "Joana", phone: "+351 912 633 104", url: "https://wa.me/351912633104" },
  { name: "Diogo", phone: "+32 493 945 581", url: "https://wa.me/32493945581" },
];

// Ícone oficial do WhatsApp (SVG)
function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setVisible(shouldShow());
    const interval = setInterval(() => setVisible(shouldShow()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!visible || !mounted) return null;

  const bar = (
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
        {/* Localização */}
        <li className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="qa-btn">
                <MapPin size={22} strokeWidth={1.5} />
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

        {/* Fotos */}
        <li className="flex-1">
          <button
            type="button"
            onClick={() => scrollToId("fotos")}
            className="qa-btn"
          >
            <Camera size={22} strokeWidth={1.5} />
            <span>Fotos</span>
          </button>
        </li>

        {/* Confirmar Presença */}
        <li className="flex-1">
          <button
            type="button"
            onClick={() => scrollToId("rsvp")}
            className="qa-btn"
          >
            <CalendarHeart size={22} strokeWidth={1.5} />
            <span>Presença</span>
          </button>
        </li>

        {/* Contactos (WhatsApp) */}
        <li className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="qa-btn">
                <WhatsAppIcon size={22} />
                <span>Contactos</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="center"
              className="w-60 p-2"
              style={{
                background:
                  "color-mix(in oklab, var(--ivory, var(--background)) 92%, transparent)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border:
                  "1px solid color-mix(in oklab, var(--gold) 40%, transparent)",
              }}
            >
              {CONTACTS.map((c) => (
                <a
                  key={c.name}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="qa-contact-link"
                >
                  <span className="qa-contact-icon"><WhatsAppIcon size={18} /></span>
                  <span className="qa-contact-texts">
                    <span className="qa-contact-name">{c.name}</span>
                    <span className="qa-contact-phone">{c.phone}</span>
                  </span>
                </a>
              ))}
            </PopoverContent>
          </Popover>
        </li>
      </ul>
      <style>{`
        /* Esconder a barra quando o menu lateral está aberto */
        body.drawer-open .quick-access-bar {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .qa-btn {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 11px 4px;
          color: color-mix(in oklab, var(--gold) 88%, #6b5a2e);
          font-family: "Cinzel", serif;
          font-size: 0.58rem;
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
        .qa-contact-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 6px;
          transition: background 0.2s ease;
        }
        .qa-contact-link:hover {
          background: color-mix(in oklab, var(--gold) 14%, transparent);
        }
        .qa-contact-icon {
          color: #25D366;
          display: inline-flex;
          flex-shrink: 0;
        }
        .qa-contact-texts {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .qa-contact-name {
          font-family: "Cinzel", serif;
          font-size: 0.95rem;
          color: var(--gold);
        }
        .qa-contact-phone {
          font-size: 0.78rem;
          color: var(--muted-foreground);
        }
      `}</style>
    </nav>
  );

  // Portal para o body — garante position:fixed sem interferência de containers
  return createPortal(bar, document.body);
}
