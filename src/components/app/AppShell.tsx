import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MapPin, Camera, Plane, MoreHorizontal } from "lucide-react";
import { I18nProvider } from "@/lib/i18n";
import { useApp } from "@/lib/app-copy";
import { Toaster } from "@/components/ui/sonner";

function MonogramMark({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" className="shrink-0">
      <circle cx="50" cy="50" r="47" fill="none" stroke="var(--gold)" strokeWidth="1.2" opacity="0.8" />
      <circle cx="50" cy="50" r="43" fill="none" stroke="var(--olive)" strokeWidth="0.8" opacity="0.5" />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fill="var(--olive)"
        style={{ fontFamily: "Cinzel, serif", fontSize: 30, letterSpacing: "0.02em" }}
      >
        J&amp;D
      </text>
    </svg>
  );
}

function AppHeader() {
  const { lang, setLang, a } = useApp();
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/" className="flex items-center gap-3 min-w-0" aria-label={a("brand.name")}>
          <MonogramMark />
          <span className="min-w-0">
            <span className="app-brand-name">{a("brand.name")}</span>
            <span className="app-brand-date">{a("brand.date")}</span>
          </span>
        </Link>

        <div className="app-lang" role="group" aria-label="Idioma / Language">
          <button type="button" data-active={lang === "pt"} onClick={() => setLang("pt")}>
            PT
          </button>
          <span aria-hidden="true">·</span>
          <button type="button" data-active={lang === "en"} onClick={() => setLang("en")}>
            EN
          </button>
        </div>
      </div>
    </header>
  );
}

const TABS = [
  { to: "/", icon: Home, key: "tab.home" },
  { to: "/local", icon: MapPin, key: "tab.place" },
  { to: "/fotos", icon: Camera, key: "tab.photos" },
  { to: "/rsvp", icon: Plane, key: "tab.rsvp" },
  { to: "/mais", icon: MoreHorizontal, key: "tab.more" },
] as const;

function TabBar() {
  const { a } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="app-tabbar" aria-label="Navegação principal">
      {TABS.map(({ to, icon: Icon, key }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link key={to} to={to} className="app-tab" data-active={active} aria-current={active ? "page" : undefined}>
            <Icon size={21} strokeWidth={1.3} />
            <span>{a(key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [key, setKey] = useState(pathname);
  useEffect(() => setKey(pathname), [pathname]);

  return (
    <div className="app-root">
      <Toaster position="top-center" />
      <AppHeader />
      <main key={key} className="app-main app-fade-up">
        {children}
      </main>
      <TabBar />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <Shell>{children}</Shell>
    </I18nProvider>
  );
}
