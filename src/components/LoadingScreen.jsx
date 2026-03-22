import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { text: "Parsing document structure",      emoji: "📄", sub: "Reading PDF layers and text blocks"        },
  { text: "Extracting work experience",       emoji: "💼", sub: "Mapping roles, tenure, responsibilities"   },
  { text: "Mapping skills to job description",emoji: "🔍", sub: "Keyword alignment and gap analysis"        },
  { text: "Evaluating impact statements",     emoji: "📊", sub: "Checking for metrics and quantification"   },
  { text: "Running ATS compatibility scan",   emoji: "🤖", sub: "Simulating applicant tracking systems"     },
  { text: "Detecting skill gaps",             emoji: "⚠️", sub: "Finding what the JD demands but you lack" },
  { text: "Comparing with top candidates",    emoji: "🏆", sub: "Benchmarking against strong applicants"   },
  { text: "Simulating recruiter reactions",   emoji: "👥", sub: "HR, hiring manager, and ATS perspectives" },
  { text: "Compiling verdict",                emoji: "🔥", sub: "Generating your full roast report"        },
];

export default function LoadingScreen() {
  const [step,  setStep]  = useState(0);
  const [chars, setChars] = useState(0);
  const [pct,   setPct]   = useState(0);
  const [done,  setDone]  = useState([]);

  // Advance steps
  useEffect(() => {
    if (step >= STEPS.length - 1) return;
    const t = setTimeout(() => {
      setDone(d => [...d, step]);
      setStep(s => s + 1);
      setChars(0);
    }, 2800);
    return () => clearTimeout(t);
  }, [step]);

  // Typewriter
  useEffect(() => {
    if (chars >= STEPS[step].text.length) return;
    const t = setTimeout(() => setChars(c => c + 1), 28);
    return () => clearTimeout(t);
  }, [step, chars]);

  // Progress
  useEffect(() => {
    const target = Math.round(((step + 1) / STEPS.length) * 96);
    const t = setInterval(() => setPct(p => { if (p >= target) { clearInterval(t); return p; } return p + 1; }), 30);
    return () => clearInterval(t);
  }, [step]);

  const current = STEPS[step];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "var(--bg)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>

      {/* Subtle grid background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(245,166,35,0.03) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {/* Center orb — animated, reacts to step */}
      <div style={{ position: "relative", marginBottom: 48 }}>
        {/* Outer ring — slow pulse */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.05, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: -28,
            borderRadius: "50%",
            border: "1px solid var(--a)",
          }}
        />
        {/* Middle ring */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.08, 0.25] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          style={{
            position: "absolute", inset: -16,
            borderRadius: "50%",
            border: "1px solid var(--a)",
          }}
        />
        {/* Main orb */}
        <motion.div
          style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "var(--s2)",
            border: "1px solid rgba(245,166,35,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}
        >
          {/* SVG spinner around orb */}
          <svg
            width={80} height={80}
            style={{ position: "absolute", inset: 0, animation: "spin 3s linear infinite" }}
          >
            <circle cx={40} cy={40} r={36} fill="none" stroke="var(--t4)" strokeWidth={1.5} strokeDasharray="4 8" />
          </svg>
          <svg
            width={80} height={80}
            style={{ position: "absolute", inset: 0, animation: "spin 2s linear infinite reverse" }}
          >
            <circle cx={40} cy={40} r={28} fill="none" stroke="rgba(245,166,35,0.2)" strokeWidth={1} strokeDasharray="3 12" />
          </svg>

          {/* Step emoji — animates on change */}
          <AnimatePresence mode="wait">
            <motion.span
              key={step}
              initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
              animate={{ scale: 1,   opacity: 1, rotate: 0   }}
              exit={{    scale: 0.4, opacity: 0, rotate: 20  }}
              transition={{ duration: 0.35, ease: [0.34, 1.4, 0.64, 1] }}
              style={{ fontSize: 28, position: "relative", zIndex: 1 }}
            >
              {current.emoji}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Step text */}
      <div style={{ textAlign: "center", marginBottom: 10, minHeight: 32 }}>
        <div style={{
          fontFamily: "var(--f1)", fontSize: 17, fontWeight: 700,
          color: "var(--t1)", letterSpacing: "-0.3px",
        }}>
          {STEPS[step].text.slice(0, chars)}
          <span style={{
            display: "inline-block", width: 2, height: "0.85em",
            background: "var(--a)", marginLeft: 2,
            verticalAlign: "text-bottom",
            animation: "blink 0.7s step-end infinite",
          }} />
        </div>
      </div>

      {/* Sub-label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "var(--f2)", fontSize: 11,
            color: "var(--t3)", marginBottom: 36,
            letterSpacing: "0.2px",
          }}
        >
          {current.sub}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div style={{ width: 260, marginBottom: 16 }}>
        <div style={{
          height: 2, background: "var(--t4)",
          borderRadius: 1, overflow: "hidden", marginBottom: 8,
        }}>
          <motion.div
            style={{ height: "100%", background: "var(--a)", borderRadius: 1 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.03 }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="ol">{step + 1} / {STEPS.length} steps</span>
          <span style={{ fontFamily: "var(--f2)", fontSize: 10, fontWeight: 600, color: "var(--a)" }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Completed steps list — scroll up as steps finish */}
      <div style={{
        width: 260, maxHeight: 80,
        overflow: "hidden",
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        <AnimatePresence>
          {done.slice(-3).map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <span style={{ color: "var(--ok)", fontSize: 10, flexShrink: 0 }}>✔</span>
              <span style={{
                fontFamily: "var(--f2)", fontSize: 10,
                color: "var(--t3)",
              }}>
                {STEPS[i].text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
