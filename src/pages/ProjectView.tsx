import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, RefreshCw, Download, Loader2 } from "lucide-react";
import { projects as staticProjects } from "@/data/projects";
import { supabase } from "@/integrations/supabase/unsafeClient";
import type { Project } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      // First check static projects
      const staticProject = staticProjects.find((p) => p.id === id);
      
      if (staticProject) {
        setProject(staticProject);
        return;
      }

      // Then check database projects
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
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
  }, [id]);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleOpenExternal = () => {
    if (project?.appUrl) {
      window.open(project.appUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleInstallApp = () => {
    if (project?.appUrl) {
      // Open in new window for installation
      window.open(project.appUrl, "_blank", "noopener,noreferrer");
      toast.success("App opened in new tab. You can now install it from your browser menu!");
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Project not found</h2>
          <p className="text-muted-foreground">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/projects")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Compact Header with Navigation */}
      <div className="bg-background/95 backdrop-blur border-b border-border/50 shrink-0 relative z-50">
        <div className="px-3 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/projects")}
              className="shrink-0 h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-sm truncate">{project.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 gap-1.5 bg-primary hover:bg-primary/90"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Install App</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Install {project.title}</DialogTitle>
                  <DialogDescription>
                    You can install this app on your phone or desktop for a better experience.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">On Mobile (Android/iPhone):</h4>
                    <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                      <li>Click the "Open in New Tab" button in the top right corner</li>
                      <li>Tap the browser menu (⋮ or Share icon)</li>
                      <li>Select "Add to Home Screen" or "Install"</li>
                      <li>Confirm and the app will be installed</li>
                    </ol>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">On Desktop (Chrome/Edge):</h4>
                    <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                      <li>Click the "Open in New Tab" button in the top right corner</li>
                      <li>Look for the install icon (⊕) in the address bar</li>
                      <li>Click it and confirm installation</li>
                    </ol>
                  </div>
                  <Button onClick={handleInstallApp} className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              title="Refresh"
              className="h-8 w-8"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenExternal}
              title="Open in new tab"
              className="h-8 w-8"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Project Content in iframe - Full Screen */}
      <div className="flex-1 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center gap-4 animate-fade-in">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading {project.title}...</p>
            </div>
          </div>
        )}
        <iframe
          key={iframeKey}
          src={project.appUrl}
          className="w-full h-full border-0"
          title={project.title}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-pointer-lock allow-top-navigation-by-user-activation allow-storage-access-by-user-activation"
          allow="camera *; microphone *; geolocation *; autoplay *; encrypted-media *; fullscreen *; picture-in-picture *; display-capture *; clipboard-read *; clipboard-write *; payment *; usb *"
          loading="lazy"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};

export default ProjectView;
