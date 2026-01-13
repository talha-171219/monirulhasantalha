import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Zap, Code2, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, type Variants, type Easing } from "framer-motion";
import { projects as staticProjects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { supabase } from "@/integrations/supabase/client";
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

  // Show only specific projects on home page
  const homeProjectIds = [
    "al-quran",
    "muslim-corner", 
    "private-vault",
    "studyflow",
    "hsc-ques-exam",
    "workspace-canvas-pro",
    "study-helper"
  ];
  const featuredProjects = projects.filter((p) => homeProjectIds.includes(p.id));

  const easeOut: Easing = [0.16, 1, 0.3, 1];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="px-4 pt-12 pb-16 relative">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Animated Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-medium animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-accent icon-glow" />
              <span className="text-foreground/90">Welcome to my portfolio</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight font-heading"
          >
            <span className="gradient-text">Monirul Hasan</span>
            <br />
            <span className="text-foreground">Talha</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Web Developer & Tech Enthusiast building{" "}
            <span className="text-accent">beautiful</span> and{" "}
            <span className="text-primary">functional</span> experiences
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center pt-4"
          >
            <Link
              to="/projects"
              className="glow-button inline-flex items-center gap-2 px-8 py-4 text-white rounded-full font-semibold text-lg"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/about"
              className="glow-button-outline inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg text-foreground hover:text-primary transition-colors"
            >
              <span>About Me</span>
            </Link>
          </motion.div>

          {/* Floating Icons */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-8 pt-8"
          >
            {[
              { icon: Zap, color: "text-amber-400", label: "Fast" },
              { icon: Code2, color: "text-accent", label: "Clean" },
              { icon: Rocket, color: "text-primary", label: "Modern" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center gap-2 glass-card p-4 rounded-xl"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <item.icon className={`w-6 h-6 ${item.color} icon-glow`} />
                <span className="text-xs text-muted-foreground font-medium">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Separator */}
      <div className="separator-gradient max-w-2xl mx-auto my-8" />

      {/* Featured Projects */}
      <section className="px-4 pb-12">
        <motion.div
          className="max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold font-heading gradient-text-primary">
              Featured Projects
            </h2>
            <Link
              to="/projects"
              className="text-sm text-primary font-medium link-underline hover:text-accent transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Separator */}
      <div className="separator-gradient max-w-2xl mx-auto my-8" />

      {/* Quick Stats */}
      <section className="px-4 pb-8">
        <motion.div
          className="max-w-4xl mx-auto grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {[
            { label: "Projects", value: projects.length, icon: "📱" },
            {
              label: "Categories",
              value: new Set(projects.map((p) => p.category)).size,
              icon: "🏷️",
            },
            { label: "Featured", value: featuredProjects.length, icon: "⭐" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-card p-6 text-center group cursor-default"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-4xl font-bold stats-number font-heading">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
