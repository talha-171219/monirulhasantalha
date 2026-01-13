import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { projects as staticProjects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { supabase } from "@/integrations/supabase/unsafeClient";
import type { Project } from "@/data/projects";

const Home = () => {
  const [projects, setProjects] = useState<Project[]>(staticProjects);

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

  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="px-4 pt-8 pb-12">
        <div className="max-w-4xl mx-auto text-center space-y-6 slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Welcome to my portfolio</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Monirul Hasan Talha
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Web Developer & Tech Enthusiast building beautiful and functional experiences
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 glass-card rounded-full font-medium hover:bg-muted/50 transition-colors"
            >
              <span>About Me</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Projects</h2>
            <Link
              to="/projects"
              className="text-sm text-primary font-medium hover:underline"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          {[
            { label: "Projects", value: projects.length },
            { label: "Categories", value: new Set(projects.map(p => p.category)).size },
            { label: "Featured", value: featuredProjects.length }
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
