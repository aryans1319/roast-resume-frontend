import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersonality } from "../context/PersonalityContext";

const PERSONAS = [
  {
    key:    "hr",
    name:   "Sarah K.",
    title:  "HR Screener",
    icon:   "👩‍💼",
    color:  "#00E5CC",
    delay:  0,
  },
  {
    key:    "hiringManager",
    name:   "Alex R.",
    title:  "Hiring Manager",
    icon:   "👨‍💻",
    color:  "#A78BFA",
    delay:  2000,
  },
  {
    key:    "ats",
    name:   "ATS-7",
    title:  "Applicant Tracking System",
    icon:   "🤖",
    color:  "#60A5FA",
    delay:  4000,
  },
];

const ChatBubble = ({ persona, message, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.34, 1.1, 0.64, 1] }}
        style={{ display: "flex", alignItems: "flex-end", gap: 12 }}
      >
        {/* Avatar */}
        <div style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          background: `${persona.color}15`,
          border: `1px solid ${persona.color}35`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>
          {persona.icon}
        </div>

        <div style={{ flex: 1 }}>
          {/* Name + title */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 7 }}>
            <span style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 13, fontWeight: 700,
              color: persona.color,
            }}>
              {persona.name}
            </span>
            <span style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10, color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.3px",
            }}>
              {persona.title}
            </span>
          </div>

          {/* Message bubble */}
          <div style={{
            padding: "14px 17px",
            background: `${persona.color}09`,
            border: `1px solid ${persona.color}18`,
            borderRadius: "4px 16px 16px 16px",
            display: "inline-block",
            maxWidth: "100%",
          }}>
            <p style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 13.5, lineHeight: 1.68,
              color: "rgba(255,255,255,0.72)",
              margin: 0,
            }}>
              {message}
            </p>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const TypingIndicator = ({ visible, color }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.3 }}
        style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 52 }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
            style={{
              width: 5, height: 5, borderRadius: "50%",
              background: color, opacity: 0.6,
            }}
          />
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

const RecruiterChat = ({ recruiterSimulation, phase }) => {
  const { personality } = usePersonality();
  const [revealed, setRevealed] = useState([]);
  const [typing, setTyping]     = useState(null);

  useEffect(() => {
    if (phase < 4 || !recruiterSimulation) return;
    setRevealed([]);

    PERSONAS.forEach((persona, i) => {
      // Show typing indicator
      setTimeout(() => setTyping(persona.key), persona.delay);
      // Show bubble 1.2s after typing starts
      setTimeout(() => {
        setTyping(null);
        setRevealed(prev => [...prev, persona.key]);
      }, persona.delay + 1200);
    });
  }, [phase, recruiterSimulation]);

  if (!recruiterSimulation) return null;

  const activeTyping = PERSONAS.find(p => p.key === typing);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={phase >= 4 ? { opacity: 1 } : {}}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10, fontWeight: 600, letterSpacing: "2.5px",
          textTransform: "uppercase", color: "rgba(255,255,255,0.22)",
        }}>
          Recruiter Simulation
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
        {/* Live indicator */}
        {phase >= 4 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: 5, height: 5, borderRadius: "50%",
                background: personality.accent,
              }}
            />
            <span style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 9, color: `rgba(${personality.accentRgb},0.5)`,
              letterSpacing: "1px",
            }}>
              LIVE
            </span>
          </div>
        )}
      </div>

      {/* Chat window */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 18, padding: "24px 20px",
        display: "flex", flexDirection: "column", gap: 24,
        minHeight: 200,
      }}>
        {PERSONAS.map(persona => (
          <div key={persona.key} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <ChatBubble
              persona={persona}
              message={recruiterSimulation[persona.key]}
              visible={revealed.includes(persona.key)}
            />
            {typing === persona.key && (
              <TypingIndicator visible={true} color={persona.color} />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecruiterChat;
