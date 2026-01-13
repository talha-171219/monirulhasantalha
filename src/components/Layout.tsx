import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { BrowserChrome } from "./BrowserChrome";
import { BottomNav } from "./BottomNav";
import { ThemeToggle } from "./ThemeToggle";
import { FloatingChatbot } from "./FloatingChatbot";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isProjectView = location.pathname.startsWith('/project/');
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isProjectView && <BrowserChrome />}
      
      {!isProjectView && (
        <div className="fixed top-20 right-4 z-30">
          <ThemeToggle />
        </div>
      )}
      
      <main className="flex-1 overflow-y-auto pt-14 pb-20">
        {children}
      </main>
      
      {!isProjectView && <BottomNav />}
      <FloatingChatbot />
    </div>
  );
};
