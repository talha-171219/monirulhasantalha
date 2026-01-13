import { useEffect, useState } from "react";
import { BookOpen, Calendar, User, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  published: boolean;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPreview = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <motion.div 
            className="space-y-3 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Latest Updates</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading gradient-text">
              Blog
            </h1>
            <p className="text-muted-foreground">
              Articles, tutorials & insights
            </p>
          </motion.div>

          {/* Blog Posts */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
              <p className="mt-4 text-muted-foreground text-sm">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <motion.div 
              className="glass-card rounded-2xl p-12 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="text-lg text-muted-foreground">
                No blog posts yet. Check back soon!
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {posts.map((post, index) => {
                const isExpanded = expandedId === post.id;
                
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="group"
                  >
                    <div
                      onClick={() => toggleExpand(post.id)}
                      className={`
                        glass-card rounded-xl cursor-pointer transition-all duration-300
                        hover:border-primary/30 hover:shadow-glow-sm
                        ${isExpanded ? 'border-primary/40 shadow-glow-sm' : ''}
                      `}
                    >
                      {/* Card Header - Always Visible */}
                      <div className="p-4 md:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Title */}
                            <h2 className={`
                              font-heading font-semibold text-lg md:text-xl leading-tight
                              transition-colors duration-200
                              ${isExpanded ? 'gradient-text' : 'text-foreground group-hover:text-primary'}
                            `}>
                              {post.title}
                            </h2>
                            
                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(post.created_at)}</span>
                              </div>
                            </div>

                            {/* Preview Text - Only when collapsed */}
                            {!isExpanded && (
                              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                                {getPreview(post.content)}
                              </p>
                            )}
                          </div>

                          {/* Expand/Collapse Indicator */}
                          <div className="flex-shrink-0 flex flex-col items-end gap-2">
                            <Badge 
                              variant="secondary" 
                              className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border-0"
                            >
                              Published
                            </Badge>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center"
                            >
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-5 md:px-5">
                              {/* Separator */}
                              <div className="separator-gradient mb-4" />
                              
                              {/* Full Content */}
                              <div className="prose prose-sm max-w-none">
                                <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                                  {post.content}
                                </p>
                              </div>

                              {/* Close hint */}
                              <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <ChevronUp className="w-3 h-3" />
                                <span>Click to collapse</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}

          {/* Footer Stats */}
          {posts.length > 0 && (
            <motion.div 
              className="text-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xs text-muted-foreground">
                Showing <span className="text-primary font-medium">{posts.length}</span> {posts.length === 1 ? 'post' : 'posts'}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;