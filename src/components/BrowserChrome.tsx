import { Search, Home, ChevronLeft, ChevronRight, RotateCw, Shield, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BrowserChromeProps {
  onSearch?: (query: string) => void;
}

export const BrowserChrome = ({ onSearch }: BrowserChromeProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects/all?search=${encodeURIComponent(searchQuery)}`);
      onSearch?.(searchQuery);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleForward = () => {
    window.history.forward();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 z-50 browser-chrome-glass"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-screen-xl mx-auto w-full px-3 sm:px-4 py-1.5 sm:py-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Navigation Controls */}
          <TooltipProvider>
            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="glass-card border-border/50">Back</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleForward}
                    className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="glass-card border-border/50">Forward</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="glass-card border-border/50">Refresh</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleHome}
                    className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="glass-card border-border/50">Home</TooltipContent>
              </Tooltip>
            </div>

            {/* Address Bar */}
            <form 
              onSubmit={handleSearch} 
              className="flex-1 flex items-center gap-2 glass-card h-9 sm:h-10 px-3 group hover:border-primary/30 transition-all"
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent icon-glow" />
              <div className="flex-1 flex items-center gap-2 py-1.5">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 sm:h-7 sm:w-7 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="glass-card border-border/50">Bookmark</TooltipContent>
              </Tooltip>
            </form>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
};
