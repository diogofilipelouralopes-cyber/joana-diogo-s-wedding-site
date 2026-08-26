import { useRef, useState } from "react";
import { motion, useMotionValue, animate, useDragControls } from "motion/react";
import { Trash2, Check, GripVertical } from "lucide-react";

/**
 * Linha de lista com gestos, para iPad e telemóvel.
 *
 * Deslizar para a esquerda revela apagar; para a direita, a acção secundária
 * (por exemplo marcar como feita). Passando do limite, executa; a meio, volta
 * ao sítio. Com rato continua tudo a funcionar pelos botões de sempre.
 */
export function LinhaDeslizante({
  children,
  onApagar,
  onSecundaria,
  rotuloSecundaria = "Feita",
  activaSecundaria = false,
  className = "",
  pega = false,
}: {
  children: React.ReactNode;
  onApagar?: () => boolean | void | Promise<boolean | void>;
  onSecundaria?: () => void;
  rotuloSecundaria?: string;
  activaSecundaria?: boolean;
  className?: string;
  /** Linhas cheias de campos de texto: o gesto só começa na pega da esquerda,
   *  senão deslizar por cima de um campo entra em conflito com escrever. */
  pega?: boolean;
}) {
  const x = useMotionValue(0);
  const [aSair, setASair] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);
  const controlo = useDragControls();
  const LIMITE = 96;

  function aoLargar(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
    const d = info.offset.x;
    const rapido = Math.abs(info.velocity.x) > 500;

    if (onApagar && (d < -LIMITE || (rapido && d < -40))) {
      setASair(true);
      void (async () => {
        await animate(x, -(caixa.current?.offsetWidth ?? 400), { duration: 0.18 });
        const feito = await onApagar();
        // Se quem apaga desistir (por exemplo cancelou a confirmação), a linha
        // volta ao sítio em vez de ficar presa fora do ecrã.
        if (feito === false) {
          setASair(false);
          animate(x, 0, { type: "spring", stiffness: 500, damping: 40 });
        }
      })();
      return;
    }
    if (onSecundaria && (d > LIMITE || (rapido && d > 40))) {
      onSecundaria();
    }
    animate(x, 0, { type: "spring", stiffness: 500, damping: 40 });
  }

  return (
    <div ref={caixa} className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* fundo revelado ao deslizar */}
      <div className="absolute inset-0 flex items-center justify-between px-5 pointer-events-none">
        <span
          className="flex items-center gap-2 text-sm"
          style={{ color: "var(--olive)", opacity: onSecundaria ? 1 : 0 }}
        >
          <Check className="w-4 h-4" />
          {activaSecundaria ? "Por fazer" : rotuloSecundaria}
        </span>
        <span
          className="flex items-center gap-2 text-sm"
          style={{ color: "#B85C5C", opacity: onApagar ? 1 : 0 }}
        >
          Apagar
          <Trash2 className="w-4 h-4" />
        </span>
      </div>

      {pega && (
        <button
          type="button"
          aria-label="Arrastar para a esquerda para apagar"
          onPointerDown={(e) => controlo.start(e)}
          className="absolute right-0 inset-y-0 z-10 w-10 flex items-center justify-center"
          style={{ touchAction: "none", cursor: "grab" }}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground/60" />
        </button>
      )}
      <motion.div
        drag={onApagar || onSecundaria ? "x" : false}
        dragListener={!pega}
        dragControls={pega ? controlo : undefined}
        style={{ x, touchAction: "pan-y" }}
        dragDirectionLock
        dragElastic={0.12}
        dragConstraints={{ left: onApagar ? -160 : 0, right: onSecundaria ? 160 : 0 }}
        onDragEnd={aoLargar}
        animate={aSair ? { opacity: 0.4 } : { opacity: 1 }}
        className={`relative bg-card ${pega ? "pr-10" : ""}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
