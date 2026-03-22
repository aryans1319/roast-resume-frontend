import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Typewriter effect — types characters one by one.
 * Shows a blinking cursor while typing, removes it on complete.
 */
const TypewriterText = ({
  text = "",
  speed = 32,          // ms per character
  delay = 0,           // ms before starting
  style = {},
  className = "",
  onComplete = null,
  showCursor = true,
}) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);
  const [started, setStarted]     = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    setStarted(false);
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [text, delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      setDone(true);
      onComplete?.();
      return;
    }
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [displayed, started, text, speed, onComplete]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
      className={className}
      style={style}
    >
      {displayed}
      {showCursor && !done && (
        <span
          style={{
            display: "inline-block",
            width: 2,
            height: "1em",
            background: "currentColor",
            marginLeft: 3,
            verticalAlign: "text-bottom",
            animation: "blink 0.7s step-end infinite",
          }}
        />
      )}
    </motion.span>
  );
};

export default TypewriterText;
