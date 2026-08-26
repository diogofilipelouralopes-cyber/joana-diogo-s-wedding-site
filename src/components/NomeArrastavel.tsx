import { useRef } from "react";
import { motion } from "motion/react";
import { GripVertical } from "lucide-react";

/**
 * Nome que se arrasta para outra mesa.
 *
 * Não usa o arrasto nativo do browser, que não funciona em iOS. Ao largar,
 * procura-se o elemento por baixo do dedo com data-mesa e entrega-se o nome
 * a essa mesa. O `touchAction: none` é o que permite arrastar sem a página
 * rolar por baixo.
 */
export function NomeArrastavel({
  children,
  onLargarEm,
  className = "",
}: {
  children: React.ReactNode;
  /** Recebe a mesa onde se largou e, se existir, o nome sobre o qual se largou. */
  onLargarEm: (mesaId: string | null, sobreConvidadoId: string | null) => void;
  className?: string;
}) {
  const arrastou = useRef(false);
  const eu = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={eu}
      drag
      dragSnapToOrigin
      dragElastic={0.2}
      dragMomentum={false}
      whileDrag={{ scale: 1.04, zIndex: 50, cursor: "grabbing" }}
      style={{ touchAction: "none" }}
      onDragStart={() => {
        arrastou.current = true;
        document.body.classList.add("a-arrastar");
      }}
      onDragEnd={(e) => {
        document.body.classList.remove("a-arrastar");
        const p = e as PointerEvent;
        // elementsFromPoint devolve a pilha toda: o nome que se arrasta está lá
        // por cima, por isso procura-se a primeira mesa por baixo dele.
        // O nome arrastado continua a ser filho do cartão de origem, por isso
        // o closest a partir dele devolveria sempre a mesa de onde saiu.
        // Ignoram-se os elementos que estão dentro dele.
        const pilha = document
          .elementsFromPoint(p.clientX, p.clientY)
          .filter((el) => !eu.current?.contains(el));
        const mesa = pilha.map((el) => el.closest("[data-mesa]")).find(Boolean) ?? null;
        const sobre = pilha.map((el) => el.closest("[data-convidado]")).find(Boolean) ?? null;
        onLargarEm(
          mesa?.getAttribute("data-mesa") ?? null,
          sobre?.getAttribute("data-convidado") ?? null,
        );
        setTimeout(() => (arrastou.current = false), 0);
      }}
      className={`relative flex items-start gap-2 ${className}`}
    >
      <GripVertical className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground/60" aria-hidden />
      {children}
    </motion.div>
  );
}
