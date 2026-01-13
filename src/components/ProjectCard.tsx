import { ExternalLink, Heart, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    <motion.div 
      className="glass-card project-card overflow-hidden group cursor-pointer"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={handleOpenApp}
    >
      {/* Thumbnail with gradient overlay */}
      <div className="aspect-[16/10] relative overflow-hidden rounded-t-2xl">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {project.premium && (
            <Badge className="badge-glow text-white border-0 flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Premium
            </Badge>
          )}
          {project.featured && (
            <Badge className="bg-accent/90 text-accent-foreground border-0 glow-cyan">
              Featured
            </Badge>
          )}
        </div>
        
        {/* Favorite button */}
        <motion.button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2.5 rounded-full glass-card hover:scale-110 transition-transform"
          aria-label={isProjectFavorite ? "Remove from favorites" : "Add to favorites"}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all",
              isProjectFavorite 
                ? "fill-primary text-primary drop-shadow-[0_0_8px_hsla(270,70%,55%,0.8)]" 
                : "text-muted-foreground hover:text-primary"
            )}
          />
        </motion.button>

        {/* Bottom glow line on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-1.5 line-clamp-1 font-heading group-hover:gradient-text transition-all">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className="text-xs bg-secondary/50 border border-border/50 hover:border-primary/30 transition-colors"
          >
            {project.category}
          </Badge>
          
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenApp();
            }}
            className="flex items-center gap-1.5 px-4 py-2 glow-button text-white rounded-full text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
