import { Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import beach from "@/assets/story-beach.jpg";
import paris from "@/assets/story-paris.jpg";
import together from "@/assets/story-together.jpg";
import proposal from "@/assets/story-proposal.jpg";

export function StorySection() {
  const { t } = useI18n();
  const items = [
    { img: beach, title: t("story.1.title"), desc: t("story.1.desc") },
    { img: paris, title: t("story.2.title"), desc: t("story.2.desc") },
    { img: together, title: t("story.3.title"), desc: t("story.3.desc") },
    { img: proposal, title: t("story.4.title"), desc: t("story.4.desc") },
  ];

  return (
    <section id="story" className="py-28 sm:py-40 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
            2018 — 2026
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-primary">{t("story.title")}</h2>
          <div className="divider-ornament mt-6 max-w-xs mx-auto">
            <Heart className="w-3 h-3" strokeWidth={1} />
          </div>
        </div>

        <div className="space-y-16 sm:space-y-24">
          {items.map((it, i) => (
            <div
              key={i}
              className={`grid md:grid-cols-2 gap-8 sm:gap-12 items-center ${
                i % 2 === 1 ? "md:[&>:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden rounded-sm">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="md:px-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display text-3xl sm:text-4xl text-primary mb-4">
                  {it.title}
                </h3>
                <p className="text-foreground/75 leading-relaxed">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
