import { useEffect, useRef, useState } from "react";
import { Plane, Heart, MapPin } from "lucide-react";

/**
 * Decorative divider used between main sections.
 * Dotted olive horizontal line with three Lucide icons centered on top.
 * Icons fade in sequentially when entering the viewport; the plane has a
 * subtle horizontal loop animation.
 */
export function DecorativeDivider() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const iconStyle = {
    color: "var(--olive)",
    backgroundColor: "var(--cream)",
  } as const;

  return (
    <div
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className="relative w-full"
      style={{ height: "50px", marginTop: "60px", marginBottom: "60px" }}
    >
      {/* Dotted line */}
      <div
        className="absolute left-0 right-0 top-1/2"
        style={{
          borderTop: "1px dashed var(--olive)",
          opacity: 0.55,
        }}
      />
      {/* Icon row */}
      <div className="absolute inset-0 flex items-center justify-center gap-8">
        <span
          className={visible ? "decor-icon-in decor-plane-loop" : "decor-icon-hidden"}
          style={{ ...iconStyle, padding: "0 10px", animationDelay: visible ? "0s" : undefined }}
        >
          <Plane size={20} strokeWidth={1.25} />
        </span>
        <span
          className={visible ? "decor-icon-in" : "decor-icon-hidden"}
          style={{ ...iconStyle, padding: "0 10px", animationDelay: visible ? "0.25s" : undefined }}
        >
          <Heart size={20} strokeWidth={1.25} />
        </span>
        <span
          className={visible ? "decor-icon-in" : "decor-icon-hidden"}
          style={{ ...iconStyle, padding: "0 10px", animationDelay: visible ? "0.5s" : undefined }}
        >
          <MapPin size={20} strokeWidth={1.25} />
        </span>
      </div>
    </div>
  );
}
