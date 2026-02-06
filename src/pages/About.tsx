import { Mail, MapPin, Github, Phone, Facebook, MessageCircle, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getBioData } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import profileImage from "@/assets/profile-image.jpg";

const About = () => {
  const navigate = useNavigate();
  const bio = getBioData();

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Section */}
          <motion.div 
            className="glass-card p-8 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <motion.div 
                className="w-40 h-40 rounded-full overflow-hidden border-2 border-primary/50 shadow-glow-md flex-shrink-0 ring-4 ring-primary/20"
                whileHover={{ scale: 1.05 }}
              >
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              </motion.div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2 font-heading gradient-text">{bio.name}</h1>
                <p className="text-xl text-muted-foreground mb-3">{bio.tagline}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{bio.location}</span>
                </div>
              </div>
            </div>
            
            <p className="text-foreground/80 leading-relaxed text-center">{bio.bio}</p>
            
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <motion.button
                onClick={() => navigate('/blog')}
                className="px-6 py-3 glow-button text-white rounded-xl font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📝 Daily Blog
              </motion.button>
              <motion.button
                onClick={() => navigate('/settings')}
                className="px-6 py-3 glow-button-outline rounded-xl font-semibold text-foreground hover:text-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔐 Admin Panel
              </motion.button>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div 
            className="glass-card p-6 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold flex items-center gap-2 font-heading">
              <Code2 className="w-5 h-5 text-accent icon-glow" />
              <span className="gradient-text-primary">Skills & Technologies</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {bio.skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <Badge variant="secondary" className="px-4 py-2 text-sm bg-secondary/50 border border-border/50 hover:border-primary/30 hover:bg-primary/10 transition-all">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div 
            className="glass-card p-6 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold font-heading gradient-text-primary">Get In Touch</h2>
            <div className="space-y-3">
              {[
                { icon: Mail, label: "Email", value: bio.email, href: bio.social.email },
                { icon: Phone, label: "Phone", value: bio.phone },
                { icon: Github, label: "GitHub", value: "@talha-171219", href: bio.social.github },
                { icon: Facebook, label: "Facebook", value: "@talha171219", href: bio.social.facebook },
                { icon: MessageCircle, label: "WhatsApp", value: "Contact via WhatsApp", href: bio.social.whatsapp },
                { icon: MessageCircle, label: "Telegram", value: "@talha91108", href: bio.social.telegram },
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href || "#"}
                  target={item.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl glass-card hover:border-primary/30 transition-all group"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-accent icon-glow" />
                  </div>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
