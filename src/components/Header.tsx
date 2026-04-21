import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/logo.png";

const links = [
  { id: "story", key: "nav.story" as const },
  { id: "gallery", key: "nav.gallery" as const },
  { id: "event", key: "nav.event" as const },
  { id: "info", key: "nav.info" as const },
  { id: "rsvp", key: "nav.rsvp" as const },
  { id: "gifts", key: "nav.gifts" as const },
];

export function Header() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/60 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Joana & Diogo" className="h-10 w-10 sm:h-11 sm:w-11" />
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="text-[11px] uppercase tracking-[0.22em] text-foreground/70 hover:text-primary transition-colors"
            >
              {t(l.key)}
            </a>
          ))}
          <div className="flex items-center gap-1 ml-2 pl-5 border-l border-border">
            <LangBtn active={lang === "pt"} onClick={() => setLang("pt")}>
              PT
            </LangBtn>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <LangBtn active={lang === "en"} onClick={() => setLang("en")}>
              EN
            </LangBtn>
          </div>
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-foreground/80"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md">
          <div className="px-6 py-6 flex flex-col gap-5">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.2em] text-foreground/80 hover:text-primary"
              >
                {t(l.key)}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-3 border-t border-border">
              <LangBtn active={lang === "pt"} onClick={() => setLang("pt")}>
                PT
              </LangBtn>
              <LangBtn active={lang === "en"} onClick={() => setLang("en")}>
                EN
              </LangBtn>
            </div>
          </div>
        </div>
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
      className={`text-[11px] tracking-[0.18em] font-medium transition-all ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
