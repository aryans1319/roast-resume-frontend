import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePersonality } from "../context/PersonalityContext";
import TypewriterText from "./TypewriterText";

const useCounter = (target, duration = 1600, active = true) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, duration, active]);
  return value;
};

const ScoreReveal = ({ score, shortlistProbability, savageOneLiner, phase }) => {
  const { personality } = usePersonality();
  const [ringVisible, setRingVisible] = useState(false);
  const animated = useCounter(score, 1600, ringVisible);

  const SIZE = 240, cx = 120, cy = 120, R = 98;
  const CIRC = 2 * Math.PI * R;
  const progress = ringVisible ? (score / 100) * CIRC : 0;

  useEffect(() => {
    if (phase >= 0) {
      const t = setTimeout(() => setRingVisible(true), 300);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const accent = personality.accent;
  const accentRgb = personality.accentRgb;

  return (
    <div style={{ textAlign: "center", position: "relative" }}>

      {/* Background bloom */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={ringVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400, height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${accentRgb},0.12) 0%, transparent 65%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Verdict label */}
      <motion.div
        initial={{ opacity: 0, letterSpacing: "8px" }}
        animate={phase >= 0 ? { opacity: 1, letterSpacing: "3px" } : {}}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 11, fontWeight: 600,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: `rgba(${accentRgb},0.6)`,
          marginBottom: 24,
          position: "relative", zIndex: 1,
        }}
      >
        {personality.verdictLabel} {personality.scoreLabel}
      </motion.div>

      {/* SVG score ring */}
      <div style={{ position: "relative", display: "inline-block", zIndex: 1 }}>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={ringVisible ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <svg width={SIZE} height={SIZE}>
            <defs>
              <filter id="ringGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={accent} stopOpacity="0.6" />
                <stop offset="100%" stopColor={accent} stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Track */}
            <circle cx={cx} cy={cy} r={R}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={8}
            />

            {/* Tick marks */}
            {[...Array(20)].map((_, i) => {
              const angle = (i / 20) * 2 * Math.PI - Math.PI / 2;
              const inner = R - 14, outer = R - 8;
              return (
                <line key={i}
                  x1={cx + inner * Math.cos(angle)}
                  y1={cy + inner * Math.sin(angle)}
                  x2={cx + outer * Math.cos(angle)}
                  y2={cy + outer * Math.sin(angle)}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={1}
                />
              );
            })}

            {/* Progress arc */}
            <circle cx={cx} cy={cy} r={R}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={`${progress} ${CIRC}`}
              transform={`rotate(-90 ${cx} ${cy})`}
              filter="url(#ringGlow)"
              style={{ transition: "stroke-dasharray 1.6s cubic-bezier(0.4,0,0.2,1)" }}
            />

            {/* Score number */}
            <text x={cx} y={cy - 12}
              textAnchor="middle" dominantBaseline="middle"
              fill={accent}
              fontSize="64" fontWeight="800"
              fontFamily="Syne, sans-serif"
            >
              {animated}
            </text>
            <text x={cx} y={cy + 28}
              textAnchor="middle" dominantBaseline="middle"
              fill="rgba(255,255,255,0.2)"
              fontSize="11"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="2"
            >
              OUT OF 100
            </text>
          </svg>
        </motion.div>

        {/* Pulse ring */}
        {ringVisible && (
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.3, 0.08, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: -16,
              borderRadius: "50%",
              border: `1px solid ${accent}`,
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* Shortlist probability */}
      {phase >= 0 && shortlistProbability !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          style={{ marginTop: 24, marginBottom: 0, position: "relative", zIndex: 1 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            padding: "10px 20px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 99,
          }}>
            <span style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10, letterSpacing: "1.5px",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
            }}>
              Shortlist Probability
            </span>
            <span style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 18, fontWeight: 800,
              color: accent,
            }}>
              {shortlistProbability}%
            </span>
          </div>
        </motion.div>
      )}

      {/* Savage one-liner — phase 1 */}
      {phase >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            marginTop: 28,
            padding: "20px 24px",
            background: `rgba(${accentRgb},0.04)`,
            border: `1px solid rgba(${accentRgb},0.15)`,
            borderLeft: `3px solid ${accent}`,
            borderRadius: "0 12px 12px 0",
            textAlign: "left",
            position: "relative", zIndex: 1,
          }}
        >
          <span style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 9, letterSpacing: "2px",
            textTransform: "uppercase",
            color: `rgba(${accentRgb},0.5)`,
            display: "block", marginBottom: 10,
          }}>
            {personality.verdictLabel}
          </span>
          <TypewriterText
            text={`"${savageOneLiner}"`}
            speed={28}
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 16,
              fontStyle: "italic",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.75)",
              fontWeight: 600,
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ScoreReveal;
