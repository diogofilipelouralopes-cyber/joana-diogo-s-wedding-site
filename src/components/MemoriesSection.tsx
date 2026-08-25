import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const ALBUM_URL = "https://photos.app.goo.gl/ZfRKu3pg8oHait6eA";

function QRCodeClient({ value, size }: { value: string; size: number }) {
  const [Comp, setComp] = useState<React.ComponentType<any> | null>(null);
  useEffect(() => {
    let mounted = true;
    import("react-qr-code").then((mod) => {
      if (!mounted) return;
      const C = (mod as any).default ?? mod;
      setComp(() => C);
    });
    return () => {
      mounted = false;
    };
  }, []);
  if (!Comp) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: "#F5EFE4",
          border: "1px dashed var(--gold)",
          borderRadius: "var(--card-radius)",
        }}
        aria-label="QR code loading"
      />
    );
  }
  return <Comp value={value} size={size} bgColor="#F5EFE4" fgColor="#6B7A4F" level="M" />;
}

export function MemoriesSection() {
  const { t } = useI18n();
  const [qrSize, setQrSize] = useState(120);

  useEffect(() => {
    const update = () => setQrSize(window.innerWidth < 640 ? 120 : 170);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section id="fotos" className="section section-ivory">
      <div className="max-w-md mx-auto text-center">
        <h2
          className="uppercase text-base sm:text-xl"
          style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.25em", fontWeight: 500 }}
        >
          {t("memories.title")}
        </h2>
        <p
          className="italic mt-1 text-xl sm:text-3xl"
          style={{ fontFamily: "Allura, 'Great Vibes', cursive", color: "var(--gold)", lineHeight: 1.1 }}
        >
          {t("memories.subtitle")}
        </p>

        <div
          className="mt-4 sm:mt-6 p-4 sm:p-6"
          style={{
            background: "var(--cream)",
            border: "1px solid var(--gold)",
            borderRadius: "var(--card-radius)",
            boxShadow:
              "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 18px 36px -20px color-mix(in oklab, var(--olive) 24%, transparent)",
          }}
        >
          {/* O QR é clicável: quem está ao computador não consegue scanear o próprio ecrã */}
          <a
            href={ALBUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("memories.primary")}
            className="inline-flex p-2.5 transition-all hover:-translate-y-0.5"
            style={{
              background: "var(--ivory)",
              border: "1px solid var(--gold)",
              borderRadius: "var(--card-radius)",
            }}
          >
            <QRCodeClient value={ALBUM_URL} size={qrSize} />
          </a>

          <p
            className="mt-3 text-xs sm:text-sm"
            style={{ color: "var(--olive)", opacity: 0.85 }}
          >
            {t("memories.step1")}
          </p>

          <div className="mt-4">
            <a
              href={ALBUM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-block"
            >
              <ImagePlus size={16} strokeWidth={1.5} />
              {t("memories.secondary")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
