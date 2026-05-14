import { useEffect, useState } from "react";
import { Menu, X, Camera, Music, MessageCircleHeart, Gift, Home, BookHeart, CalendarCheck, MapPin, Info, HelpCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Monogram } from "@/components/Monogram";
import { useIsMobile } from "@/hooks/use-mobile";

const links = [
  { id: "top", key: "nav.home" as const, icon: <Home className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "story", key: "nav.story" as const, icon: <BookHeart className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "rsvp", key: "nav.rsvp" as const, icon: <CalendarCheck className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "event", key: "nav.event" as const, icon: <MapPin className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "info", key: "nav.info" as const, icon: <Info className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "fotos", key: "nav.photos" as const, icon: <Camera className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "musica", key: "nav.music" as const, icon: <Music className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "faq", key: "nav.faq" as const, icon: <HelpCircle className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "mensagens", key: "nav.messages" as const, icon: <MessageCircleHeart className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "gifts", key: "nav.gifts" as const, icon: <Gift className="w-4 h-4" strokeWidth={1.5} /> },
];

export function Header() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("top");
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 120;
      let current = "top";
      for (const l of links) {
        const el = document.getElementById(l.id);
        if (el && el.offsetTop <= y) current = l.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("drawer-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("drawer-open");
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-3">
        {/* LEFT: Logo */}
        <a
          href="#top"
          aria-label="Joana & Diogo"
          className="header-logo shrink-0 inline-flex"
        >
          <span aria-hidden="true">
            <Monogram size={isMobile ? 52 : 75} />
          </span>
        </a>

        {/* CENTER: Nav (desktop only) */}
        {!isMobile && (
          <nav className="flex items-center gap-6 lg:gap-9">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                data-active={active === l.id ? "true" : "false"}
                className="header-link"
              >
                {t(l.key)}
              </a>
            ))}
          </nav>
        )}

        {/* RIGHT: Lang toggle + mobile hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="lang-toggle">
            <LangBtn active={lang === "pt"} onClick={() => setLang("pt")}>
              PT
            </LangBtn>
            <span className="lang-sep">|</span>
            <LangBtn active={lang === "en"} onClick={() => setLang("en")}>
              EN
            </LangBtn>
          </div>

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              className="inline-flex items-center justify-center"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              style={{
                width: 44,
                height: 44,
                color: "var(--olive)",
              }}
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer (only on mobile) */}
      {isMobile && (
        <>
          <div
            className={`mobile-drawer-backdrop ${open ? "is-open" : ""}`}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            className={`mobile-drawer ${open ? "is-open" : ""}`}
            aria-hidden={!open}
          >
            <div className="flex justify-end p-5">
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="inline-flex items-center justify-center"
                style={{ width: 44, height: 44, color: "var(--olive)" }}
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex-1 px-6 pb-8 flex flex-col items-center justify-center gap-2 text-center">
              {links.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="mobile-drawer-link"
                >
                  {l.icon && <span className="inline-flex" style={{ color: "var(--gold)" }}>{l.icon}</span>}
                  <span>{t(l.key)}</span>
                </a>
              ))}
            </nav>
          </aside>
        </>
      )}
    </header>
  );
}

function LangBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      data-active={active ? "true" : "false"}
      className="lang-btn"
    >
      {children}
    </button>
  );
}
