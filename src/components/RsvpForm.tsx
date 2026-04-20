import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function RsvpForm() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [allergies, setAllergies] = useState("");
  const [song, setSong] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || attending === null) {
      toast.error("Please enter your name and let us know if you'll attend.");
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
      toast.error("Could not submit. Please try again.");
      return;
    }
    setDone(true);
    toast.success("Thank you! Your reply has been received.");
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <div className="font-script text-4xl text-primary mb-3">Thank you!</div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your reply has been received. We can't wait to celebrate this day with you.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-xl mx-auto">
      <div>
        <Label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Name *
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
          Will you attend? *
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
              {v === "yes" ? "Joyfully accept" : "Regretfully decline"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="allergies" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Allergies / dietary restrictions
        </Label>
        <Input
          id="allergies"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="mt-2 bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
        />
      </div>

      <div>
        <Label htmlFor="song" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Song suggestion
        </Label>
        <Textarea
          id="song"
          value={song}
          onChange={(e) => setSong(e.target.value)}
          rows={2}
          className="mt-2 bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full py-6 font-display text-lg tracking-wide rounded-none"
      >
        {loading ? "Sending..." : "RSVP"}
      </Button>
    </form>
  );
}
