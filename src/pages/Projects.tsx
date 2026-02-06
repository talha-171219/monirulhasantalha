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
      bgStyle: "bg-[linear-gradient(135deg,hsl(220,80%,45%)_0%,hsl(240,70%,55%)_100%)]",
      hoverStyle: "hover:shadow-[0_0_25px_hsla(220,80%,50%,0.5)]",
      iconClass: "text-white",
      descClass: "text-blue-100/80"
    },
    { 
      path: "/projects/premium", 
      label: "Premium Projects", 
      icon: Crown, 
      description: "Advanced full-stack apps", 
      bgStyle: "bg-[linear-gradient(135deg,hsl(280,70%,50%)_0%,hsl(320,80%,55%)_100%)]",
      hoverStyle: "hover:shadow-[0_0_25px_hsla(280,70%,55%,0.5)]",
      iconClass: "text-white",
      descClass: "text-purple-100/80"
    },
    { 
      path: "/projects/simple", 
      label: "Simple Apps", 
      icon: Sparkles, 
      description: "Quick utility tools",
      bgStyle: "bg-[linear-gradient(135deg,hsl(185,80%,40%)_0%,hsl(200,85%,50%)_100%)]",
      hoverStyle: "hover:shadow-[0_0_25px_hsla(185,80%,45%,0.5)]",
      iconClass: "text-white",
      descClass: "text-cyan-100/80"
    },
    { 
      path: "/projects/personal", 
      label: "Personal Projects", 
      icon: User, 
      description: "My personal apps & tools",
      bgStyle: "bg-[linear-gradient(135deg,hsl(150,70%,40%)_0%,hsl(170,75%,45%)_100%)]",
      hoverStyle: "hover:shadow-[0_0_25px_hsla(150,70%,45%,0.5)]",
      iconClass: "text-white",
      descClass: "text-emerald-100/80"
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
                    className={`w-full h-20 text-lg justify-start gap-4 ${cat.bgStyle} ${cat.hoverStyle} text-white border-0 transition-all duration-300 hover:scale-[1.02]`}
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
