import type { ReactNode } from "react";

/** Ivory card: 1px gold @45%, radius 10, very soft shadow. */
export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className={`app-card ${padded ? "p-5" : ""} ${className}`}>{children}</div>
  );
}

/** Cinzel uppercase kicker/label. */
export function Label({
  children,
  className = "",
  size = "0.7rem",
}: {
  children: ReactNode;
  className?: string;
  size?: string;
}) {
  return (
    <p className={`app-label ${className}`} style={{ fontSize: size }}>
      {children}
    </p>
  );
}

/** Allura gold script accent. */
export function Script({
  children,
  className = "",
  size = "2rem",
}: {
  children: ReactNode;
  className?: string;
  size?: string;
}) {
  return (
    <p className={`app-script ${className}`} style={{ fontSize: size }}>
      {children}
    </p>
  );
}

/** Dashed rule with a thin gold icon in the middle. */
export function Ornament({ icon, className = "" }: { icon: ReactNode; className?: string }) {
  return (
    <div className={`app-ornament ${className}`} aria-hidden="true">
      <span className="app-ornament-line" />
      <span className="app-ornament-icon">{icon}</span>
      <span className="app-ornament-line" />
    </div>
  );
}

/** Screen heading (kicker + script). */
export function ScreenHead({ kicker, script }: { kicker: string; script?: string }) {
  return (
    <header className="text-center pt-2">
      <Label size="0.78rem">{kicker}</Label>
      {script ? <Script size="1.9rem" className="mt-1">{script}</Script> : null}
    </header>
  );
}

export function Screen({ children }: { children: ReactNode }) {
  return <div className="app-screen">{children}</div>;
}
