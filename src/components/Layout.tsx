import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BrowserChrome } from "./BrowserChrome";
import { BottomNav } from "./BottomNav";
import { ThemeToggle } from "./ThemeToggle";
import { FloatingChatbot } from "./FloatingChatbot";
import { AnimatedBackground } from "./AnimatedBackground";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isProjectView = location.pathname.startsWith("/project/");

  // Force dark mode for the futuristic theme
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {!isProjectView && <BrowserChrome />}

      {!isProjectView && (
        <div className="fixed top-20 right-4 z-30">
          <ThemeToggle />
        </div>
      )}

      {/* Use body scroll for maximum compatibility (mobile + desktop) */}
      <main className="relative z-10 pt-14 pb-20">
        {children}
      </main>

      {!isProjectView && <BottomNav />}
      <FloatingChatbot />
    </div>
  );
};
