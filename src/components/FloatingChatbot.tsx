import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Lock, Unlock, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type ChatMode = "selection" | "demo" | "premium" | "locked";

const UNLOCK_PIN = "171219";
const STORAGE_KEY = "chatbot_unlocked";
const DEMO_USED_KEY = "chatbot_demo_used";

const PERSONAL_INFO = `👋 Hi! I'm Monirul Hasan Talha's AI Assistant.

📱 About Talha:
• Full-stack Developer & App Creator
• Passionate about building useful applications
• Skilled in React, TypeScript, and modern web technologies
• Created 30+ apps including educational tools, Islamic apps, and productivity tools

🎓 Education: HSC Student
📍 Location: Bangladesh
💼 Focus: Web & Mobile App Development

Feel free to ask me one question in demo mode!`;

export const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("selection");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [demoMessageSent, setDemoMessageSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check localStorage on mount
  useEffect(() => {
    const isUnlocked = localStorage.getItem(STORAGE_KEY) === "true";
    const demoUsed = localStorage.getItem(DEMO_USED_KEY) === "true";
    
    if (isUnlocked) {
      setMode("premium");
      setMessages([{
        role: "assistant",
        content: "Hi! I'm Talha's AI assistant. Ask me anything about his projects or skills!"
      }]);
    } else if (demoUsed) {
      setMode("locked");
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePremiumUnlock = () => {
    if (pinInput === UNLOCK_PIN) {
      localStorage.setItem(STORAGE_KEY, "true");
      setMode("premium");
      setPinError(false);
      setMessages([{
        role: "assistant",
        content: "🎉 Premium access unlocked! Hi! I'm Talha's AI assistant. Ask me anything about his projects or skills!"
      }]);
    } else {
      setPinError(true);
    }
  };

  const handleDemoMode = () => {
    setMode("demo");
    setMessages([{
      role: "assistant",
      content: PERSONAL_INFO
    }]);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check if demo mode and already sent a message
    if (mode === "demo" && demoMessageSent) {
      localStorage.setItem(DEMO_USED_KEY, "true");
      setMode("locked");
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { message: userMessage }
      });

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response }
      ]);

      // If demo mode, mark as used after first successful response
      if (mode === "demo") {
        setDemoMessageSent(true);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    // Selection screen
    if (mode === "selection") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          <div className="text-center space-y-2">
            <MessageCircle className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-lg font-semibold">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Choose your access mode</p>
          </div>
          
          <div className="w-full space-y-3">
            <Button 
              onClick={handleDemoMode}
              variant="outline" 
              className="w-full h-auto py-4 flex flex-col items-center gap-2"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Demo Mode</span>
              <span className="text-xs text-muted-foreground">1 free message</span>
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter unlock PIN"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  className={pinError ? "border-destructive" : ""}
                />
                <Button onClick={handlePremiumUnlock} size="icon">
                  <Unlock className="w-4 h-4" />
                </Button>
              </div>
              {pinError && (
                <p className="text-xs text-destructive">Invalid PIN. Try again.</p>
              )}
              <p className="text-xs text-center text-muted-foreground">
                <Lock className="w-3 h-3 inline mr-1" />
                Premium Access - Unlimited messages
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Locked screen
    if (mode === "locked") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          <div className="text-center space-y-2">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">Chatbot Locked</h3>
            <p className="text-sm text-muted-foreground">
              Demo limit reached. Enter PIN to unlock premium access.
            </p>
          </div>
          
          <div className="w-full space-y-2">
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter unlock PIN"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={pinError ? "border-destructive" : ""}
              />
              <Button onClick={handlePremiumUnlock} size="icon">
                <Unlock className="w-4 h-4" />
              </Button>
            </div>
            {pinError && (
              <p className="text-xs text-destructive">Invalid PIN. Try again.</p>
            )}
          </div>
        </div>
      );
    }

    // Chat interface (demo or premium)
    return (
      <>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mode === "demo" && !demoMessageSent && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
              ⚠️ Demo Mode: 1 message remaining
            </div>
          )}
          {mode === "demo" && demoMessageSent && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 text-xs text-destructive">
              🔒 Demo limit reached. Send another message to see unlock options.
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted/50 rounded-2xl px-4 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="border-t border-border/50 p-4 bg-background/50 backdrop-blur-xl"
        >
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "demo" && demoMessageSent ? "Demo limit reached..." : "Ask me anything..."}
              disabled={isLoading || (mode === "demo" && demoMessageSent)}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading || (mode === "demo" && demoMessageSent)}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </>
    );
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex items-center justify-center transition-all hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md h-[500px] glass-card rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-scale-in">
          {/* Header */}
          <div className="bg-primary/10 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">AI Assistant</h3>
              {mode === "premium" && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Premium</span>
              )}
              {mode === "demo" && (
                <span className="text-xs bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">Demo</span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-muted/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {renderContent()}
        </div>
      )}
    </>
  );
};
