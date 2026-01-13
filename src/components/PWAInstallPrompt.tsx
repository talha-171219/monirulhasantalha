import { useEffect, useState } from "react";
import { Download, ExternalLink, Smartphone, X, Share2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { projects as staticProjects } from "@/data/projects";
import { supabase } from "@/integrations/supabase/client";
import type { Project } from "@/data/projects";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const LS_DISMISSED_FOREVER = "pwa_portfolio_dismissed_forever";
const LS_PROJECT_DISMISSED_PREFIX = "pwa_prompt_dismissed_";
const SS_HIDDEN_SESSION = "pwa_prompt_hidden_session";
const SS_PROJECT_HIDDEN_PREFIX = "pwa_prompt_hidden_session_";

function getPlatform() {
  const ua = navigator.userAgent || "";
  const isIOS = /iPad|iPhone|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isDesktop = !isIOS && !isAndroid;
  return { isIOS, isAndroid, isDesktop };
}

function isStandaloneMode() {
  const isStandaloneMedia = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const isIOSStandalone = (navigator as unknown as { standalone?: boolean }).standalone;
  return Boolean(isStandaloneMedia || isIOSStandalone);
}

export const PWAInstallPrompt = () => {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showPortfolioHelp, setShowPortfolioHelp] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [showProjectInstallHelp, setShowProjectInstallHelp] = useState(false);

  const isProjectView = location.pathname.startsWith("/project/");
  const projectId = isProjectView ? location.pathname.split("/project/")[1] : null;
  const platform = getPlatform();

  // Fetch project data if on project view
  useEffect(() => {
    if (!isProjectView || !projectId) {
      setProject(null);
      return;
    }

    const fetchProject = async () => {
      const staticProject = staticProjects.find((p) => p.id === projectId);
      if (staticProject) {
        setProject(staticProject);
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .maybeSingle();

      if (!error && data) {
        setProject({
          id: data.id,
          title: data.title,
          description: data.description,
          category: data.category,
          appUrl: data.app_url,
          thumbnail: data.thumbnail,
          featured: data.featured,
        });
      }
    };

    fetchProject();
  }, [isProjectView, projectId]);

  useEffect(() => {
    // Already installed as PWA
    if (isStandaloneMode()) {
      setIsInstalled(true);
      return;
    }

    // Check dismissal status
    if (isProjectView && projectId) {
      if (localStorage.getItem(`${LS_PROJECT_DISMISSED_PREFIX}${projectId}`) === "1") return;
      if (sessionStorage.getItem(`${SS_PROJECT_HIDDEN_PREFIX}${projectId}`) === "1") return;
    } else {
      if (localStorage.getItem(LS_DISMISSED_FOREVER) === "1") return;
      if (sessionStorage.getItem(SS_HIDDEN_SESSION) === "1") return;
    }

    // Show prompt after 2 seconds
    const t = window.setTimeout(() => {
      setShowPortfolioHelp(false);
      setShowProjectInstallHelp(false);
      setShowPrompt(true);
    }, 2000);

    const handleBeforeInstall = (e: Event) => {
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
  }, [isProjectView, projectId]);

  // For portfolio install (main app)
  const handleInstallClick = async () => {
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
        setShowPortfolioHelp(true);
      } catch (error) {
        console.error("Install error:", error);
        setShowPortfolioHelp(true);
      }
      return;
    }
    setShowPortfolioHelp(true);
  };

  // For project app install - shows instructions to install that specific project
  const handleProjectInstallClick = () => {
    setShowProjectInstallHelp(true);
  };

  const handleMaybeLater = () => {
    setShowPrompt(false);
    setShowPortfolioHelp(false);
    setShowProjectInstallHelp(false);
    if (isProjectView && projectId) {
      sessionStorage.setItem(`${SS_PROJECT_HIDDEN_PREFIX}${projectId}`, "1");
    } else {
      sessionStorage.setItem(SS_HIDDEN_SESSION, "1");
    }
  };

  const handleDismissForever = () => {
    setShowPrompt(false);
    setShowPortfolioHelp(false);
    setShowProjectInstallHelp(false);
    if (isProjectView && projectId) {
      localStorage.setItem(`${LS_PROJECT_DISMISSED_PREFIX}${projectId}`, "1");
    } else {
      localStorage.setItem(LS_DISMISSED_FOREVER, "1");
    }
  };

  const handleOpenProjectInNewTab = () => {
    if (project?.appUrl) {
      window.open(project.appUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (isInstalled || !showPrompt) return null;

  // For project view - show dialog to install that specific project app
  if (isProjectView && project) {
    return (
      <Dialog open={showPrompt} onOpenChange={(open) => !open && handleMaybeLater()}>
        <DialogContent className="sm:max-w-md">
          <button
            onClick={handleDismissForever}
            aria-label="Dismiss install prompt"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>

          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Install {project.title}
            </DialogTitle>
            <DialogDescription>
              এই app টি আপনার phone বা desktop এ install করুন!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!showProjectInstallHelp ? (
              <>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">{project.title}</strong> app টি install করতে নিচের button এ click করুন।
                  </p>
                </div>
                
                <Button onClick={handleProjectInstallClick} className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Install করুন
                </Button>
              </>
            ) : (
              <>
                {/* Installation Instructions */}
                <div className="space-y-4">
                  {platform.isAndroid && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-primary" />
                        Android এ Install করুন:
                      </h4>
                      <ol className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">1</span>
                          <span>নিচের "Open App" button এ click করুন</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">2</span>
                          <span className="flex items-center gap-1">
                            Browser এর <MoreVertical className="h-3 w-3 inline" /> menu তে tap করুন
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">3</span>
                          <span>"Add to Home screen" বা "Install app" select করুন</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">4</span>
                          <span>Confirm করুন - App install হয়ে যাবে!</span>
                        </li>
                      </ol>
                    </div>
                  )}

                  {platform.isIOS && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-primary" />
                        iPhone/iPad এ Install করুন:
                      </h4>
                      <ol className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">1</span>
                          <span>নিচের "Open App" button এ click করুন</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">2</span>
                          <span className="flex items-center gap-1">
                            Safari এর <Share2 className="h-3 w-3 inline" /> Share button এ tap করুন
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">3</span>
                          <span>"Add to Home Screen" select করুন</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">4</span>
                          <span>"Add" এ tap করুন - Done!</span>
                        </li>
                      </ol>
                    </div>
                  )}

                  {platform.isDesktop && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Download className="h-4 w-4 text-primary" />
                        Desktop এ Install করুন:
                      </h4>
                      <ol className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">1</span>
                          <span>নিচের "Open App" button এ click করুন</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">2</span>
                          <span>Address bar এ install icon (⊕) দেখবেন</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">3</span>
                          <span>Icon এ click করে "Install" করুন</span>
                        </li>
                      </ol>
                    </div>
                  )}

                  <Button onClick={handleOpenProjectInNewTab} className="w-full gap-2 mt-4">
                    <ExternalLink className="h-4 w-4" />
                    Open App
                  </Button>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleMaybeLater} variant="outline" className="flex-1">
                পরে করব
              </Button>
              <Button onClick={handleDismissForever} variant="ghost" className="flex-1 text-muted-foreground">
                আর দেখাবে না
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // For portfolio pages - show floating prompt to install main portfolio app
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

            {/* Dismiss button */}
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
                <h3 className="font-semibold text-foreground">Install Portfolio App</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Portfolio app টি install করুন quick access এর জন্য!
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="relative mt-4 flex flex-col gap-2">
              <Button
                onClick={handleInstallClick}
                className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 font-medium shadow-lg shadow-primary/25"
              >
                <Download className="h-4 w-4" />
                Install Now
              </Button>

              <AnimatePresence initial={false}>
                {showPortfolioHelp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-1 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
                      {platform.isDesktop && (
                        <p>
                          Desktop: address bar এ <span className="text-foreground">Install</span> icon (⊕)
                          অথবা 3-dot menu → <span className="text-foreground">Install</span>.
                        </p>
                      )}
                      {platform.isAndroid && (
                        <p>
                          Android: 3-dot menu → <span className="text-foreground">Add to Home screen</span> / Install app.
                        </p>
                      )}
                      {platform.isIOS && (
                        <p>
                          iPhone/iPad (Safari): Share → <span className="text-foreground">Add to Home Screen</span>.
                        </p>
                      )}
                      {!platform.isDesktop && !platform.isAndroid && !platform.isIOS && (
                        <p>
                          Browser menu তে "Install app" / "Add to Home screen" option খুঁজুন।
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                <Button onClick={handleMaybeLater} variant="ghost" className="flex-1 text-muted-foreground hover:text-foreground">
                  Maybe Later
                </Button>
              </div>
            </div>

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
