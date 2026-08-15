import { ExternalLink, ImagePlus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AppButton, AppCard, SectionHead } from "./ui";
import { ALBUM_URL } from "@/components/MemoriesSection";
import { PublicGallerySection } from "@/components/PublicGallerySection";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

const PREVIEW = [g1, g2, g3, g4, g5, g6];

export function FotosTab() {
  const { t, lang } = useI18n();

  return (
    <section className="app-section">
      <SectionHead kicker={t("memories.title")} script={t("memories.subtitle")} />

      <AppCard className="app-pad">
        <p className="app-kicker">{lang === "en" ? "Shared album" : "Álbum partilhado"}</p>
        <p className="app-body app-mt-sm">{t("memories.desc")}</p>
        <div className="app-stack app-mt">
          <AppButton href={ALBUM_URL}>
            <ImagePlus size={16} strokeWidth={1.3} aria-hidden="true" />
            {t("memories.secondary")}
          </AppButton>
          <AppButton variant="outline" href={ALBUM_URL}>
            <ExternalLink size={15} strokeWidth={1.3} aria-hidden="true" />
            {t("memories.primary")}
          </AppButton>
        </div>
      </AppCard>

      <AppCard className="app-pad app-mt">
        <p className="app-kicker">{lang === "en" ? "In 3 simple steps" : "Em 3 passos simples"}</p>
        <ol className="app-steps">
          <li>
            <span className="app-step-n">1</span>
            {lang === "en"
              ? "Tap the button above — the album opens in Google Photos."
              : "Toca no botão acima — o álbum abre no Google Fotos."}
          </li>
          <li>
            <span className="app-step-n">2</span>
            {lang === "en"
              ? "Add your photos and videos from our day."
              : "Adiciona as tuas fotografias e vídeos do nosso dia."}
          </li>
          <li>
            <span className="app-step-n">3</span>
            {lang === "en"
              ? "See all the memories shared by other guests."
              : "Vê todas as memórias partilhadas pelos outros convidados."}
          </li>
        </ol>
      </AppCard>

      <p className="app-kicker app-mt">{lang === "en" ? "From the couple" : "Dos noivos"}</p>
      <div className="app-photo-grid">
        {PREVIEW.map((src, i) => (
          <img key={i} src={src} alt="" className="app-photo" loading="lazy" />
        ))}
      </div>

      <div className="app-mt">
        <PublicGallerySection />
      </div>
    </section>
  );
}
