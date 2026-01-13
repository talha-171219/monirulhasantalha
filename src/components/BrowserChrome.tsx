import { Search, Home, ChevronLeft, ChevronRight, RotateCw, Shield, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
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
    <div className="browser-chrome fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-border/50 bg-background/95">
      <div className="max-w-screen-xl mx-auto w-full px-3 sm:px-4 py-1.5 sm:py-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Navigation Controls */}
          <TooltipProvider>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-accent"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleForward}
                    className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-accent"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Forward</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-accent"
                  >
                    <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleHome}
                    className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-accent"
                  >
                    <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Home</TooltipContent>
              </Tooltip>
            </div>

            {/* Address Bar */}
            <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 address-bar h-9 sm:h-10 shadow-sm hover:shadow-md transition-shadow">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary ml-2.5" />
              <div className="flex-1 flex items-center gap-2 py-1.5">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects or enter project name..."
                  className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 mr-1 hover:bg-accent"
                  >
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bookmark</TooltipContent>
              </Tooltip>
            </form>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
