import { Home, Briefcase, User, Settings, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
    <nav className="nav-bar fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/95 border-t border-border/50">
      <div className="flex items-center justify-around px-4 py-3 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200",
                isActive ? "bg-primary/10" : "hover:bg-muted/50"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6",
                  isActive ? "nav-icon-active" : "nav-icon"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
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
