import { useEffect, useState } from "react";
import { Smartphone, Share, Plus, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (standalone) {
      setInstalled(true);
      return;
    }

    const ua = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(iOS);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const onInstalled = () => {
      setInstalled(true);
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // iOS doesn't fire beforeinstallprompt — show button anyway
    if (iOS) setVisible(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || !visible) return null;

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setVisible(false);
      }
      setDeferred(null);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="install-btn"
        aria-label="Adicionar ao ecrã principal"
      >
        <Smartphone className="w-4 h-4" strokeWidth={1.5} />
        <span>Adicionar ao ecrã principal</span>
      </button>

      {showIOSModal && (
        <div
          className="install-modal-backdrop"
          onClick={() => setShowIOSModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="install-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="install-modal-close"
              onClick={() => setShowIOSModal(false)}
              aria-label="Fechar"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <h3 className="install-modal-title">Adicionar ao Ecrã Principal</h3>
            <p className="install-modal-text">
              Toca no ícone <Share className="inline w-4 h-4 align-text-bottom mx-1" strokeWidth={1.5} /> <strong>Partilhar</strong> e depois em <strong>Adicionar ao Ecrã Principal</strong> <Plus className="inline w-4 h-4 align-text-bottom mx-1" strokeWidth={1.5} />.
            </p>
            <div className="install-modal-illustration">
              <Share className="w-6 h-6" strokeWidth={1.5} />
              <span>→</span>
              <Plus className="w-6 h-6" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
