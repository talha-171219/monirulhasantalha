import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface RotatingRolesProps {
  roles: string[];
  interval?: number;
  className?: string;
}

/**
 * Smoothly rotates between professional role labels with a fade/slide effect.
 */
export const RotatingRoles = ({
  roles,
  interval = 2400,
  className = "",
}: RotatingRolesProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % roles.length);
    }, interval);
    return () => clearInterval(t);
  }, [roles.length, interval]);

  return (
    <span className={`relative inline-block align-baseline ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="inline-block bg-clip-text text-transparent bg-[linear-gradient(135deg,hsl(var(--accent))_0%,hsl(var(--primary))_100%)] font-semibold"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
