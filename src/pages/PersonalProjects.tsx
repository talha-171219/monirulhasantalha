import { useState, useEffect } from "react";
import { projects as staticProjects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/data/projects";
import { motion } from "framer-motion";

const PersonalProjects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

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
      description: "Personal projects have been updated",
    });
  };

  // Filter only personal projects
  const personalProjects = projects.filter((p) => p.category === "Personal");

  // Get unique sub-categories if needed (using tags or other criteria)
  const categories = ["All", ...new Set(personalProjects.map((p) => p.category))];

  const filteredProjects =
    selectedCategory === "All"
      ? personalProjects
      : personalProjects.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                  <User className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-heading">Personal Projects</h1>
                  <p className="text-muted-foreground text-sm">
                    My personal apps & tools
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="shrink-0"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="ml-2 hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </motion.div>

          {filteredProjects.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Personal Projects Yet</h3>
              <p className="text-muted-foreground">
                Personal projects will appear here
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalProjects;
