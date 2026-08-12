import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { LiveAnnouncementBanner } from "@/components/LiveAnnouncementBanner";
import { QuickAccessBar } from "@/components/QuickAccessBar";
import { MobileTabBar } from "@/components/MobileTabBar";
import { Toaster } from "@/components/ui/sonner";

// Chat widget pulls in shiki/oniguruma (WASM) through streamdown — must never
// enter the SSR/Worker import graph.
const ChatWidget = lazy(() => import("@/components/ChatWidget"));

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LiveAnnouncementBanner />
      <div id="top" className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Toaster position="top-center" />
        <Header />
        <main className="pb-28 md:pb-0">{children}</main>
        <SiteFooter />
      </div>

      <QuickAccessBar />
      <MobileTabBar />
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </ClientOnly>
    </>
  );
}
