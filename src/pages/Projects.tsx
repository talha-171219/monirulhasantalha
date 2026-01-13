import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Crown, Layers, Sparkles } from "lucide-react";

const Projects = () => {
  const navigate = useNavigate();

  const projectCategories = [
    { path: "/projects/all", label: "All Projects", icon: Layers, description: "Browse all my work" },
    { path: "/projects/premium", label: "Premium Projects", icon: Crown, description: "Advanced full-stack apps", isPremium: true },
    { path: "/projects/simple", label: "Simple Apps", icon: Sparkles, description: "Quick utility tools" },
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
                    className={`w-full h-20 text-lg justify-start gap-4 ${cat.isPremium ? 'glow-button' : 'glass-card hover:border-primary/30'} ${!cat.isPremium && 'bg-transparent hover:bg-primary/10 text-foreground'}`}
                  >
                    <cat.icon className={`w-6 h-6 ${cat.isPremium ? 'text-white' : 'text-accent icon-glow'}`} />
                    <div className="text-left">
                      <div className="font-semibold">{cat.label}</div>
                      <div className={`text-xs ${cat.isPremium ? 'text-white/70' : 'text-muted-foreground'}`}>{cat.description}</div>
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
