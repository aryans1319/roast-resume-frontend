import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MODES = [
  {
    key: "savage",
    emoji: "😈",
    label: "Savage",
    tagline: "No mercy. Full damage.",
    accent: "var(--er)",
    accentDim: "var(--er-d)",
    accentEdge: "rgba(248,113,113,0.22)",
    btnText: "😈 Roast Me Mercilessly",
  },
  {
    key: "balanced",
    emoji: "😌",
    label: "Balanced",
    tagline: "Honest. Constructive.",
    accent: "var(--a)",
    accentDim: "var(--a-dim)",
    accentEdge: "var(--a-e)",
    btnText: "🔥 Roast My Resume",
  },
  {
    key: "professional",
    emoji: "🧠",
    label: "Professional",
    tagline: "Structured. Actionable.",
    accent: "var(--in)",
    accentDim: "var(--in-d)",
    accentEdge: "rgba(96,165,250,0.22)",
    btnText: "🧠 Analyze My Resume",
  },
];

export default function UploadForm({ onSubmit, isLoading }) {
  const [file,   setFile]   = useState(null);
  const [jd,     setJd]     = useState("");
  const [drag,   setDrag]   = useState(false);
  const [mode,   setMode]   = useState("balanced");
  const can = file && jd.trim() && !isLoading;
  const m = MODES.find(x => x.key === mode);

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ maxWidth: 520, margin: "0 auto", padding: "0 24px" }}
    >

      {/* ── Personality selector ─────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div className="ol" style={{ textAlign: "center", marginBottom: 14 }}>Roast Intensity</div>

        <div style={{
          display: "flex", gap: 8, padding: 4,
          background: "var(--s1)",
          border: "1px solid var(--rl2)",
          borderRadius: "var(--rl3)",
        }}>
          {MODES.map(p => {
            const on = mode === p.key;
            return (
              <motion.button
                key={p.key}
                onClick={() => setMode(p.key)}
                whileTap={{ scale: 0.96 }}
                style={{
                  flex: 1, padding: "12px 8px",
                  borderRadius: "var(--rm)",
                  border: "none", cursor: "pointer",
                  background: on ? p.accentDim : "transparent",
                  boxShadow: on ? `inset 0 0 0 1px ${p.accentEdge}` : "none",
                  transition: "all 0.18s ease",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 5,
                }}
              >
                <motion.span
                  animate={{ scale: on ? 1.15 : 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 22 }}
                >
                  {p.emoji}
                </motion.span>
                <span style={{
                  fontFamily: "var(--f1)", fontSize: 12, fontWeight: on ? 700 : 400,
                  color: on ? p.accent : "var(--t3)",
                  transition: "color 0.18s",
                }}>
                  {p.label}
                </span>
                <span style={{
                  fontFamily: "var(--f2)", fontSize: 9.5,
                  color: on ? p.accent : "var(--t4)",
                  opacity: on ? 0.8 : 0.5,
                  letterSpacing: "0.3px",
                  transition: "color 0.18s",
                }}>
                  {p.tagline}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Drop zone ────────────────────────────── */}
      <div
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onClick={() => document.getElementById("rf").click()}
        style={{
          borderRadius: "var(--rl3)", padding: "40px 24px",
          textAlign: "center", cursor: "pointer",
          background: drag ? "rgba(245,166,35,0.05)" : file ? "var(--s2)" : "var(--s1)",
          border: `1px dashed ${drag ? m.accent : file ? "rgba(74,222,128,0.35)" : "var(--rl2)"}`,
          transition: "all 0.15s", marginBottom: 12,
        }}
      >
        <input id="rf" type="file" accept="application/pdf" style={{ display: "none" }}
          onChange={e => setFile(e.target.files[0])} />
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div key="f" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>📄</div>
              <p style={{ fontFamily: "var(--f1)", fontSize: 13, fontWeight: 600, color: "var(--ok)", marginBottom: 4 }}>
                {file.name}
              </p>
              <p className="ol">Click to replace</p>
            </motion.div>
          ) : (
            <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ fontSize: 26, marginBottom: 12, opacity: 0.4 }}>📄</div>
              <p style={{ fontFamily: "var(--f1)", fontSize: 14, fontWeight: 500, color: "var(--t2)", marginBottom: 5 }}>
                Drop your resume
              </p>
              <p className="ol">PDF only · max 5MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Job description ──────────────────────── */}
      <div style={{ marginBottom: 12 }}>
        <div className="ol" style={{ marginBottom: 8 }}>Job Description</div>
        <textarea
          rows={6}
          placeholder="Paste the full job description here..."
          value={jd}
          onChange={e => setJd(e.target.value)}
          style={{
            width: "100%", background: "var(--s1)",
            border: "1px solid var(--rl2)", borderRadius: "var(--rl3)",
            padding: "13px 14px", color: "var(--t1)",
            resize: "none", outline: "none",
            fontSize: 13, lineHeight: 1.6,
            transition: "border-color 0.15s",
          }}
          onFocus={e => e.target.style.borderColor = m.accentEdge}
          onBlur={e => e.target.style.borderColor = "var(--rl2)"}
        />
      </div>

      {/* ── Submit ───────────────────────────────── */}
      <motion.button
        onClick={() => can && onSubmit(file, jd)}
        disabled={!can}
        whileHover={can ? { opacity: 0.88 } : {}}
        whileTap={can ? { scale: 0.998 } : {}}
        style={{
          width: "100%", padding: "15px",
          borderRadius: "var(--rl3)", border: "none",
          cursor: can ? "pointer" : "not-allowed",
          fontFamily: "var(--f1)", fontSize: 14, fontWeight: 700,
          transition: "all 0.18s",
          background: can ? m.accent : "var(--s2)",
          color: can ? "#0F1115" : "var(--t4)",
          boxShadow: can ? `0 0 32px ${m.accentDim}` : "none",
        }}
      >
        {isLoading ? "Analyzing..." : m.btnText}
      </motion.button>

      <p className="ol" style={{ textAlign: "center", marginTop: 12 }}>
        5 free roasts per hour · no account required
      </p>
    </motion.div>
  );
}
