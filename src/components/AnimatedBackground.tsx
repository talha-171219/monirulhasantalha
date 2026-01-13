import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      
      {/* Floating orbs */}
      <motion.div
        className="floating-orb floating-orb-purple w-[600px] h-[600px] -top-40 -left-40"
        animate={{
          y: [0, -30, 0, 30, 0],
          x: [0, 20, 0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="floating-orb floating-orb-cyan w-[500px] h-[500px] top-1/3 -right-40"
        animate={{
          y: [0, 30, 0, -30, 0],
          x: [0, -20, 0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      <motion.div
        className="floating-orb floating-orb-purple w-[400px] h-[400px] bottom-20 left-1/4"
        animate={{
          y: [0, -20, 0, 20, 0],
          x: [0, 15, 0, -15, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="floating-orb floating-orb-cyan w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background opacity-80" />
    </div>
  );
};
