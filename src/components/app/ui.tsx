import type { ReactNode, CSSProperties } from "react";

/** Primitivas visuais partilhadas pela app mobile-first. */

export function AppCard({
  children,
  className = "",
  style,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: any;
}) {
  return (
    <As className={`app-card ${className}`} style={style}>
      {children}
    </As>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="app-kicker">{children}</p>;
}

export function Script({ children }: { children: ReactNode }) {
  return <p className="app-script">{children}</p>;
}

export function SectionHead({ kicker, script }: { kicker: string; script?: string }) {
  return (
    <header className="app-section-head">
      <Kicker>{kicker}</Kicker>
      {script ? <Script>{script}</Script> : null}
    </header>
  );
}

type BtnProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
};

export function AppButton({
  children,
  onClick,
  href,
  variant = "solid",
  className = "",
  type = "button",
  ariaLabel,
}: BtnProps) {
  const cls = `app-btn app-btn-${variant} ${className}`;
  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function TileButton({
  icon,
  label,
  onClick,
  href,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const inner = (
    <>
      <span className="app-tile-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="app-tile-label">{label}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="app-tile">
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className="app-tile">
      {inner}
    </button>
  );
}

export function ListRow({
  icon,
  label,
  onClick,
  href,
  trailing,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  trailing?: ReactNode;
}) {
  const inner = (
    <>
      <span className="app-row-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="app-row-label">{label}</span>
      <span className="app-row-trailing">{trailing}</span>
    </>
  );
  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel");
    return (
      <a
        href={href}
        className="app-row"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className="app-row">
      {inner}
    </button>
  );
}
