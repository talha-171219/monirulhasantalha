import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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

export default App;
