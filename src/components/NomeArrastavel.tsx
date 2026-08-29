import { useRef } from "react";
import { motion, useDragControls } from "motion/react";
import { GripVertical } from "lucide-react";

/**
 * Nome que se arrasta para outra mesa.
 *
 * Não usa o arrasto nativo do browser, que não funciona em iOS. Ao largar,
 * procura-se o elemento por baixo do dedo com data-mesa e entrega-se o nome
 * a essa mesa.
 *
 * O arrasto começa só na pega da esquerda. Antes começava em qualquer ponto
 * da linha, com touchAction: none na linha inteira — e como quase todo o ecrã
 * do telemóvel é nomes, tocar para rolar a página arrastava a pessoa. Agora a
 * linha rola normalmente e só a pega agarra.
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
  const eu = useRef<HTMLDivElement>(null);
  const controlo = useDragControls();

  return (
    <motion.div
      ref={eu}
      drag
      dragListener={false}
      dragControls={controlo}
      dragSnapToOrigin
      dragElastic={0.2}
      dragMomentum={false}
      whileDrag={{ scale: 1.04, zIndex: 50, cursor: "grabbing" }}
      // pan-y: a página continua a rolar por cima desta linha.
      style={{ touchAction: "pan-y" }}
      onDragStart={() => {
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
      }}
      className={`relative flex items-start gap-2 ${className}`}
    >
      <button
        type="button"
        aria-label="Arrastar para mudar de mesa"
        onPointerDown={(e) => controlo.start(e)}
        className="pega-arrastar shrink-0 grid place-items-center self-stretch -my-1 py-1"
        style={{ touchAction: "none", cursor: "grab" }}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground/60" aria-hidden />
      </button>
      {children}
    </motion.div>
  );
}
