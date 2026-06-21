import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Atraso em ms antes de animar (útil para escalonar elementos) */
  delay?: number;
  /** Classe extra opcional */
  className?: string;
  /** Distância do deslize em px (default 24) */
  distance?: number;
};

/**
 * Envolve qualquer conteúdo e aplica um fade-in suave (+ leve deslize para cima)
 * quando entra no ecrã ao fazer scroll. Anima apenas uma vez.
 * Respeita "prefers-reduced-motion" (acessibilidade).
 */
export function Reveal({ children, delay = 0, className, distance = 24 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Respeita quem prefere menos movimento
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${distance}px)`,
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        transitionDelay: visible ? `${delay}ms` : "0ms",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
