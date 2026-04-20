import { useEffect, useState } from "react";

const TARGET = new Date("2026-09-19T14:00:00+01:00").getTime();

function calc() {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown() {
  const [t, setT] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: "Dias", value: t.days },
    { label: "Horas", value: t.hours },
    { label: "Min", value: t.minutes },
    { label: "Seg", value: t.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-6">
      {items.map((i) => (
        <div key={i.label} className="text-center">
          <div className="font-display text-3xl sm:text-5xl text-primary tabular-nums">
            {String(i.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {i.label}
          </div>
        </div>
      ))}
    </div>
  );
}
