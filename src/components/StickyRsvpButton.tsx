import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export function StickyRsvpButton() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? scrolled / max : 0;
      setShow(pct >= 0.3);
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
      aria-label={t("hero.cta")}
      className="sticky-rsvp-btn"
      data-visible={show ? "true" : "false"}
    >
      {t("hero.cta")}
    </a>
  );
}
