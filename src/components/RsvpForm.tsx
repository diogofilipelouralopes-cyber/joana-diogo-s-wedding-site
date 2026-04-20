import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export function RsvpForm() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [allergies, setAllergies] = useState("");
  const [song, setSong] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || attending === null) {
      toast.error(t("rsvp.errMissing"));
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("rsvps").insert({
      name: name.trim(),
      attending: attending === "yes",
      allergies: allergies.trim() || null,
      song_suggestion: song.trim() || null,
    });
    setLoading(false);
    if (error) {
      toast.error(t("rsvp.errSubmit"));
      return;
    }
    setDone(true);
    toast.success(t("rsvp.success"));
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <div className="font-script text-4xl text-primary mb-3">{t("rsvp.thanks")}</div>
        <p className="text-muted-foreground max-w-md mx-auto">{t("rsvp.thanksDesc")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-xl mx-auto">
      <div>
        <Label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t("rsvp.name")}
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-2 bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
        />
      </div>

      <div>
        <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t("rsvp.attend")}
        </Label>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {(["yes", "no"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setAttending(v)}
              className={`py-3 border transition-all font-display text-lg ${
                attending === v
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-transparent hover:border-primary/50"
              }`}
            >
              {v === "yes" ? t("rsvp.yes") : t("rsvp.no")}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="allergies" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t("rsvp.allergies")}
        </Label>
        <Input
          id="allergies"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder={t("rsvp.allergiesPh")}
          className="mt-2 bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
        />
      </div>

      <div>
        <Label htmlFor="song" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t("rsvp.song")}
        </Label>
        <Textarea
          id="song"
          value={song}
          onChange={(e) => setSong(e.target.value)}
          rows={2}
          placeholder={t("rsvp.songPh")}
          className="mt-2 bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full py-6 font-display text-lg tracking-wide rounded-none"
      >
        {loading ? t("rsvp.sending") : t("rsvp.send")}
      </Button>
    </form>
  );
}
