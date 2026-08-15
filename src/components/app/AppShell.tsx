import { useEffect, useState, lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AppTicker } from "./AppTicker";
import { BottomTabBar, type TabId } from "./BottomTabBar";
import { HomeTab } from "./HomeTab";
import { LocalTab } from "./LocalTab";
import { FotosTab } from "./FotosTab";
import { RsvpTab } from "./RsvpTab";
import { MaisTab } from "./MaisTab";

const ChatWidget = lazy(() => import("@/components/ChatWidget"));

export function AppShell() {
  const [tab, setTab] = useState<TabId>("inicio");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, [tab]);

  return (
    <div className="app-shell">
      <Toaster position="top-center" />
      <div className="app-frame">
        <AppTicker />
        <main className="app-main">
          {tab === "inicio" && <HomeTab go={setTab} />}
          {tab === "local" && <LocalTab />}
          {tab === "fotos" && <FotosTab />}
          {tab === "rsvp" && <RsvpTab />}
          {tab === "mais" && <MaisTab />}
        </main>
        <BottomTabBar active={tab} onChange={setTab} />
      </div>
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
