import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut, BookOpen, ArrowUp, ArrowDown, Upload, Bot, Send, X, Loader2, Sparkles, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  app_url: string;
  thumbnail: string;
  featured: boolean;
  premium: boolean;
  display_order: number;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  published: boolean;
}

interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  action?: any;
}

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    app_url: "",
    thumbnail: "",
    featured: false,
    premium: false,
  });
  const [blogFormData, setBlogFormData] = useState({
    title: "",
    content: "",
    author: "Talha",
    published: true,
  });
  const [notificationFormData, setNotificationFormData] = useState({
    title: "",
    message: "",
    url: "",
  });
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  
  // AI Assistant states
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiMessages, setAIMessages] = useState<AIChatMessage[]>([]);
  const [aiInput, setAIInput] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/settings");
        return;
      }

      // Server-side role verification only
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error || !data) {
        toast({
          title: "Access Denied",
          description: "Admin privileges required",
          variant: "destructive",
        });
        navigate("/settings");
        return;
      }

      setIsAuthenticated(true);
      fetchProjects();
      fetchBlogPosts();
    } catch (error) {
      navigate("/settings");
    }
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    } else {
      setProjects(data || []);
    }
  };

  const handleMoveUp = async (project: Project, index: number) => {
    if (index === 0) return;
    
    const prevProject = projects[index - 1];
    
    await supabase
      .from("projects")
      .update({ display_order: prevProject.display_order })
      .eq("id", project.id);
    
    await supabase
      .from("projects")
      .update({ display_order: project.display_order })
      .eq("id", prevProject.id);
    
    fetchProjects();
  };

  const handleMoveDown = async (project: Project, index: number) => {
    if (index === projects.length - 1) return;
    
    const nextProject = projects[index + 1];
    
    await supabase
      .from("projects")
      .update({ display_order: nextProject.display_order })
      .eq("id", project.id);
    
    await supabase
      .from("projects")
      .update({ display_order: project.display_order })
      .eq("id", nextProject.id);
    
    fetchProjects();
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, thumbnail: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const fetchBlogPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      });
    } else {
      setBlogPosts(data || []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/settings");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate display_order for new projects
    const getNextDisplayOrder = () => {
      if (projects.length === 0) return 0;
      return Math.max(...projects.map(p => p.display_order)) + 1;
    };

    if (editingProject) {
      const { error } = await supabase
        .from("projects")
        .update(formData)
        .eq("id", editingProject.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update project",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
        fetchProjects();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("projects").insert([{
        ...formData,
        display_order: getNextDisplayOrder()
      }]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add project",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Project added successfully",
        });
        fetchProjects();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      fetchProjects();
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      app_url: project.app_url,
      thumbnail: project.thumbnail,
      featured: project.featured,
      premium: project.premium || false,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      app_url: "",
      thumbnail: "",
      featured: false,
      premium: false,
    });
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBlogPost) {
      const { error } = await supabase
        .from("blog_posts")
        .update(blogFormData)
        .eq("id", editingBlogPost.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update blog post",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
        fetchBlogPosts();
        resetBlogForm();
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert([blogFormData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add blog post",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Blog post added successfully",
        });
        fetchBlogPosts();
        resetBlogForm();
      }
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      fetchBlogPosts();
    }
  };

  const handleEditBlogPost = (post: BlogPost) => {
    setEditingBlogPost(post);
    setBlogFormData({
      title: post.title,
      content: post.content,
      author: post.author,
      published: post.published,
    });
    setIsBlogDialogOpen(true);
  };

  const resetBlogForm = () => {
    setBlogFormData({
      title: "",
      content: "",
      author: "Talha",
      published: true,
    });
    setEditingBlogPost(null);
    setIsBlogDialogOpen(false);
  };

  // Send Push Notification
  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSendingNotification) return;

    setIsSendingNotification(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: notificationFormData.title,
          message: notificationFormData.message,
          url: notificationFormData.url || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send notification');
      }

      toast({
        title: "Notification Sent! 🔔",
        description: `Sent to ${data.recipients || 0} subscribers`,
      });

      setNotificationFormData({ title: "", message: "", url: "" });
      setIsNotificationDialogOpen(false);
    } catch (error) {
      console.error('Notification error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to send notification',
        variant: "destructive",
      });
    } finally {
      setIsSendingNotification(false);
    }
  };
  // AI Assistant Functions
  const sendAIMessage = async () => {
    if (!aiInput.trim() || isAILoading) return;

    const userMessage = aiInput.trim();
    setAIInput("");
    setAIMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsAILoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'AI request failed');
      }

      const data = await response.json();
      
      setAIMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        action: data.action
      }]);

      if (data.action) {
        setPendingAction(data.action);
      }
    } catch (error) {
      console.error('AI Error:', error);
      setAIMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`
      }]);
    } finally {
      setIsAILoading(false);
    }
  };

  const executeAction = async () => {
    if (!pendingAction) return;

    setIsAILoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      if (pendingAction.action === 'add_project') {
        let thumbnail = pendingAction.data.thumbnail;
        
        // Generate thumbnail if needed
        if (thumbnail === 'generate' || !thumbnail) {
          setAIMessages(prev => [...prev, { 
            role: 'assistant', 
            content: '🎨 Generating thumbnail...'
          }]);
          
          const thumbResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-thumbnail`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ title: pendingAction.data.title }),
          });

          if (thumbResponse.ok) {
            const thumbData = await thumbResponse.json();
            thumbnail = thumbData.thumbnail;
          } else {
            thumbnail = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400';
          }
        }

        // Calculate display order
        let displayOrder = 0;
        const position = pendingAction.data.position || 'bottom';
        
        if (position === 'top') {
          displayOrder = 0;
          // Shift all other projects down
          for (const p of projects) {
            await supabase.from("projects").update({ display_order: p.display_order + 1 }).eq("id", p.id);
          }
        } else if (position === 'bottom') {
          displayOrder = projects.length > 0 ? Math.max(...projects.map(p => p.display_order)) + 1 : 0;
        } else if (position.startsWith('after:')) {
          const afterName = position.replace('after:', '').toLowerCase();
          const targetIndex = projects.findIndex(p => p.title.toLowerCase().includes(afterName));
          if (targetIndex >= 0) {
            displayOrder = projects[targetIndex].display_order + 1;
            // Shift projects after this one
            for (let i = targetIndex + 1; i < projects.length; i++) {
              await supabase.from("projects").update({ display_order: projects[i].display_order + 1 }).eq("id", projects[i].id);
            }
          } else {
            displayOrder = projects.length;
          }
        }

        const { error } = await supabase.from("projects").insert([{
          title: pendingAction.data.title,
          description: pendingAction.data.description,
          category: pendingAction.data.category,
          app_url: pendingAction.data.app_url || '#',
          thumbnail: thumbnail,
          featured: pendingAction.data.featured || false,
          premium: pendingAction.data.premium || false,
          display_order: displayOrder,
        }]);

        if (error) throw error;

        toast({ title: "Success", description: "Project added by AI!" });
        fetchProjects();
        setAIMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `✅ Project "${pendingAction.data.title}" added successfully!`
        }]);
      } else if (pendingAction.action === 'add_blog') {
        const { error } = await supabase.from("blog_posts").insert([{
          title: pendingAction.data.title,
          content: pendingAction.data.content,
          author: pendingAction.data.author || 'Talha',
          published: true,
        }]);

        if (error) throw error;

        toast({ title: "Success", description: "Blog post added by AI!" });
        fetchBlogPosts();
        setAIMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `✅ Blog post "${pendingAction.data.title}" added successfully!`
        }]);
      }
    } catch (error) {
      console.error('Execute action error:', error);
      setAIMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }]);
    } finally {
      setIsAILoading(false);
      setPendingAction(null);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between slide-up">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your portfolio projects and blog</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsAIOpen(true)} variant="outline" size="sm" className="gap-2">
                <Sparkles className="w-4 h-4" />
                AI Assistant
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Tabs for Projects, Blog, and Notifications */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="blog">Daily Blog</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6 mt-6">

          {/* Add Project Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? "Edit Project" : "Add New Project"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">App URL</label>
                  <Input
                    type="url"
                    value={formData.app_url}
                    onChange={(e) => setFormData({ ...formData, app_url: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Thumbnail</label>
                  <div className="space-y-2">
                    <Input
                      type="url"
                      placeholder="Paste image URL here"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      required
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">OR</span>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-primary hover:underline">
                        <Upload className="w-4 h-4" />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {formData.thumbnail && (
                      <img 
                        src={formData.thumbnail} 
                        alt="Thumbnail preview" 
                        className="w-full max-w-xs rounded-lg border"
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium">Featured Project</label>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Project Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="projectType"
                        checked={formData.premium === true}
                        onChange={() => setFormData({ ...formData, premium: true })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Premium</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="projectType"
                        checked={formData.premium === false}
                        onChange={() => setFormData({ ...formData, premium: false })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Simple</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingProject ? "Update" : "Add"} Project
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Projects List */}
          <div className="grid gap-4">
            {projects.map((project, index) => (
              <Card key={project.id} className="glass-card">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-20 h-20 rounded-lg object-cover border"
                      />
                      <div className="flex-1">
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>{project.category}</CardDescription>
                        {project.featured && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-1 inline-block">
                            Featured
                          </span>
                        )}
                        {project.premium && (
                          <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded mt-1 ml-2 inline-block">
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex flex-col gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleMoveUp(project, index)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleMoveDown(project, index)}
                          disabled={index === projects.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  <a
                    href={project.app_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {project.app_url}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
            </TabsContent>

            <TabsContent value="blog" className="space-y-6 mt-6">
              {/* Add Blog Post Button */}
              <Dialog open={isBlogDialogOpen} onOpenChange={setIsBlogDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetBlogForm()} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Blog Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingBlogPost ? "Edit Blog Post" : "Add New Blog Post"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={blogFormData.title}
                        onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Content</label>
                      <Textarea
                        value={blogFormData.content}
                        onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                        required
                        rows={10}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Author</label>
                      <Input
                        value={blogFormData.author}
                        onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={blogFormData.published}
                        onChange={(e) => setBlogFormData({ ...blogFormData, published: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <label className="text-sm font-medium">Published</label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingBlogPost ? "Update" : "Add"} Blog Post
                      </Button>
                      <Button type="button" variant="outline" onClick={resetBlogForm} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Blog Posts List */}
              <div className="grid gap-4">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="glass-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            {post.title}
                          </CardTitle>
                          <CardDescription>
                            By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditBlogPost(post)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteBlogPost(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Send Push Notification
                  </CardTitle>
                  <CardDescription>
                    Send push notifications to all your subscribers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={sendNotification} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={notificationFormData.title}
                        onChange={(e) => setNotificationFormData({ ...notificationFormData, title: e.target.value })}
                        placeholder="Notification title"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        value={notificationFormData.message}
                        onChange={(e) => setNotificationFormData({ ...notificationFormData, message: e.target.value })}
                        placeholder="Write your notification message..."
                        required
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Link URL (Optional)</label>
                      <Input
                        type="url"
                        value={notificationFormData.url}
                        onChange={(e) => setNotificationFormData({ ...notificationFormData, url: e.target.value })}
                        placeholder="https://example.com/page"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Users will be taken to this URL when they click the notification
                      </p>
                    </div>
                    <Button type="submit" disabled={isSendingNotification} className="w-full">
                      {isSendingNotification ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4 mr-2" />
                          Send Notification
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Quick Notification Templates */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quick Templates</CardTitle>
                  <CardDescription>Click to use a template</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => setNotificationFormData({
                      title: "🚀 New Project Added!",
                      message: "Check out my latest project on the portfolio!",
                      url: "https://monirulhasantalha.lovable.app/projects",
                    })}
                  >
                    <div className="text-left">
                      <p className="font-medium">New Project Announcement</p>
                      <p className="text-xs text-muted-foreground">Notify about a new project</p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => setNotificationFormData({
                      title: "📝 New Blog Post!",
                      message: "I just published a new blog post. Check it out!",
                      url: "https://monirulhasantalha.lovable.app/blog",
                    })}
                  >
                    <div className="text-left">
                      <p className="font-medium">New Blog Post</p>
                      <p className="text-xs text-muted-foreground">Notify about a new blog entry</p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => setNotificationFormData({
                      title: "✨ Portfolio Update!",
                      message: "I've updated my portfolio with new features!",
                      url: "https://monirulhasantalha.lovable.app",
                    })}
                  >
                    <div className="text-left">
                      <p className="font-medium">General Update</p>
                      <p className="text-xs text-muted-foreground">Announce portfolio updates</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Assistant Panel */}
      {isAIOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                <CardTitle>AI Admin Assistant</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsAIOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {aiMessages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">AI Assistant Ready!</p>
                  <p className="text-sm mt-2">Try: "Add a new fitness app called Workout Pro" or "Write a blog about web development"</p>
                </div>
              )}
              
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.action && (
                      <div className="mt-3 p-2 bg-background/50 rounded border">
                        <p className="text-xs font-medium mb-2">Action: {msg.action.action}</p>
                        <Button size="sm" onClick={executeAction} disabled={isAILoading}>
                          {isAILoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Execute Action
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isAILoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </CardContent>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={aiInput}
                  onChange={(e) => setAIInput(e.target.value)}
                  placeholder="Ask AI to add projects or blog posts..."
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendAIMessage()}
                  disabled={isAILoading}
                />
                <Button onClick={sendAIMessage} disabled={isAILoading || !aiInput.trim()}>
                  {isAILoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
