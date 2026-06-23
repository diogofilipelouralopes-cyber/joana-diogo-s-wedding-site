import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp } from "lucide-react";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mounted || !visible) return null;

  const btn = (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Voltar ao topo"
      style={{
        position: "fixed",
        bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))",
        left: "1rem",
        zIndex: 54,
        width: 40,
        height: 40,
        borderRadius: "999px",
        background: "color-mix(in oklab, var(--ivory, var(--background)) 85%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)",
        boxShadow: "0 2px 12px color-mix(in oklab, var(--gold) 14%, transparent)",
        color: "color-mix(in oklab, var(--gold) 85%, #6b5a2e)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s ease, color 0.2s ease",
      }}
    >
      <ArrowUp size={18} strokeWidth={1.8} />
    </button>
  );

  return createPortal(btn, document.body);
}
