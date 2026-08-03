import { useEffect, useState, useRef } from "react";
import { X, Camera, Music, MessageCircleHeart, Gift, Home, BookHeart, CalendarCheck, MapPin, Info, HelpCircle, Image as ImageIcon, Share2, Link as LinkIcon, MessageCircle, Smartphone, Share, Plus } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Monogram } from "@/components/Monogram";
import { downloadWeddingICS } from "@/lib/calendar";

const SITE_URL = "https://joanaediogo-com.lovable.app";
const WA_SHARE_URL = `https://wa.me/?text=${encodeURIComponent(
  "Joana & Diogo - 19 Setembro 2026 🌿 " + "https://joanaediogo-com.lovable.app"
)}`;

const links = [
  { id: "top", key: "nav.home" as const, icon: <Home className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "story", key: "nav.story" as const, icon: <BookHeart className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "rsvp", key: "nav.rsvp" as const, icon: <CalendarCheck className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "event", key: "nav.event" as const, icon: <MapPin className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "info", key: "nav.info" as const, icon: <Info className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "fotos", key: "nav.photos" as const, icon: <Camera className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "galeria", key: "nav.gallery" as const, icon: <ImageIcon className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "musica", key: "nav.music" as const, icon: <Music className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "faq", key: "nav.faq" as const, icon: <HelpCircle className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "mensagens", key: "nav.messages" as const, icon: <MessageCircleHeart className="w-4 h-4" strokeWidth={1.5} /> },
  { id: "gifts", key: "nav.gifts" as const, icon: <Gift className="w-4 h-4" strokeWidth={1.5} /> },
];

/** Grupos do menu mobile (drawer). Desktop continua a usar `links`. */
const mobileGroups: {
  labelPt: string;
  labelEn: string;
  items: { id: string; key: (typeof links)[number]["key"]; icon: React.ReactNode }[];
}[] = [
  {
    labelPt: "Casamento",
    labelEn: "Wedding",
    items: [
      { id: "top", key: "nav.home", icon: <Home className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
      { id: "story", key: "nav.story", icon: <BookHeart className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
      { id: "rsvp", key: "nav.rsvp", icon: <CalendarCheck className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
      { id: "event", key: "nav.event", icon: <MapPin className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
      { id: "info", key: "nav.info", icon: <Info className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
    ],
  },
  {
    labelPt: "Convidados",
    labelEn: "Guests",
    items: [
      { id: "fotos", key: "nav.photos", icon: <Camera className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
      { id: "musica", key: "nav.music", icon: <Music className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
    ],
  },
  {
    labelPt: "Mais",
    labelEn: "More",
    items: [
      { id: "faq", key: "nav.faq", icon: <HelpCircle className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
      { id: "mensagens", key: "nav.messages", icon: <MessageCircleHeart className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
      { id: "gifts", key: "nav.gifts", icon: <Gift className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
    ],
  },
];

export function Header() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("top");
  const navigate = useNavigate();

  // Instalação PWA (adicionar ao ecrã principal)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));
    const onBIP = (e: Event) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);
  const handleInstall = async () => {
    if (isIOS) { setShowIOSHelp(true); return; }
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      setDeferredPrompt(null);
      setOpen(false);
    }
  };

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

          {/* Mobile hamburger → X */}
          <button
            className="header-hamburger burger-btn items-center justify-center"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
            data-open={open ? "true" : "false"}
          >
            <span className="burger-icon" aria-hidden="true">
              <span className="burger-bar burger-bar-1" />
              <span className="burger-bar burger-bar-2" />
              <span className="burger-bar burger-bar-3" />
            </span>
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
        {/* Cabeçalho do drawer */}
        <div className="drawer-head">
          <button
            onClick={() => setOpen(false)}
            aria-label={lang === "en" ? "Close menu" : "Fechar menu"}
            className="drawer-close"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <div className="drawer-brand">
            <span className="drawer-brand-name">Joana</span>
            <span className="drawer-brand-amp">&amp;</span>
            <span className="drawer-brand-name">Diogo</span>
            <span className="drawer-brand-rule" aria-hidden="true" />
            <span className="drawer-brand-date">
              {lang === "en" ? "19 September 2026" : "19 Setembro 2026"}
            </span>
          </div>
        </div>

        <nav className="drawer-nav">
          {mobileGroups.map((g) => (
            <div key={g.labelPt} className="drawer-group">
              <p className="drawer-group-label">{lang === "en" ? g.labelEn : g.labelPt}</p>
              {g.items.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  data-active={active === l.id ? "true" : "false"}
                  className="drawer-item"
                >
                  <span className="drawer-item-icon">{l.icon}</span>
                  <span className="drawer-item-text">{t(l.key)}</span>
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* Ações */}
        <div className="drawer-actions">
          <a
            href={WA_SHARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="drawer-action"
          >
            <span className="drawer-item-icon"><Share2 className="w-[18px] h-[18px]" strokeWidth={1.5} /></span>
            <span className="drawer-item-text">{lang === "en" ? "Share" : "Partilhar"}</span>
          </a>
          <button type="button" onClick={handleInstall} className="drawer-action">
            <span className="drawer-item-icon"><Smartphone className="w-[18px] h-[18px]" strokeWidth={1.5} /></span>
            <span className="drawer-item-text">{lang === "en" ? "Add to Home Screen" : "Adicionar ao ecrã"}</span>
          </button>
        </div>


        {showIOSHelp && (
          <div
            className="install-modal-backdrop"
            onClick={() => setShowIOSHelp(false)}
            role="dialog"
            aria-modal="true"
          >
            <div className="install-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="install-modal-close"
                onClick={() => setShowIOSHelp(false)}
                aria-label="Fechar"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <h3 className="install-modal-title">
                {lang === "en" ? "Add to Home Screen" : "Adicionar ao Ecrã Principal"}
              </h3>
              <p className="install-modal-text">
                {lang === "en" ? (
                  <>Tap the <Share className="inline w-4 h-4 align-text-bottom mx-1" strokeWidth={1.5} /> <strong>Share</strong> icon and then <strong>Add to Home Screen</strong> <Plus className="inline w-4 h-4 align-text-bottom mx-1" strokeWidth={1.5} />.</>
                ) : (
                  <>Toca no ícone <Share className="inline w-4 h-4 align-text-bottom mx-1" strokeWidth={1.5} /> <strong>Partilhar</strong> e depois em <strong>Adicionar ao Ecrã Principal</strong> <Plus className="inline w-4 h-4 align-text-bottom mx-1" strokeWidth={1.5} />.</>
                )}
              </p>
              <div className="install-modal-illustration">
                <Share className="w-6 h-6" strokeWidth={1.5} />
                <span>→</span>
                <Plus className="w-6 h-6" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        )}
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
