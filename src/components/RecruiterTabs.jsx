import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PERSONAS = [
  { key:"hr",            label:"HR Screener",    icon:"👩‍💼", color:"var(--green)"  },
  { key:"hiringManager", label:"Hiring Manager", icon:"👨‍💻", color:"var(--amber)"  },
  { key:"ats",           label:"ATS System",     icon:"🤖", color:"var(--blue)"   },
];

export default function RecruiterTabs({ recruiterSimulation }) {
  const [active, setActive]   = useState("hr");
  const [typing, setTyping]   = useState(true);
  const [msgKey, setMsgKey]   = useState(0);

  useEffect(() => {
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 700);
    return () => clearTimeout(t);
  }, [active]);

  if (!recruiterSimulation) return null;

  const persona = PERSONAS.find(p => p.key===active);
  const msg     = recruiterSimulation[active];

  return (
    <div className="card" style={{ overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"14px 20px", borderBottom:"1px solid var(--line)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span className="label">Recruiter Simulation</span>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <motion.div animate={{ opacity:[1,0.2,1] }} transition={{ duration:2, repeat:Infinity }}
            style={{ width:5, height:5, borderRadius:"50%", background:"var(--green)" }} />
          <span className="label" style={{ color:"var(--green)" }}>Live</span>
        </div>
      </div>

      {/* Persona tabs */}
      <div className="tab-bar">
        {PERSONAS.map(p => (
          <button key={p.key} onClick={() => { setActive(p.key); setMsgKey(k=>k+1); }}
            className={`tab-btn ${active===p.key ? "active" : ""}`}
            style={{ borderBottomColor: active===p.key ? p.color : "transparent" }}
          >
            <span style={{ fontSize:15 }}>{p.icon}</span>
            <span style={{ color: active===p.key ? "var(--t1)" : "var(--t3)" }}>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Message */}
      <div style={{ padding:"20px", minHeight:120 }}>
        <AnimatePresence mode="wait">
          {typing ? (
            <motion.div key="typing" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--card-2)", border:"1px solid var(--line)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>
                {persona.icon}
              </div>
              <div style={{ display:"flex", gap:4, padding:"9px 13px", background:"var(--card-2)", border:"1px solid var(--line)", borderRadius:"2px 10px 10px 10px" }}>
                {[0,1,2].map(i => (
                  <motion.div key={i} animate={{ y:[0,-3,0] }} transition={{ duration:0.5, delay:i*0.12, repeat:Infinity }}
                    style={{ width:4, height:4, borderRadius:"50%", background:persona.color, opacity:0.7 }} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key={`m-${msgKey}`} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.25 }}
              style={{ display:"flex", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--card-2)", border:`1px solid ${persona.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginTop:2 }}>
                {persona.icon}
              </div>
              <div>
                <p style={{ fontFamily:"var(--f-mono)", fontSize:11, fontWeight:600, color:persona.color, marginBottom:8 }}>
                  {persona.label}
                </p>
                <div style={{ padding:"12px 14px", background:"var(--card-2)", border:`1px solid ${persona.color}15`, borderRadius:"2px 10px 10px 10px" }}>
                  <p style={{ fontFamily:"var(--f-body)", fontSize:13, lineHeight:1.65, color:"var(--t2)" }}>{msg}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}