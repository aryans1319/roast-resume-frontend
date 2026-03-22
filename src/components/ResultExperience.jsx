import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersonality } from "../context/PersonalityContext";
import { useRevealSequence } from "../hooks/useRevealSequence";
import ScoreReveal from "./ScoreReveal";
import IssueReveal from "./IssueReveal";
import BreakdownPanel from "./BreakdownPanel";
import RecruiterChat from "./RecruiterChat";
import ShareCard from "./ShareCard";
import useShareCard from "../hooks/useShareCard";

const PhaseIndicator = ({ phase, personality }) => {
  const steps = [
    "Score",
    "Verdict",
    "Issues",
    "Breakdown",
    "Simulation",
  ];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 4,
      justifyContent: "center", marginBottom: 40,
    }}>
      {steps.map((label, i) => {
        const done    = phase > i;
        const active  = phase === i;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "4px 10px",
              borderRadius: 99,
              background: active
                ? `rgba(${personality.accentRgb},0.15)`
                : done
                ? "rgba(255,255,255,0.04)"
                : "transparent",
              border: `1px solid ${active
                ? `rgba(${personality.accentRgb},0.4)`
                : done
                ? "rgba(255,255,255,0.1)"
                : "rgba(255,255,255,0.04)"}`,
              transition: "all 0.4s ease",
            }}>
              <span style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 9, fontWeight: 600, letterSpacing: "1px",
                textTransform: "uppercase",
                color: active
                  ? personality.accent
                  : done
                  ? "rgba(255,255,255,0.4)"
                  : "rgba(255,255,255,0.15)",
                transition: "color 0.4s ease",
              }}>
                {done ? "✓" : String(i + 1).padStart(2, "0")} {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 16, height: 1,
                background: done ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                transition: "background 0.4s ease",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const ResultExperience = ({ data, onReset }) => {
  const { personality }  = usePersonality();
  const phase            = useRevealSequence(true);
  const [downloading, setDownloading] = useState(false);
  const { cardRef, downloadCard }     = useShareCard();

  const handleDownload = async () => {
    setDownloading(true);
    await downloadCard();
    setDownloading(false);
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 80px" }}>

      {/* Off-screen share card */}
      <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -1 }}>
        <ShareCard ref={cardRef} data={data} />
      </div>

      {/* Progress indicator */}
      <div style={{ overflowX: "auto", paddingBottom: 4 }}>
        <PhaseIndicator phase={phase} personality={personality} />
      </div>

      {/* ── Phase 0+1: Score + one-liner ── */}
      <AnimatePresence>
        {phase >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ marginBottom: 48 }}
          >
            <ScoreReveal
              score={data.overallScore}
              shortlistProbability={data.shortlistProbability}
              savageOneLiner={data.savageOneLiner}
              phase={phase}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Phase 2: Issues ── */}
      <AnimatePresence>
        {phase >= 2 && data.topIssues?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: 48 }}
          >
            <IssueReveal issues={data.topIssues} phase={phase} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Phase 3: Breakdown ── */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: 48 }}
          >
            <BreakdownPanel data={data} phase={phase} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Phase 4: Recruiter simulation + share ── */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: 48 }}
          >
            <RecruiterChat recruiterSimulation={data.recruiterSimulation} phase={phase} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Share + reset (appear after phase 4) ── */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5, duration: 0.5 }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {/* Share button */}
            <motion.button
              onClick={handleDownload}
              disabled={downloading}
              whileHover={{ scale: 1.01, boxShadow: `0 0 40px rgba(${personality.accentRgb},0.35)` }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%", padding: "18px",
                borderRadius: 14, border: "none",
                cursor: downloading ? "not-allowed" : "pointer",
                background: downloading
                  ? "rgba(255,255,255,0.04)"
                  : `linear-gradient(135deg, ${personality.accent}dd, ${personality.accent})`,
                color: downloading ? "rgba(255,255,255,0.2)" : "#080B14",
                fontFamily: "Syne, sans-serif",
                fontSize: 15, fontWeight: 800,
                letterSpacing: "-0.2px",
                transition: "background 0.2s ease",
                boxShadow: `0 0 24px rgba(${personality.accentRgb},0.2)`,
              }}
            >
              {downloading ? "Generating..." : "⬇ Download Share Card"}
            </motion.button>

            {/* Reset */}
            <motion.button
              onClick={onReset}
              whileHover={{ background: "rgba(255,255,255,0.07)" }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%", padding: "16px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Syne, sans-serif",
                fontSize: 14, fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
            >
              Roast Another Resume 🔥
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultExperience;
