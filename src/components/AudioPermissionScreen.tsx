import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface AudioPermissionScreenProps {
  onAllow: () => void;
  onSkip: () => void;
}

export const AudioPermissionScreen = ({ onAllow, onSkip }: AudioPermissionScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(270 70% 55% / 0.5) 0%, transparent 70%)",
            filter: "blur(60px)",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 max-w-sm text-center">
        {/* Icon */}
        <motion.div
          className="mb-8 p-6 rounded-full bg-primary/10 border border-primary/30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Volume2 className="w-12 h-12 text-primary" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-xl font-heading font-bold mb-3"
          style={{
            backgroundImage: "linear-gradient(135deg, hsl(270 70% 60%), hsl(190 100% 55%))",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Enable Sound Experience
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-sm text-muted-foreground mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Experience a premium AI-powered initialization with futuristic sound effects and haptic feedback.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col gap-3 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Allow Button */}
          <motion.button
            onClick={onAllow}
            className="w-full py-3.5 px-6 rounded-xl font-medium text-white relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, hsl(270 70% 50%), hsl(250 80% 55%), hsl(190 100% 45%))",
              backgroundSize: "200% 200%",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Volume2 className="w-5 h-5" />
              Enable Sound
            </span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>

          {/* Skip Button */}
          <motion.button
            onClick={onSkip}
            className="w-full py-3 px-6 rounded-xl font-medium text-muted-foreground bg-secondary/50 border border-border/50 hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <VolumeX className="w-4 h-4" />
            Skip
          </motion.button>
        </motion.div>

        {/* Note */}
        <motion.p
          className="mt-6 text-xs text-muted-foreground/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Your preference will be saved for future visits
        </motion.p>
      </div>
    </motion.div>
  );
};
