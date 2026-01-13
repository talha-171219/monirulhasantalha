import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut, BookOpen, ArrowUp, ArrowDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/unsafeClient";

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

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, [navigate]);

  const checkAdminAccess = async () => {
    try {
      // Check if password was verified
      const adminVerified = sessionStorage.getItem("admin_verified");
      
      if (adminVerified === "true") {
        setIsAuthenticated(true);
        fetchProjects();
        fetchBlogPosts();
        return;
      }

      // Fallback: check database role
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/settings");
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error || !data) {
        toast({
          title: "Access Denied",
          description: "Please enter the admin password in Settings",
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

    // Convert file to base64 for preview
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
    sessionStorage.removeItem("admin_verified");
    await supabase.auth.signOut();
    navigate("/settings");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const { error } = await supabase.from("projects").insert([formData]);

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
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Tabs for Projects and Blog */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="blog">Daily Blog</TabsTrigger>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
