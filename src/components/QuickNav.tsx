import { Signpost, Info, Camera, Mail, Gift, type LucideIcon } from "lucide-react";

interface QuickItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const items: QuickItem[] = [
  { icon: Signpost, label: "Programa", href: "#event" },
  { icon: Info, label: "Informações", href: "#info" },
  { icon: Camera, label: "Galeria", href: "#gallery" },
  { icon: Mail, label: "RSVP", href: "#rsvp" },
  { icon: Gift, label: "Lista de Presentes", href: "#gifts" },
];

export function QuickNav() {
  return (
    <nav
      aria-label="Navegação rápida"
      className="w-full"
      style={{
        backgroundColor: "var(--cream)",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Desktop / tablet: 5 cols. Mobile: horizontal scroll. */}
        <ul
          className="hidden sm:grid grid-cols-5 gap-4"
        >
          {items.map((it) => (
            <QuickNavItem key={it.href} {...it} />
          ))}
        </ul>

        <ul
          className="sm:hidden flex gap-6 overflow-x-auto px-2 pb-2 -mx-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((it) => (
            <li key={it.href} className="snap-center shrink-0 min-w-[110px]">
              <QuickNavItem {...it} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function QuickNavItem({ icon: Icon, label, href }: QuickItem) {
  return (
    <a
      href={href}
      className="quick-nav-item group flex flex-col items-center justify-start text-center px-2"
    >
      <span className="quick-nav-icon inline-flex items-center justify-center transition-all duration-300">
        <Icon size={48} strokeWidth={1.25} />
      </span>
      <span
        className="mt-3 uppercase transition-colors duration-300"
        style={{
          fontFamily: "Lato, sans-serif",
          fontSize: "0.85rem",
          letterSpacing: "0.15em",
          color: "var(--olive)",
          fontWeight: 400,
        }}
      >
        {label}
      </span>
    </a>
  );
}
