import { useEffect, useState } from "react";

/**
 * Floating sticky "Confirmar Presença" button shown after the user scrolls
 * past 50% of the page.
 */
export function StickyRsvpButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? scrolled / max : 0;
      setShow(pct >= 0.5);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <a
      href="#rsvp"
      aria-label="Confirmar Presença"
      className="sticky-rsvp-btn"
      data-visible={show ? "true" : "false"}
    >
      Confirmar Presença
    </a>
  );
}
