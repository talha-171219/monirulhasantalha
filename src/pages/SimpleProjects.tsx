import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { projects as staticProjects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/unsafeClient";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/data/projects";

const SimpleProjects = () => {
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
      .eq("premium", false)
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
      const staticSimple = staticProjects.filter(p => !p.premium);
      setProjects([...staticSimple, ...dbProjects]);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProjects();
    setIsRefreshing(false);
    toast({
      title: "Simple projects refreshed",
      description: "All simple projects have been updated",
    });
  };
  
  const simpleProjects = projects.filter(p => !p.premium);
  const categories = ["All", ...new Set(simpleProjects.map((p) => p.category))];
  
  let filteredProjects = selectedCategory === "All" 
    ? simpleProjects 
    : simpleProjects.filter((p) => p.category === selectedCategory);
    
  if (searchQuery.trim()) {
    filteredProjects = filteredProjects.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-4 slide-up">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold">Simple Projects</h1>
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
              {searchQuery ? `Search results for "${searchQuery}"` : `Browse through ${filteredProjects.length} simple projects`}
            </p>
          </div>

          {/* Category Filter */}
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

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project, index) => (
                <div key={project.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No simple projects found in this category
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleProjects;
