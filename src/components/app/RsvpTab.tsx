import { useI18n } from "@/lib/i18n";
import { RsvpForm } from "@/components/RsvpForm";
import { SectionHead } from "./ui";

export function RsvpTab() {
  const { t } = useI18n();
  return (
    <section className="app-section">
      <SectionHead kicker={t("rsvp.subtitle")} script={t("rsvp.title")} />
      <RsvpForm />
    </section>
  );
}
