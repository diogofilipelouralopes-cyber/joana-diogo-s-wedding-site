import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Megaphone } from "lucide-react";
import { toast } from "sonner";

type Announcement = {
  id: string;
  message: string;
  active: boolean;
  updated_at: string;
};

export function AdminAvisos() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        const a = data as Announcement | null;
        if (a) {
          setId(a.id);
          setMessage(a.message ?? "");
          setActive(!!a.active);
        }
        setLoading(false);
      });
  }, []);

  async function save() {
    setSaving(true);
    const payload = { message: message.trim(), active };
    let error;
    if (id) {
      ({ error } = await supabase.from("announcements").update(payload).eq("id", id));
    } else {
      const res = await supabase
        .from("announcements")
        .insert(payload)
        .select("id")
        .single();
      error = res.error;
      if (res.data) setId((res.data as { id: string }).id);
    }
    setSaving(false);
    if (error) {
      toast.error("Erro ao guardar aviso.");
      return;
    }
    toast.success("✅ Aviso guardado");
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl text-primary">Banner de avisos</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Mensagem curta que aparece no topo do site (abaixo do menu). Atualiza em
        direto para todos os visitantes.
      </p>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Mensagem
        </label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Ex.: A cerimónia começa às 14h em ponto. Tragam um casaco leve 🤍"
        />
      </div>

      <div className="flex items-center justify-between border border-border rounded-md px-4 py-3">
        <div>
          <p className="text-sm font-medium">Ativo</p>
          <p className="text-xs text-muted-foreground">
            Quando ligado, o banner aparece no site.
          </p>
        </div>
        <Switch checked={active} onCheckedChange={setActive} />
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Guardar
      </Button>
    </div>
  );
}
