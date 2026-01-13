import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { SplashScreen } from "./components/SplashScreen";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import AllProjects from "./pages/AllProjects";
import PremiumProjects from "./pages/PremiumProjects";
import SimpleProjects from "./pages/SimpleProjects";
import ProjectView from "./pages/ProjectView";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenSplash, setHasSeenSplash] = useState(false);

  useEffect(() => {
    // Check if user has already seen splash in this session
    const seen = sessionStorage.getItem("splash_seen");
    if (seen === "1") {
      setShowSplash(false);
      setHasSeenSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasSeenSplash(true);
    sessionStorage.setItem("splash_seen", "1");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* Splash Screen - only shows once per session */}
        {showSplash && !hasSeenSplash && (
          <SplashScreen onComplete={handleSplashComplete} duration={4500} />
        )}
        
        <BrowserRouter>
          <PWAInstallPrompt />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/all" element={<AllProjects />} />
              <Route path="/projects/premium" element={<PremiumProjects />} />
              <Route path="/projects/simple" element={<SimpleProjects />} />
              <Route path="/project/:id" element={<ProjectView />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
