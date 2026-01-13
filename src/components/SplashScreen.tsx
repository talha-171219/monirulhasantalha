import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen = ({ onComplete, duration = 4500 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

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
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for exit animation
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onComplete]);

  const titleText = "Monirul Hasan Talha";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at center, #0d1f29 0%, #08131a 50%, #030a0e 100%)",
          }}
        >
          {/* Cyber Grid Background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(29, 185, 84, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(29, 185, 84, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              animation: "gridMove 20s linear infinite",
            }}
          />

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: "#1db954",
                  boxShadow: "0 0 10px #1db954, 0 0 20px #1db954",
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 30}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Glowing Rings */}
          {[200, 280, 360].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-primary/30"
              style={{ width: size, height: size }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
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
              className="absolute -inset-5 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(29, 185, 84, 0.4) 0%, transparent 70%)",
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Logo Border Animation */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                border: "2px solid transparent",
                background: "linear-gradient(135deg, #1db954, #0a5c2a, #1db954) border-box",
                WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
              animate={{ filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Logo Image */}
            <motion.img
              src="/pwa-192.png"
              alt="MHT Logo"
              className="w-36 h-36 rounded-3xl object-cover relative z-10"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Scan Line */}
            <motion.div
              className="absolute left-0 right-0 h-1 z-20"
              style={{
                background: "linear-gradient(90deg, transparent, #1db954, transparent)",
              }}
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* Title with Letter Animation */}
          <div className="z-10 mb-3 flex">
            {titleText.split("").map((letter, i) => (
              <motion.span
                key={i}
                className="text-xl md:text-2xl font-bold text-white"
                style={{ textShadow: "0 0 20px rgba(29, 185, 84, 0.5)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </div>

          {/* Subtitle with Typing Effect */}
          <motion.div
            className="z-10 mb-8 flex items-center text-sm md:text-base"
            style={{ color: "rgba(29, 185, 84, 0.8)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <span className="font-mono">Initializing Portfolio...</span>
            <motion.span
              className="ml-1 text-primary"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              |
            </motion.span>
          </motion.div>

          {/* Progress Bar */}
          <div className="z-10 w-60">
            <div
              className="relative h-1.5 rounded-full overflow-hidden"
              style={{
                background: "rgba(29, 185, 84, 0.1)",
                border: "1px solid rgba(29, 185, 84, 0.2)",
              }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #0a5c2a, #1db954, #0a5c2a)",
                  backgroundSize: "200% 100%",
                }}
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${Math.min(progress, 100)}%`,
                  backgroundPosition: ["200% 0", "-200% 0"],
                }}
                transition={{ 
                  width: { duration: 0.1 },
                  backgroundPosition: { duration: 1, repeat: Infinity, ease: "linear" }
                }}
              />

              {/* Progress Glow */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(29, 185, 84, 0.5), transparent)",
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: i === 0 ? "#1db954" : "rgba(29, 185, 84, 0.3)",
                    boxShadow: i === 0 ? "0 0 10px #1db954" : "none",
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </div>

          {/* CSS for grid animation */}
          <style>{`
            @keyframes gridMove {
              0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
              100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};