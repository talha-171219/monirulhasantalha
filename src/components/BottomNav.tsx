import { Home, Briefcase, User, Settings, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Briefcase, label: "Projects", path: "/projects" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: User, label: "About", path: "/about" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 nav-bar-glass safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200"
            >
              {/* Active indicator glow */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive 
                      ? "text-primary drop-shadow-[0_0_10px_hsla(270,70%,55%,0.8)]" 
                      : "text-muted-foreground hover:text-primary/70"
                  )}
                />
              </motion.div>
              <span
                className={cn(
                  "text-[10px] font-medium relative z-10 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
