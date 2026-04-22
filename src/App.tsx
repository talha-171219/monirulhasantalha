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
import GamesProjects from "./pages/GamesProjects";
import PersonalProjects from "./pages/PersonalProjects";
import ProjectView from "./pages/ProjectView";
import AnotherActivities from "./pages/AnotherActivities";
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
    // Global error handler to prevent white screen crashes
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled rejection:", event.reason);
      event.preventDefault(); // Prevent crash
    };

    window.addEventListener("unhandledrejection", handleRejection);

    // Ensure the HTML loader overlay never blocks scrolling (failsafe)
    const loader = document.getElementById("app-loader");
    if (loader) {
      loader.style.pointerEvents = "none";
      loader.style.transition = "opacity 0.35s ease";
      loader.style.opacity = "0";
      window.setTimeout(() => loader.remove(), 400);
    }

    // Splash & audio permission screens are disabled (code kept for future use).
    // App goes straight to ready state for smooth UX.
    setShowAudioPermission(false);
    setShowSplash(false);
    setAppReady(true);
    try {
      sessionStorage.setItem("splash_seen", "1");
    } catch (e) {
      // ignore storage errors
    }

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  const handleAudioAllow = () => {
    try {
      // Save permission permanently
      localStorage.setItem(AUDIO_PERMISSION_KEY, "granted");
    } catch (e) {
      console.error("Failed to save audio preference:", e);
    }
    setAudioEnabled(true);
    setShowAudioPermission(false);
    setShowSplash(true);
  };

  const handleAudioSkip = () => {
    try {
      // Save preference permanently
      localStorage.setItem(AUDIO_PERMISSION_KEY, "denied");
    } catch (e) {
      console.error("Failed to save audio preference:", e);
    }
    setAudioEnabled(false);
    setShowAudioPermission(false);
    setShowSplash(true);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    setAppReady(true);
    try {
      sessionStorage.setItem("splash_seen", "1");
    } catch (e) {
      console.error("Failed to save splash state:", e);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
          
          <PWAInstallPrompt />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/all" element={<AllProjects />} />
              <Route path="/projects/premium" element={<PremiumProjects />} />
              <Route path="/projects/simple" element={<SimpleProjects />} />
              <Route path="/projects/games" element={<GamesProjects />} />
              <Route path="/projects/personal" element={<PersonalProjects />} />
              <Route path="/project/:id" element={<ProjectView />} />
              <Route path="/activities" element={<AnotherActivities />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
