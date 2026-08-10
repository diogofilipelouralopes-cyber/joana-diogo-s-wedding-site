import { useEffect, useState } from "react";
import { Camera, Plane, X, Check, Plus } from "lucide-react";
import { Card, Label, Script, Ornament } from "@/components/app/kit";
import { useApp } from "@/lib/app-copy";
import { supabase } from "@/integrations/supabase/client";

export const ALBUM_URL = "https://photos.app.goo.gl/ZfRKu3pg8oHait6eA";
const BUCKET = "wedding-photos";

type Photo = { id: string; url: string; caption: string | null };

export function PhotosScreen() {
  const { a } = useApp();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [sheet, setSheet] = useState<null | "pick" | "sending" | "done">(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: albums } = await supabase
        .from("wedding_albums")
        .select("id")
        .eq("is_public", true);
      const ids = (albums ?? []).map((x) => x.id);
      if (!ids.length) return;
      const { data } = await supabase
        .from("wedding_photos")
        .select("id, storage_path, caption")
        .in("album_id", ids)
        .order("created_at", { ascending: false })
        .limit(24);
      if (!alive || !data) return;
      setPhotos(
        data.map((p) => ({
          id: p.id,
          caption: p.caption,
          url: supabase.storage.from(BUCKET).getPublicUrl(p.storage_path).data.publicUrl,
        })),
      );
    })();
    return () => {
      alive = false;
    };
  }, []);

  function startUpload() {
    setSheet("sending");
    setTimeout(() => setSheet("done"), 1800);
  }

  return (
    <div className="app-screen">
      <header className="text-center pt-1">
        <Label size="0.72rem">{a("photos.kicker")}</Label>
        <Script size="1.7rem" className="mt-1">
          {a("photos.sub")}
        </Script>
      </header>

      <button type="button" className="app-btn-dashed" onClick={() => setSheet("pick")}>
        <Plus size={16} strokeWidth={1.3} />
        {a("photos.add")}
      </button>

      {photos.length === 0 ? (
        <Card className="text-center">
          <Camera size={24} strokeWidth={1.3} className="app-icon-gold mx-auto" />
          <p className="app-body mt-3">{a("photos.empty")}</p>
        </Card>
      ) : (
        <div className="app-gallery">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className="app-gallery-item"
              data-wide={i % 5 === 0}
              onClick={() => setLightbox(p)}
            >
              <img src={p.url} alt={p.caption ?? "Fotografia do casamento"} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <Ornament icon={<Camera size={14} strokeWidth={1.3} />} />
      <p className="app-body text-center">{a("photos.note")}</p>

      {/* Lightbox */}
      {lightbox ? (
        <div className="app-lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button type="button" className="app-lightbox-close" aria-label={a("photos.close")}>
            <X size={20} strokeWidth={1.3} />
          </button>
          <img src={lightbox.url} alt={lightbox.caption ?? ""} />
        </div>
      ) : null}

      {/* Bottom sheet */}
      {sheet ? (
        <div className="app-sheet-backdrop" onClick={() => sheet !== "sending" && setSheet(null)}>
          <div className="app-sheet" onClick={(e) => e.stopPropagation()}>
            <span className="app-sheet-grip" aria-hidden="true" />

            {sheet === "pick" ? (
              <>
                <Label size="0.72rem" className="text-center">
                  {a("photos.sheetTitle")}
                </Label>
                <Script size="1.4rem" className="text-center mt-1">
                  {a("photos.sheetSub")}
                </Script>
                <div className="app-grid-3 mt-5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="app-sheet-thumb" aria-hidden="true">
                      <Camera size={18} strokeWidth={1.3} />
                    </div>
                  ))}
                </div>
                <button type="button" className="app-btn-primary mt-5 w-full" onClick={startUpload}>
                  <Plane size={16} strokeWidth={1.3} />
                  {a("photos.pick")}
                </button>
                <a
                  href={ALBUM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-btn-outline mt-3"
                >
                  Google Photos
                </a>
              </>
            ) : null}

            {sheet === "sending" ? (
              <div className="text-center py-6">
                <div className="app-plane-track">
                  <Plane size={20} strokeWidth={1.3} className="app-plane" />
                </div>
                <p className="app-body mt-4">{a("photos.sending")}</p>
              </div>
            ) : null}

            {sheet === "done" ? (
              <div className="text-center py-4">
                <Check size={26} strokeWidth={1.3} className="app-icon-gold mx-auto" />
                <Script size="1.8rem" className="mt-2">
                  {a("photos.doneTitle")}
                </Script>
                <p className="app-body mt-2">{a("photos.doneDesc")}</p>
                <button type="button" className="app-btn-primary mt-5 w-full" onClick={() => setSheet(null)}>
                  {a("photos.finish")}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
