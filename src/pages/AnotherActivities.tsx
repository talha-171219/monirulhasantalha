import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, RefreshCw, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AnotherActivities = () => {
  const navigate = useNavigate();
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const appUrl = "https://anotheractivitiesforportfolio.lovable.app";
  const title = "Another Activities";

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleOpenExternal = () => {
    window.open(appUrl, "_blank", "noopener,noreferrer");
  };

  const handleInstallApp = () => {
    window.open(appUrl, "_blank", "noopener,noreferrer");
    toast.success("App opened in new tab. You can now install it from your browser menu!");
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background z-50">
      {/* Fixed Header */}
      <header className="flex-shrink-0 h-12 bg-background/95 backdrop-blur border-b border-border/50 flex items-center justify-between px-3 z-50">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-9 w-9 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-semibold text-sm truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
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
                <DialogTitle>Install {title}</DialogTitle>
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
            className="h-9 w-9"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenExternal}
            title="Open in new tab"
            className="h-9 w-9"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Full Screen iframe */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center gap-4 animate-fade-in">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading {title}...</p>
            </div>
          </div>
        )}
        <iframe
          key={iframeKey}
          src={appUrl}
          className="absolute inset-0 w-full h-full border-0"
          title={title}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-pointer-lock allow-top-navigation-by-user-activation allow-storage-access-by-user-activation"
          allow="camera *; microphone *; geolocation *; autoplay *; encrypted-media *; fullscreen *; picture-in-picture *; display-capture *; clipboard-read *; clipboard-write *; payment *; usb *"
          loading="lazy"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};

export default AnotherActivities;
