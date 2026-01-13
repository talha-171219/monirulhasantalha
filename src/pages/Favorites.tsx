import { ProjectCard } from "@/components/ProjectCard";
import { projects as staticProjects } from "@/data/projects";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart } from "lucide-react";

const Favorites = () => {
  const { favorites } = useFavorites();

  const favoriteProjects = staticProjects.filter((project) =>
    favorites.includes(project.id)
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <h1 className="text-4xl font-bold">Favorite Projects</h1>
        </div>
        <p className="text-muted-foreground">
          Your bookmarked projects for quick access
        </p>
      </div>

      {favoriteProjects.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No favorites yet</h3>
            <p className="text-muted-foreground">
              Start adding projects to your favorites by clicking the heart icon
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
