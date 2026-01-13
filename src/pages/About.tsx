import { Mail, MapPin, Github, Phone, Facebook, MessageCircle, Code2 } from "lucide-react";
import { getBioData } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import profileImage from "@/assets/profile-image.jpg";

const About = () => {
  const bio = getBioData();

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Section */}
          <div className="glass-card p-6 space-y-6 slide-up">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl flex-shrink-0 ring-4 ring-primary/10">
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{bio.name}</h1>
                <p className="text-xl text-muted-foreground mb-3">{bio.tagline}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{bio.location}</span>
                </div>
              </div>
            </div>
            
            <p className="text-foreground leading-relaxed text-center">{bio.bio}</p>
            
            {/* Colorful Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <button
                onClick={() => window.location.href = '/blog'}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                📝 Daily Blog
              </button>
              <button
                onClick={() => window.location.href = '/settings'}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                🔐 Admin Panel
              </button>
            </div>
          </div>

          {/* Skills Section */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              Skills & Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {bio.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold">Get In Touch</h2>
            <div className="space-y-3">
              <a
                href={bio.social.email}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">{bio.email}</div>
                </div>
              </a>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <div className="p-2 rounded-full bg-primary/10">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-muted-foreground">{bio.phone}</div>
                </div>
              </div>
              
              <a
                href={bio.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Github className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">GitHub</div>
                  <div className="text-sm text-muted-foreground">@talha-171219</div>
                </div>
              </a>

              <a
                href={bio.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Facebook className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Facebook</div>
                  <div className="text-sm text-muted-foreground">@talha171219</div>
                </div>
              </a>

              <a
                href={bio.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-sm text-muted-foreground">Contact via WhatsApp</div>
                </div>
              </a>

              <a
                href={bio.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Telegram</div>
                  <div className="text-sm text-muted-foreground">@talha91108</div>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
