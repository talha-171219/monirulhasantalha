import { useState } from "react";
import { projects as staticProjects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/data/projects";

const GamesProjects = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Game project IDs to show
  const gameProjectIds = ["ludo-master", "pixel-runner", "tic-tac-toe"];
  
  // Filter projects that are games
  const gameProjects = staticProjects.filter(p => 
    gameProjectIds.includes(p.id) || p.category === "Games"
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsRefreshing(false);
    toast({
      title: "Games refreshed",
      description: "All games have been updated",
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-4 slide-up">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                  🎮 Games
                </h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="shrink-0 mr-16"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="ml-2">Refresh</span>
              </Button>
            </div>
            
            <p className="text-muted-foreground">
              Fun gaming experiences - {gameProjects.length} games available
            </p>
          </div>

          {/* Projects Grid */}
          {gameProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameProjects.map((project, index) => (
                <div key={project.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No games found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamesProjects;
