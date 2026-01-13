import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Shield, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        // Server-side role check only
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (!error && data) {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  const handleAccessAdmin = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 pb-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2 slide-up">
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Settings</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your app settings and preferences
            </p>
          </div>

          {/* Authentication Status */}
          <Card className="glass-card fade-in">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>
                {user ? `Signed in as ${user.email}` : "Not signed in"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">
                      Role: {isAdmin ? "Admin" : "User"}
                    </span>
                    {isAdmin && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        Admin Access
                      </span>
                    )}
                  </div>
                  <Button onClick={handleSignOut} variant="outline" className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={() => navigate("/auth")} className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Admin Panel Access - Only show to admins */}
          {user && isAdmin && (
            <Card className="glass-card fade-in">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <CardTitle>Admin Panel</CardTitle>
                </div>
                <CardDescription>
                  Access project management dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleAccessAdmin}
                  disabled={isLoading}
                  className="w-full"
                >
                  Access Admin Panel
                </Button>
              </CardContent>
            </Card>
          )}

          {/* App Information */}
          <Card className="glass-card fade-in">
            <CardHeader>
              <CardTitle>App Information</CardTitle>
              <CardDescription>About this portfolio app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">2.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Developer</span>
                <span className="font-medium">Talha</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform</span>
                <span className="font-medium">Web App</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Security</span>
                <span className="font-medium text-green-500">Enhanced</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
