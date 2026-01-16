import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "./components/Layout";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { SplashScreen } from "./components/SplashScreen";
import { AudioPermissionScreen } from "./components/AudioPermissionScreen";
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

// Audio permission storage key
const AUDIO_PERMISSION_KEY = "audio_permission_granted";

const App = () => {
  const [showAudioPermission, setShowAudioPermission] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Check if user has already seen splash in this session
    const splashSeen = sessionStorage.getItem("splash_seen");
    
    if (splashSeen === "1") {
      // Already seen splash this session, go straight to app
      setAppReady(true);
      return;
    }

    // Check if audio permission was previously granted (persisted in localStorage)
    const audioPermission = localStorage.getItem(AUDIO_PERMISSION_KEY);
    
    if (audioPermission === "granted") {
      // Permission already granted, skip to splash with audio
      setAudioEnabled(true);
      setShowSplash(true);
    } else if (audioPermission === "denied") {
      // User previously skipped, go to splash without audio
      setAudioEnabled(false);
      setShowSplash(true);
    } else {
      // First time - show audio permission screen
      setShowAudioPermission(true);
    }
  }, []);

  const handleAudioAllow = () => {
    // Save permission permanently
    localStorage.setItem(AUDIO_PERMISSION_KEY, "granted");
    setAudioEnabled(true);
    setShowAudioPermission(false);
    setShowSplash(true);
  };

  const handleAudioSkip = () => {
    // Save preference permanently
    localStorage.setItem(AUDIO_PERMISSION_KEY, "denied");
    setAudioEnabled(false);
    setShowAudioPermission(false);
    setShowSplash(true);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    setAppReady(true);
    sessionStorage.setItem("splash_seen", "1");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        <AnimatePresence mode="wait">
          {/* Audio Permission Screen - shows first time only */}
          {showAudioPermission && (
            <AudioPermissionScreen
              key="audio-permission"
              onAllow={handleAudioAllow}
              onSkip={handleAudioSkip}
            />
          )}

          {/* Splash Screen - shows after permission or on subsequent visits */}
          {showSplash && (
            <SplashScreen
              key="splash"
              onComplete={handleSplashComplete}
              duration={4500}
              audioEnabled={audioEnabled}
            />
          )}
        </AnimatePresence>
        
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
