import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

/**
 * Typewriter effect: types one character at a time with a blinking caret.
 * Used for hero name on Home page.
 */
export const TypewriterText = ({
  text,
  speed = 90,
  delay = 0,
  className = "",
  showCursor = true,
  onComplete,
}: TypewriterTextProps) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      if (!done) {
        setDone(true);
        onComplete?.();
      }
      return;
    }
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, started, text, speed, done, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && (
        <span
          aria-hidden
          className={`inline-block w-[3px] md:w-[4px] h-[0.9em] align-middle ml-1 bg-accent rounded-sm ${
            done ? "animate-pulse" : ""
          }`}
          style={{
            animation: done
              ? "blink 1s step-end infinite"
              : "blink 0.7s step-end infinite",
          }}
        />
      )}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};
