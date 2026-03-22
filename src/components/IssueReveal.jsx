import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersonality } from "../context/PersonalityContext";

const SEVERITY = {
  HIGH:   { color: "#FF3D3D", bg: "rgba(255,61,61,0.07)",   border: "rgba(255,61,61,0.2)",   pulse: true  },
  MEDIUM: { color: "#F59E0B", bg: "rgba(245,158,11,0.06)",  border: "rgba(245,158,11,0.18)", pulse: false },
  LOW:    { color: "#4D9EFF", bg: "rgba(77,158,255,0.06)",  border: "rgba(77,158,255,0.15)", pulse: false },
};

const SingleIssue = ({ issue, severity, explanation, index, visible }) => {
  const cfg = SEVERITY[severity] || SEVERITY.MEDIUM;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -24, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
            padding: "18px 20px",
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderLeft: `3px solid ${cfg.color}`,
            borderRadius: "0 14px 14px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* High severity pulse overlay */}
          {cfg.pulse && (
            <motion.div
              animate={{ opacity: [0, 0.08, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute", inset: 0,
                background: cfg.color,
                pointerEvents: "none",
              }}
            />
          )}

          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, position: "relative" }}>
            {/* Number */}
            <div style={{
              minWidth: 26, height: 26, borderRadius: "50%",
              background: `${cfg.color}18`,
              border: `1px solid ${cfg.color}35`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11, fontWeight: 700, color: cfg.color,
              flexShrink: 0, marginTop: 1,
            }}>
              {index + 1}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 14, fontWeight: 700,
                  color: "rgba(255,255,255,0.88)",
                }}>
                  {issue}
                </span>
                <span style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 9, fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: cfg.color,
                  background: `${cfg.color}15`,
                  border: `1px solid ${cfg.color}25`,
                  borderRadius: 99,
                  padding: "3px 8px",
                }}>
                  {severity}
                </span>
              </div>
              {explanation && (
                <p style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontSize: 12.5, lineHeight: 1.65,
                  color: "rgba(255,255,255,0.4)",
                  margin: 0,
                }}>
                  {explanation}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const IssueReveal = ({ issues, phase }) => {
  const { personality } = usePersonality();
  const [revealed, setRevealed] = useState([]);

  useEffect(() => {
    if (phase < 2 || !issues?.length) return;
    setRevealed([]);
    issues.forEach((_, i) => {
      setTimeout(() => {
        setRevealed(prev => [...prev, i]);
      }, i * 600);
    });
  }, [phase, issues]);

  if (!issues?.length) return null;

  return (
    <div>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 16,
        }}
      >
        <span style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10, fontWeight: 600,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
        }}>
          {personality.issueLabel}
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        {phase >= 2 && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 9, color: `rgba(${personality.accentRgb},0.5)`,
            }}
          >
            {revealed.length}/{issues.length} found
          </motion.span>
        )}
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {issues.map((item, i) => (
          <SingleIssue
            key={i}
            issue={item.issue}
            severity={item.severity}
            explanation={item.explanation}
            index={i}
            visible={revealed.includes(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default IssueReveal;
