import { Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { RsvpForm } from "@/components/RsvpForm";

export function RsvpSection() {
  const { t } = useI18n();

  return (
    <section id="rsvp" className="py-10 sm:py-16 md:py-24 px-5 sm:px-6 bg-secondary/40 scroll-mt-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
            {t("rsvp.subtitle")}
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-primary">{t("rsvp.title")}</h2>
          <div className="divider-ornament mt-5 max-w-xs mx-auto">
            <Heart className="w-3 h-3" strokeWidth={1} />
          </div>
        </div>
        <RsvpForm />
      </div>
    </section>
  );
}
