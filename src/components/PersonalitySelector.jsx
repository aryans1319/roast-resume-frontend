import { motion } from "framer-motion";
import { usePersonality, PERSONALITIES } from "../context/PersonalityContext";

export default function PersonalitySelector() {
  const { mode, setMode } = usePersonality();
  return (
    <div style={{ marginBottom:24 }}>
      <div className="label" style={{ textAlign:"center", marginBottom:12 }}>Roast Intensity</div>
      <div style={{ display:"flex", gap:6, padding:4, background:"var(--card)", border:"1px solid var(--line)", borderRadius:"var(--r3)" }}>
        {Object.values(PERSONALITIES).map(p => {
          const on = mode===p.key;
          return (
            <motion.button key={p.key} onClick={() => setMode(p.key)} whileTap={{ scale:0.96 }}
              style={{ flex:1, padding:"9px 8px", borderRadius:"var(--r2)", border:"none", cursor:"pointer",
                background: on ? "var(--card-2)" : "transparent",
                boxShadow: on ? `inset 0 0 0 1px var(--line-2)` : "none",
                transition:"all 0.15s ease",
                display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              }}>
              <span style={{ fontSize:16 }}>{p.emoji}</span>
              <span style={{ fontFamily:"var(--f-mono)", fontSize:10, fontWeight:600, letterSpacing:"0.5px",
                color: on ? "var(--amber)" : "var(--t3)", transition:"color 0.15s" }}>
                {p.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      <motion.p key={mode} initial={{ opacity:0, y:3 }} animate={{ opacity:1, y:0 }}
        style={{ fontFamily:"var(--f-mono)", fontSize:10, textAlign:"center", color:"var(--t3)", marginTop:8 }}>
        {PERSONALITIES[mode].tagline}
      </motion.p>
    </div>
  );
}