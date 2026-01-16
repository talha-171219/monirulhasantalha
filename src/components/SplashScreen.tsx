import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useSplashAudio } from "@/hooks/useSplashAudio";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen = ({ onComplete, duration = 4500 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const audioInitialized = useRef(false);
  
  // Initialize splash audio with matching duration
  const { playSound, stopSound } = useSplashAudio({
    duration: duration - 500, // Slightly shorter to fade before transition
    volume: 0.2, // Low, premium-feeling volume
    fadeInDuration: 600, // Smooth fade in
    enableHaptic: true,
  });

  useEffect(() => {
    // Play audio on first render (with user gesture detection)
    if (!audioInitialized.current) {
      audioInitialized.current = true;
      
      // Small delay to ensure component is mounted
      const audioTimer = setTimeout(() => {
        playSound();
      }, 100);
      
      return () => clearTimeout(audioTimer);
    }
  }, [playSound]);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (duration / 50));
      });
    }, 50);

    // Hide splash after duration
    const timer = setTimeout(() => {
      stopSound(); // Stop audio before transition
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for exit animation
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      stopSound(); // Cleanup audio on unmount
    };
  }, [duration, onComplete, stopSound]);

  const titleText = "Monirul Hasan Talha";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background"
        >
          {/* Animated Background with gradient orbs */}
          <div className="absolute inset-0">
            {/* Purple Orb */}
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full opacity-30"
              style={{
                background: "radial-gradient(circle, hsl(270 70% 55% / 0.4) 0%, transparent 70%)",
                filter: "blur(80px)",
                top: "-20%",
                right: "-10%",
              }}
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Cyan Orb */}
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full opacity-25"
              style={{
                background: "radial-gradient(circle, hsl(190 100% 50% / 0.4) 0%, transparent 70%)",
                filter: "blur(80px)",
                bottom: "-15%",
                left: "-10%",
              }}
              animate={{
                x: [0, -20, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(0 0% 100% / 0.02) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(0 0% 100% / 0.02) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: i % 2 === 0 ? "hsl(270 70% 55%)" : "hsl(190 100% 50%)",
                  boxShadow: i % 2 === 0 
                    ? "0 0 10px hsl(270 70% 55%), 0 0 20px hsl(270 70% 55%)" 
                    : "0 0 10px hsl(190 100% 50%), 0 0 20px hsl(190 100% 50%)",
                  left: `${5 + i * 10}%`,
                  top: `${15 + (i % 4) * 20}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.8, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Glowing Rings */}
          {[180, 260, 340].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{ 
                width: size, 
                height: size,
                border: `1px solid ${i % 2 === 0 ? 'hsl(270 70% 55% / 0.3)' : 'hsl(190 100% 50% / 0.2)'}`,
              }}
              animate={{
                scale: [0.8, 1.3, 0.8],
                opacity: [0, 0.6, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Logo Container */}
          <motion.div
            className="relative z-10 mb-10"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo Glow */}
            <motion.div
              className="absolute -inset-6 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(270 70% 55% / 0.4) 0%, hsl(190 100% 50% / 0.1) 50%, transparent 70%)",
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Logo Border Animation - Gradient */}
            <motion.div
              className="absolute -inset-1 rounded-3xl"
              style={{
                background: "linear-gradient(135deg, hsl(270 70% 55%), hsl(190 100% 50%), hsl(270 70% 55%))",
                backgroundSize: "200% 200%",
              }}
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Logo Container Inner */}
            <div className="relative bg-background rounded-3xl p-1">
              {/* Logo Image */}
              <motion.img
                src="/pwa-192.png"
                alt="MHT Logo"
                className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover relative z-10"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Scan Line */}
              <motion.div
                className="absolute left-1 right-1 h-0.5 z-20 rounded-full"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(190 100% 50%), transparent)",
                }}
                animate={{ top: ["10%", "90%", "10%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Title with Letter Animation - Gradient Text */}
          <div className="z-10 mb-3 flex flex-wrap justify-center">
            {titleText.split("").map((letter, i) => (
              <motion.span
                key={i}
                className="text-xl md:text-2xl font-heading font-bold"
                style={{ 
                  backgroundImage: "linear-gradient(135deg, hsl(270 70% 60%) 0%, hsl(250 80% 65%) 50%, hsl(190 100% 55%) 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  textShadow: "0 0 30px hsl(270 70% 55% / 0.5)",
                }}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.1 + i * 0.04, duration: 0.5, ease: "easeOut" }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </div>

          {/* Subtitle with Typing Effect */}
          <motion.div
            className="z-10 mb-8 flex items-center text-sm md:text-base font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <span className="text-muted-foreground">Initializing Portfolio</span>
            <motion.span
              className="ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <span className="text-primary">_</span>
            </motion.span>
          </motion.div>

          {/* Progress Bar */}
          <div className="z-10 w-64 md:w-72">
            <div
              className="relative h-1.5 rounded-full overflow-hidden bg-secondary"
              style={{
                border: "1px solid hsl(var(--glass-border))",
              }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, hsl(270 70% 50%), hsl(250 80% 60%), hsl(190 100% 50%))",
                  backgroundSize: "200% 100%",
                }}
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${Math.min(progress, 100)}%`,
                  backgroundPosition: ["200% 0", "-200% 0"],
                }}
                transition={{ 
                  width: { duration: 0.1 },
                  backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
                }}
              />

              {/* Progress Glow */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(270 70% 55% / 0.5), transparent)",
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Progress Percentage */}
            <motion.div
              className="text-center mt-3 text-xs font-mono text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-primary">{Math.round(progress)}%</span>
              <span className="ml-2">Loading...</span>
            </motion.div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: i === 0 ? "hsl(var(--primary))" : "hsl(var(--muted))",
                    boxShadow: i === 0 ? "0 0 10px hsl(var(--primary))" : "none",
                  }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 1, 0.4],
                    background: [
                      i === 0 ? "hsl(270 70% 55%)" : "hsl(var(--muted))",
                      "hsl(190 100% 50%)",
                      i === 0 ? "hsl(270 70% 55%)" : "hsl(var(--muted))",
                    ],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(270 70% 55%), hsl(190 100% 50%), transparent)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};