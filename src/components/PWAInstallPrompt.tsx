import { useEffect, useState } from "react";
import { Download, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useParams } from "react-router-dom";
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

const LS_DISMISSED_PREFIX = "pwa_prompt_dismissed_";
const SS_HIDDEN_SESSION_PREFIX = "pwa_prompt_hidden_session_";

export const PWAInstallPrompt = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [showPrompt, setShowPrompt] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const isProjectView = location.pathname.startsWith("/project/");

  // Extract project ID from pathname if useParams doesn't work (component is outside Routes)
  const projectId = id || (isProjectView ? location.pathname.split("/project/")[1] : null);

  useEffect(() => {
    // Only show on project view pages
    if (!isProjectView || !projectId) {
      setShowPrompt(false);
      return;
    }

    // Check if dismissed forever for this project
    if (localStorage.getItem(`${LS_DISMISSED_PREFIX}${projectId}`) === "1") {
      setShowPrompt(false);
      return;
    }

    // Check if hidden for this session
    if (sessionStorage.getItem(`${SS_HIDDEN_SESSION_PREFIX}${projectId}`) === "1") {
      setShowPrompt(false);
      return;
    }

    // Fetch project data
    const fetchProject = async () => {
      // First check static projects
      const staticProject = staticProjects.find((p) => p.id === projectId);

      if (staticProject) {
        setProject(staticProject);
        return;
      }

      // Then check database projects
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

    // Show prompt after 2 seconds
    const t = window.setTimeout(() => {
      setShowPrompt(true);
    }, 2000);

    return () => {
      window.clearTimeout(t);
    };
  }, [isProjectView, projectId]);

  const handleMaybeLater = () => {
    setShowPrompt(false);
    if (projectId) {
      sessionStorage.setItem(`${SS_HIDDEN_SESSION_PREFIX}${projectId}`, "1");
    }
  };

  const handleDismissForever = () => {
    setShowPrompt(false);
    if (projectId) {
      localStorage.setItem(`${LS_DISMISSED_PREFIX}${projectId}`, "1");
    }
  };

  const handleOpenInNewTab = () => {
    if (project?.appUrl) {
      window.open(project.appUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Don't render if not on project view or no project
  if (!isProjectView || !showPrompt || !project) return null;

  return (
    <AnimatePresence>
      <Dialog open={showPrompt} onOpenChange={(open) => !open && handleMaybeLater()}>
        <DialogContent className="sm:max-w-md">
          <button
            onClick={handleDismissForever}
            aria-label="Dismiss install prompt"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </button>

          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Install {project.title}
            </DialogTitle>
            <DialogDescription>
              You can install this app on your phone or desktop for a better experience.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">On Mobile (Android/iPhone):</h4>
              <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                <li>Click the "Open in New Tab" button below</li>
                <li>Tap the browser menu (⋮ or Share icon)</li>
                <li>Select "Add to Home Screen" or "Install"</li>
                <li>Confirm and the app will be installed</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">On Desktop (Chrome/Edge):</h4>
              <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                <li>Click the "Open in New Tab" button below</li>
                <li>Look for the install icon (⊕) in the address bar</li>
                <li>Click it and confirm installation</li>
              </ol>
            </div>

            <Button onClick={handleOpenInNewTab} className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={handleMaybeLater}
                variant="outline"
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button
                onClick={handleDismissForever}
                variant="ghost"
                className="flex-1 text-muted-foreground"
              >
                Don't Show Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};
