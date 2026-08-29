import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/**
 * Aviso de que o painel está sem ligação.
 *
 * Sem isto, ficar sem rede na quinta traduz-se em cada acção a falhar por si,
 * uma a uma, cada uma com o seu aviso — em vez de se perceber logo que nada
 * está a ser guardado.
 *
 * `navigator.onLine` só garante uma coisa: quando diz que não há rede, não há
 * mesmo. O contrário não é garantido (pode haver wi-fi sem internet), por isso
 * serve para avisar, não para dar por segura a ligação.
 */
export function AvisoSemRede() {
  const [semRede, setSemRede] = useState(false);

  useEffect(() => {
    const ver = () => setSemRede(!navigator.onLine);
    ver();
    window.addEventListener("online", ver);
    window.addEventListener("offline", ver);
    return () => {
      window.removeEventListener("online", ver);
      window.removeEventListener("offline", ver);
    };
  }, []);

  if (!semRede) return null;

  return (
    <div
      className="sticky top-0 z-[70] px-4 py-2 flex items-center justify-center gap-2 text-sm"
      style={{ background: "#B85C5C", color: "#fff" }}
      role="alert"
    >
      <WifiOff className="w-4 h-4 shrink-0" aria-hidden />
      <span>Sem ligação. O que escreveres fica à espera e é guardado quando a rede voltar.</span>
    </div>
  );
}
