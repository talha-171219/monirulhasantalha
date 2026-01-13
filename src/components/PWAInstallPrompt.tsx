import { useEffect, useMemo, useState } from "react";
import { Download, ExternalLink, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const LS_DISMISSED_FOREVER = "pwa_prompt_dismissed_forever";

function getPlatform() {
  const ua = navigator.userAgent || "";
  const isIOS = /iPad|iPhone|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  // "desktop" for Windows/Mac/Linux/ChromeOS etc.
  const isDesktop = !isIOS && !isAndroid;
  return { isIOS, isAndroid, isDesktop };
}

function isStandaloneMode() {
  const isStandaloneMedia = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const isIOSStandalone = (navigator as unknown as { standalone?: boolean }).standalone;
  return Boolean(isStandaloneMedia || isIOSStandalone);
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const platform = useMemo(() => getPlatform(), []);

  useEffect(() => {
    // already installed
    if (isStandaloneMode()) {
      setIsInstalled(true);
      return;
    }

    // dismissed forever
    if (localStorage.getItem(LS_DISMISSED_FOREVER) === "1") return;

    // Always show after 2s (first visit / next visit) — regardless of installability
    const t = window.setTimeout(() => {
      setShowPrompt(true);
    }, 2000);

    const handleBeforeInstall = (e: Event) => {
      // keep the native prompt available
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    // If browser supports native install prompt, use it.
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          setIsInstalled(true);
          setShowPrompt(false);
          setDeferredPrompt(null);
          return;
        }

        // If dismissed, show manual steps immediately.
        setShowInstructions(true);
      } catch (error) {
        console.error("Install error:", error);
        setShowInstructions(true);
      }
      return;
    }

    // Otherwise show manual steps.
    setShowInstructions(true);
  };

  const handleMaybeLater = () => {
    setShowPrompt(false);
  };

  const handleDismissForever = () => {
    setShowPrompt(false);
    localStorage.setItem(LS_DISMISSED_FOREVER, "1");
  };

  const handleOpenNewTab = () => {
    window.open(window.location.href, "_blank", "noopener,noreferrer");
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: "spring", damping: 24, stiffness: 320 }}
          className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-sm"
        >
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl">
            {/* Decorative elements */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-primary/20 blur-xl" />

            {/* Dismiss forever */}
            <button
              onClick={handleDismissForever}
              aria-label="Dismiss install prompt"
              className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Content */}
            <div className="relative flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/30">
                <Smartphone className="h-7 w-7 text-primary-foreground" />
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-foreground">Install App</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Prothom bar visit e 2 sec por auto show hobe. Install possible hole direct install
                  hobe — na hole niche steps follow kore install korte parba.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="relative mt-4 flex gap-2">
              <Button
                onClick={handleInstallClick}
                className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80 font-medium shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                <Download className="h-4 w-4" />
                Install
              </Button>
              <Button onClick={handleMaybeLater} variant="ghost" className="text-muted-foreground hover:text-foreground">
                Maybe later
              </Button>
            </div>

            {/* Instructions */}
            <AnimatePresence initial={false}>
              {showInstructions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                    <p className="text-sm font-medium text-foreground">Manual install steps</p>
                    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                      {platform.isDesktop && (
                        <p>
                          Desktop: Browser address bar er upore/side e <span className="text-foreground">Install</span>
                          icon/button thakle oita click koro.
                        </p>
                      )}
                      {platform.isAndroid && (
                        <p>
                          Android (Chrome): 3-dot menu → <span className="text-foreground">Add to Home screen</span> (ba
                          Install app) select koro.
                        </p>
                      )}
                      {platform.isIOS && (
                        <p>
                          iPhone/iPad (Safari): Share button → <span className="text-foreground">Add to Home Screen</span>.
                        </p>
                      )}
                      {!platform.isDesktop && !platform.isAndroid && !platform.isIOS && (
                        <p>
                          Install option na paile browser menu/toolbar e "Install app" / "Add to Home screen" option ta khuje dekho.
                        </p>
                      )}
                    </div>

                    <div className="mt-3">
                      <Button onClick={handleOpenNewTab} variant="secondary" className="w-full gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Open in new tab
                      </Button>
                    </div>

                    <div className="mt-2">
                      <Button onClick={handleDismissForever} variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                        Don't show again
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress indicator */}
            <div className="mt-4 flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-6 rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
