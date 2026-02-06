import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Crown, Layers, Sparkles, User } from "lucide-react";

const Projects = () => {
  const navigate = useNavigate();

  const projectCategories = [
    { 
      path: "/projects/all", 
      label: "All Projects", 
      icon: Layers, 
      description: "Browse all my work",
      colorClass: "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 hover:border-blue-400/50 hover:from-blue-600/30 hover:to-indigo-600/30",
      iconClass: "text-blue-400",
      descClass: "text-blue-300/70"
    },
    { 
      path: "/projects/premium", 
      label: "Premium Projects", 
      icon: Crown, 
      description: "Advanced full-stack apps", 
      colorClass: "bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 hover:border-violet-400/50 hover:from-violet-600/30 hover:to-purple-600/30 shadow-[0_0_20px_hsla(270,70%,50%,0.2)]",
      iconClass: "text-violet-400",
      descClass: "text-violet-300/70"
    },
    { 
      path: "/projects/simple", 
      label: "Simple Apps", 
      icon: Sparkles, 
      description: "Quick utility tools",
      colorClass: "bg-gradient-to-r from-cyan-600/20 to-teal-600/20 border border-cyan-500/30 hover:border-cyan-400/50 hover:from-cyan-600/30 hover:to-teal-600/30",
      iconClass: "text-cyan-400",
      descClass: "text-cyan-300/70"
    },
    { 
      path: "/projects/personal", 
      label: "Personal Projects", 
      icon: User, 
      description: "My personal apps & tools",
      colorClass: "bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 hover:border-emerald-400/50 hover:from-emerald-600/30 hover:to-green-600/30",
      iconClass: "text-emerald-400",
      descClass: "text-emerald-300/70"
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold font-heading gradient-text">My Projects</h1>
              <p className="text-muted-foreground text-lg">
                Choose a category to explore my work
              </p>
            </div>
            
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              {projectCategories.map((cat, i) => (
                <motion.div
                  key={cat.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Button
                    onClick={() => navigate(cat.path)}
                    size="lg"
                    className={`w-full h-20 text-lg justify-start gap-4 ${cat.colorClass} text-foreground transition-all duration-300`}
                  >
                    <cat.icon className={`w-6 h-6 ${cat.iconClass}`} />
                    <div className="text-left">
                      <div className="font-semibold">{cat.label}</div>
                      <div className={`text-xs ${cat.descClass}`}>{cat.description}</div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
