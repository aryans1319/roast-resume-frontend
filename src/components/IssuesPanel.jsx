import { motion } from "framer-motion";

const SEV = {
  HIGH:   { cls:"badge-high",   color:"var(--red)",    bg:"var(--red-dim)",    border:"rgba(248,113,113,0.18)", icon:"🔴" },
  MEDIUM: { cls:"badge-medium", color:"var(--orange)", bg:"var(--orange-dim)", border:"rgba(251,146,60,0.18)",  icon:"🟠" },
  LOW:    { cls:"badge-low",    color:"var(--blue)",   bg:"var(--blue-dim)",   border:"rgba(96,165,250,0.18)",  icon:"🔵" },
};

const skillColor = { HIGH:"var(--red)", MEDIUM:"var(--orange)", LOW:"var(--blue)" };

export default function IssuesPanel({ topIssues, missingSkills }) {
  const issues = topIssues?.slice(0, 3) || [];

  return (
    <div className="card" style={{ padding:"28px 24px", height:"100%", display:"flex", flexDirection:"column", gap:20 }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span className="label">Priority Issues</span>
        <span className="label">{issues.filter(i => i.severity==="HIGH").length} critical</span>
      </div>

      {/* Issues */}
      <div style={{ display:"flex", flexDirection:"column", gap:8, flex:1 }}>
        {issues.map((item, i) => {
          const s = SEV[item.severity] || SEV.MEDIUM;
          const oneLiner = item.explanation?.split(".")[0] || "";
          return (
            <motion.div key={i}
              initial={{ opacity:0, x:8 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:i*0.09+0.15, duration:0.28 }}
              style={{ padding:"13px 14px", background:s.bg, border:`1px solid ${s.border}`, borderLeft:`2px solid ${s.color}`, borderRadius:"0 var(--r3) var(--r3) 0" }}
            >
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontFamily:"var(--f-mono)", fontSize:11, fontWeight:700, color:s.color, flexShrink:0, marginTop:1 }}>
                  {String(i+1).padStart(2,"0")}
                </span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"var(--f-display)", fontSize:13, fontWeight:600, color:"var(--t1)" }}>
                      {item.issue}
                    </span>
                    <span className={`badge ${s.cls}`}>{item.severity}</span>
                  </div>
                  {oneLiner && (
                    <p style={{ fontFamily:"var(--f-body)", fontSize:12, color:"var(--t3)", lineHeight:1.5 }}>
                      → {oneLiner}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Missing skills */}
      {missingSkills?.length > 0 && (
        <div style={{ paddingTop:16, borderTop:"1px solid var(--line)" }}>
          <div className="label" style={{ marginBottom:10 }}>Skill Gaps</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {missingSkills.slice(0, 7).map((item, i) => (
              <span key={i} style={{ fontFamily:"var(--f-mono)", fontSize:11, color:"var(--t2)", background:"var(--card-2)", border:"1px solid var(--line)", borderRadius:"var(--r)", padding:"4px 9px", display:"inline-flex", alignItems:"center", gap:5 }}>
                <span style={{ width:4, height:4, borderRadius:"50%", background:skillColor[item.importance]||"var(--t3)", flexShrink:0 }} />
                {item.skill}
              </span>
            ))}
            {missingSkills.length > 7 && (
              <span style={{ fontFamily:"var(--f-mono)", fontSize:11, color:"var(--t3)", background:"var(--card-2)", border:"1px solid var(--line)", borderRadius:"var(--r)", padding:"4px 9px" }}>
                +{missingSkills.length-7}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}