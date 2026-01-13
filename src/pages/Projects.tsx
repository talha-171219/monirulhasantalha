import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Projects = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 slide-up">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">My Projects</h1>
              <p className="text-muted-foreground text-lg">
                Choose a category to explore my work
              </p>
            </div>
            
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <Button
                onClick={() => navigate("/projects/all")}
                size="lg"
                className="h-16 text-lg"
              >
                All Projects
              </Button>
              
              <Button
                onClick={() => navigate("/projects/premium")}
                size="lg"
                className="h-16 text-lg bg-gradient-to-r from-primary to-primary/80"
              >
                Premium Projects
              </Button>
              
              <Button
                onClick={() => navigate("/projects/simple")}
                size="lg"
                className="h-16 text-lg"
              >
                Simple Apps
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
