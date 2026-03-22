import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AVG = 61;

const cfg = (s) => s >= 90
  ? { label:"Interview Ready", color:"var(--green)",  dim:"var(--green-dim)"  }
  : s >= 75
  ? { label:"Strong Profile",  color:"var(--amber)",  dim:"var(--amber-dim)"  }
  : s >= 60
  ? { label:"Needs Work",      color:"var(--orange)", dim:"var(--orange-dim)" }
  : { label:"High Risk",       color:"var(--red)",    dim:"var(--red-dim)"    };

const useCount = (target, run) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let s = null;
    const step = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts-s)/900,1);
      setV(Math.round((1-Math.pow(1-p,3))*target));
      if (p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, run]);
  return v;
};

export default function ScorePanel({ score, shortlistProbability, savageOneLiner, confidenceScore }) {
  const [run, setRun] = useState(false);
  const count = useCount(score, run);
  const c = cfg(score);
  const delta = score - AVG;

  useEffect(() => { const t = setTimeout(() => setRun(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div className="card" style={{ padding:"28px 24px", display:"flex", flexDirection:"column", gap:22, height:"100%" }}>

      {/* Header row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span className="label">Resume Score</span>
        {confidenceScore && <span className="label">{Math.round(confidenceScore*100)}% conf.</span>}
      </div>

      {/* HERO SCORE */}
      <div style={{ display:"flex", alignItems:"flex-end", gap:14, borderBottom:"1px solid var(--line)", paddingBottom:20 }}>
        <motion.div
          initial={{ opacity:0, y:12 }}
          animate={run ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.4, ease:[0.34,1.2,0.64,1] }}
          style={{ fontFamily:"var(--f-display)", fontSize:88, fontWeight:800, lineHeight:1, color:c.color, letterSpacing:"-4px" }}
        >
          {count}
        </motion.div>
        <div style={{ paddingBottom:8 }}>
          <div style={{ fontFamily:"var(--f-mono)", fontSize:12, color:"var(--t3)", marginBottom:8 }}>/100</div>
          <motion.div
            initial={{ opacity:0, x:-6 }}
            animate={run ? { opacity:1, x:0 } : {}}
            transition={{ delay:0.3, duration:0.25 }}
            style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 10px", background:c.dim, border:`1px solid ${c.color}30`, borderRadius:"var(--r)" }}
          >
            <span style={{ fontFamily:"var(--f-mono)", fontSize:10, fontWeight:600, color:c.color, letterSpacing:"0.5px" }}>
              {c.label}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Score bar */}
      <div>
        <div style={{ height:3, background:"var(--line)", borderRadius:2, overflow:"hidden", marginBottom:5 }}>
          <motion.div initial={{ width:0 }} animate={run ? { width:`${score}%` } : {}}
            transition={{ duration:1, ease:[0.4,0,0.2,1], delay:0.15 }}
            style={{ height:"100%", background:c.color, borderRadius:2 }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontFamily:"var(--f-mono)", fontSize:9, color:"var(--t4)" }}>0</span>
          <span style={{ fontFamily:"var(--f-mono)", fontSize:9, color:"var(--t4)" }}>100</span>
        </div>
      </div>

      {/* YOU vs TOP CANDIDATE */}
      <div style={{ background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:"var(--r3)", padding:"14px 16px" }}>
        <div className="label" style={{ marginBottom:14 }}>You vs Top Candidate</div>

        {[{ label:"You", val:score, color:c.color }, { label:"Top 10%", val:88, color:"var(--t4)" }, { label:"Avg. Applicant", val:AVG, color:"var(--t4)" }].map(row => (
          <div key={row.label} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontFamily:"var(--f-body)", fontSize:12, color: row.label==="You" ? "var(--t1)" : "var(--t3)", fontWeight: row.label==="You" ? 600 : 400 }}>{row.label}</span>
              <span style={{ fontFamily:"var(--f-mono)", fontSize:12, fontWeight:600, color:row.color }}>{row.val}</span>
            </div>
            <div style={{ height:3, background:"var(--line)", borderRadius:2, overflow:"hidden" }}>
              <motion.div initial={{ width:0 }} animate={run ? { width:`${row.val}%` } : {}}
                transition={{ duration:0.9, delay: row.label==="You" ? 0.4 : row.label==="Top 10%" ? 0.55 : 0.7 }}
                style={{ height:"100%", background:row.color, borderRadius:2 }} />
            </div>
          </div>
        ))}

        <motion.div initial={{ opacity:0 }} animate={run ? { opacity:1 } : {}} transition={{ delay:1, duration:0.3 }}
          style={{ marginTop:10, padding:"6px 10px", background: delta>0 ? "var(--green-dim)" : "var(--red-dim)", border:`1px solid ${delta>0 ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`, borderRadius:"var(--r)", textAlign:"center" }}>
          <span style={{ fontFamily:"var(--f-mono)", fontSize:11, fontWeight:600, color: delta>0 ? "var(--green)" : "var(--red)" }}>
            {delta>0 ? `↑ ${delta} pts above average` : `↓ ${Math.abs(delta)} pts below average`}
          </span>
        </motion.div>
      </div>

      {/* Shortlist probability */}
      {shortlistProbability!==undefined && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:4, borderTop:"1px solid var(--line)" }}>
          <span style={{ fontFamily:"var(--f-body)", fontSize:12, color:"var(--t3)" }}>Shortlist probability</span>
          <span style={{ fontFamily:"var(--f-mono)", fontSize:15, fontWeight:600, color:c.color }}>{shortlistProbability}%</span>
        </div>
      )}

      {/* Verdict */}
      <div style={{ borderLeft:`2px solid ${c.color}`, paddingLeft:14 }}>
        <div className="label" style={{ marginBottom:7 }}>Verdict</div>
        <p style={{ fontFamily:"var(--f-body)", fontSize:13, fontStyle:"italic", lineHeight:1.65, color:"var(--t2)" }}>
          "{savageOneLiner}"
        </p>
      </div>
    </div>
  );
}