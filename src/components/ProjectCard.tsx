import { ExternalLink, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Project } from "@/data/projects";
import { Badge } from "./ui/badge";
import { getIconForProject } from "@/data/iconMapping";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const handleOpenApp = () => {
    navigate(`/project/${project.id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(project.id);
  };

  const projectIcon = getIconForProject(project.title, project.category);
  const isProjectFavorite = isFavorite(project.id);

  return (
    <div className="glass-card project-card overflow-hidden group">
      <div className="aspect-[4/3] bg-muted/30 relative overflow-hidden rounded-t-2xl">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {project.premium && (
            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              Premium
            </Badge>
          )}
          {project.featured && (
            <Badge className="bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          aria-label={isProjectFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isProjectFavorite ? "fill-primary text-primary" : "text-muted-foreground"
            )}
          />
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {project.category}
          </Badge>
          
          <button
            onClick={handleOpenApp}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <span>View App</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
