import { useEffect, useState, useRef } from "react";
import { Menu, X, Camera, Music, MessageCircleHeart, Gift, Home, BookHeart, CalendarCheck, MapPin, Info, HelpCircle, CalendarPlus } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Monogram } from "@/components/Monogram";
import { downloadWeddingICS } from "@/lib/calendar";

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
  const navigate = useNavigate();

  // Toque/clique triplo no logo abre o /admin (atalho discreto)
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleLogoTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      navigate({ to: "/admin" });
      return;
    }
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 600);
  };

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

  // Gesto: arrastar da direita para a esquerda abre o menu
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onTouchStart = (e: TouchEvent) => {
      if (open) return;
      const t = e.touches[0];
      // Só começa a seguir se o toque iniciar perto da margem direita (24px)
      if (t.clientX >= window.innerWidth - 24) {
        startX = t.clientX;
        startY = t.clientY;
        tracking = true;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      // Deslize horizontal para a esquerda, maior que vertical
      if (dx < -60 && Math.abs(dx) > Math.abs(dy)) {
        setOpen(true);
      }
    };

    // Gesto para FECHAR: arrastar da esquerda para a direita com o menu aberto
    let closeStartX = 0;
    let closeStartY = 0;
    let closeTracking = false;
    const onCloseStart = (e: TouchEvent) => {
      if (!open) return;
      const t = e.touches[0];
      closeStartX = t.clientX;
      closeStartY = t.clientY;
      closeTracking = true;
    };
    const onCloseEnd = (e: TouchEvent) => {
      if (!closeTracking) return;
      closeTracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - closeStartX;
      const dy = t.clientY - closeStartY;
      if (dx > 60 && Math.abs(dx) > Math.abs(dy)) {
        setOpen(false);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchstart", onCloseStart, { passive: true });
    window.addEventListener("touchend", onCloseEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchstart", onCloseStart);
      window.removeEventListener("touchend", onCloseEnd);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* LEFT: Logo (toque triplo abre /admin) */}
        <a
          href="#top"
          aria-label="Joana & Diogo"
          className="header-logo shrink-0 inline-flex"
          onClick={handleLogoTap}
        >
          <span aria-hidden="true" className="header-logo-desktop">
            <Monogram size={75} />
          </span>
          <span aria-hidden="true" className="header-logo-mobile">
            <Monogram size={52} />
          </span>
        </a>

        {/* CENTER: Nav (desktop only) */}
        <nav className="header-nav-desktop items-center gap-3 lg:gap-5 xl:gap-7">
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
          <button
            className="header-hamburger inline-flex items-center justify-center"
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
        </div>
      </div>

      {/* Thin date row */}
      <div className="header-date-row">
        <button
          type="button"
          onClick={downloadWeddingICS}
          className="header-date-label header-date-btn"
          title={lang === "en" ? "Add to calendar" : "Adicionar ao calendário"}
          aria-label={lang === "en" ? "Add to calendar" : "Adicionar ao calendário"}
        >
          <CalendarPlus size={13} strokeWidth={1.6} style={{ marginRight: 6, opacity: 0.75 }} />
          {lang === "en" ? "September 19, 2026" : "19 de Setembro de 2026"}
        </button>
      </div>
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
        <nav className="flex-1 px-6 pb-8 flex flex-col items-center justify-center gap-1 text-center text-xl">
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
