import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { projects as staticProjects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/data/projects";

const AllProjects = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
    }
    fetchProjects();
  }, [searchParams]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const dbProjects: Project[] = data.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        appUrl: p.app_url,
        thumbnail: p.thumbnail,
        featured: p.featured,
        premium: p.premium || false,
      }));
      setProjects([...staticProjects, ...dbProjects]);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProjects();
    setIsRefreshing(false);
    toast({
      title: "Projects refreshed",
      description: "All projects have been updated",
    });
  };
  
  const categories = ["All", ...new Set(projects.map((p) => p.category))];
  
  let filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter((p) => p.category === selectedCategory);
    
  if (searchQuery.trim()) {
    filteredProjects = filteredProjects.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const premiumProjects = filteredProjects.filter(p => p.premium);
  const simpleProjects = filteredProjects.filter(p => !p.premium);

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-4 slide-up">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold">All Projects</h1>
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
              {searchQuery ? `Search results for "${searchQuery}"` : `Browse through my collection of ${projects.length} projects`}
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className="cursor-pointer whitespace-nowrap px-4 py-2 transition-all"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {filteredProjects.length > 0 ? (
            <div className="space-y-8">
              {premiumProjects.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Premium Projects
                    </h2>
                    <Badge variant="default" className="bg-gradient-to-r from-primary to-primary/80">
                      {premiumProjects.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {premiumProjects.map((project, index) => (
                      <div key={project.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {simpleProjects.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Simple Apps</h2>
                    <Badge variant="secondary">{simpleProjects.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {simpleProjects.map((project, index) => (
                      <div key={project.id} className="fade-in" style={{ animationDelay: `${(premiumProjects.length + index) * 0.05}s` }}>
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No projects found in this category
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
