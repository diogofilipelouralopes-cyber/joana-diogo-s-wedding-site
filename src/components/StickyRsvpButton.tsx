import { useI18n } from "@/lib/i18n";

export function StickyRsvpButton() {
  const { t } = useI18n();

  return (
    <a
      href="#rsvp"
      aria-label={t("hero.cta")}
      className="sticky-rsvp-btn"
      data-visible="true"
    >
      {t("hero.cta")}
    </a>
  );
}
