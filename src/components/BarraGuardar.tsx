import { Button } from "@/components/ui/button";
import { Loader2, Check, Save, AlertTriangle } from "lucide-react";
import type { Estado } from "@/lib/guardar";

/** Barra fixa no fundo, só aparece quando há alterações por guardar. */
export function BarraGuardar({
  estado,
  quantas,
  onGuardar,
}: {
  estado: Estado;
  quantas: number;
  onGuardar: () => void;
}) {
  if (estado === "limpo") return null;

  const cor =
    estado === "erro" ? "#B85C5C" : estado === "guardado" ? "var(--olive)" : "var(--gold)";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t px-4 py-3 flex items-center gap-3 justify-center sm:justify-end sm:px-8"
      style={{
        background: "var(--card)",
        borderColor: `color-mix(in oklab, ${cor} 45%, transparent)`,
        boxShadow: "0 -8px 24px -16px rgba(0,0,0,.35)",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
      role="status"
      aria-live="polite"
    >
      {estado === "guardado" ? (
        <p className="flex items-center gap-2 text-sm" style={{ color: "var(--olive)" }}>
          <Check className="w-4 h-4" /> Guardado
        </p>
      ) : estado === "erro" ? (
        <>
          <p className="flex items-center gap-2 text-sm" style={{ color: "#B85C5C" }}>
            <AlertTriangle className="w-4 h-4" />
            Não foi possível guardar. Tenta outra vez.
          </p>
          <Button size="sm" onClick={onGuardar}>
            <Save className="w-4 h-4 mr-2" /> Tentar de novo
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {quantas} {quantas === 1 ? "alteração por guardar" : "alterações por guardar"}
          </p>
          <Button size="sm" onClick={onGuardar} disabled={estado === "a-guardar"}>
            {estado === "a-guardar" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar
          </Button>
        </>
      )}
    </div>
  );
}
