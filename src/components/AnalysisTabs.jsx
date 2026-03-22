import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const getColor = (s) => s>=75 ? "var(--green)" : s>=50 ? "var(--orange)" : "var(--red)";

// Parse feedback into structured bullet insights
function parseBullets(feedback, score) {
  if (!feedback) return [];
  const sentences = feedback.split(/\. /).filter(s => s.trim().length > 3).slice(0, 4);
  const isGood = score >= 75;
  return sentences.map((s, i) => ({
    icon: isGood ? "✔" : i === 0 ? "✔" : "✖",
    color: isGood ? "var(--green)" : i === 0 ? "var(--green)" : "var(--red)",
    text: s.trim().replace(/\.$/, ""),
  }));
}

function CategoryContent({ data, feedback, fixedExample }) {
  if (!data) return null;
  const color = getColor(data.score);
  const bullets = parseBullets(feedback, data.score);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Score + bar */}
      <div style={{ display:"flex", gap:14, alignItems:"center" }}>
        <div style={{ width:52, height:52, background: data.score>=75 ? "var(--green-dim)" : data.score>=50 ? "var(--orange-dim)" : "var(--red-dim)", border:`1px solid ${color}25`, borderRadius:"var(--r2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ fontFamily:"var(--f-mono)", fontSize:19, fontWeight:700, color }}>{data.score}</span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ height:3, background:"var(--line)", borderRadius:2, overflow:"hidden", marginBottom:6 }}>
            <motion.div initial={{ width:0 }} animate={{ width:`${data.score}%` }} transition={{ duration:0.7 }}
              style={{ height:"100%", background:color, borderRadius:2 }} />
          </div>
          <div className="label">Score {data.score}/100</div>
        </div>
      </div>

      {/* Bullet insights — NO paragraphs */}
      <div style={{ display:"flex", flexDirection:"column", gap:0, background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:"var(--r3)", overflow:"hidden" }}>
        {bullets.map((b, i) => (
          <div key={i} className="insight" style={{ padding:"10px 14px", borderBottom: i<bullets.length-1 ? "1px solid var(--line)" : "none" }}>
            <span className="insight-icon" style={{ color:b.color }}>{b.icon}</span>
            <span className="insight-text">{b.text}</span>
          </div>
        ))}
      </div>

      {/* Suggested fix */}
      {fixedExample && !fixedExample.toLowerCase().includes("n/a") && !fixedExample.toLowerCase().includes("already") && (
        <div style={{ padding:"11px 14px", background:"var(--amber-dim)", border:"1px solid var(--amber-line)", borderLeft:`2px solid var(--amber)`, borderRadius:"0 var(--r3) var(--r3) 0" }}>
          <div className="label" style={{ color:"var(--amber)", marginBottom:7 }}>✦ Suggested Rewrite</div>
          <p style={{ fontFamily:"var(--f-body)", fontSize:12.5, lineHeight:1.6, color:"var(--t2)" }}>{fixedExample}</p>
        </div>
      )}
    </div>
  );
}

function SectionsContent({ sections }) {
  return (
    <div>
      {sections?.map((s, i) => {
        const color = getColor(s.score);
        return (
          <div key={i} style={{ padding:"13px 0", borderBottom: i<sections.length-1 ? "1px solid var(--line)" : "none" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
              <span style={{ fontFamily:"var(--f-display)", fontSize:13, fontWeight:600, color:"var(--t1)" }}>{s.section}</span>
              <span style={{ fontFamily:"var(--f-mono)", fontSize:12, fontWeight:600, color }}>{s.score}</span>
            </div>
            <div style={{ height:2, background:"var(--line)", borderRadius:1, overflow:"hidden", marginBottom:8 }}>
              <motion.div initial={{ width:0 }} animate={{ width:`${s.score}%` }} transition={{ duration:0.7, delay:i*0.07 }}
                style={{ height:"100%", background:color, borderRadius:1 }} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {s.strength && s.strength!=="None." && s.strength!=="N/A" && (
                <div className="insight">
                  <span className="insight-icon" style={{ color:"var(--green)" }}>✔</span>
                  <span className="insight-text">{s.strength}</span>
                </div>
              )}
              {s.weakness && s.weakness!=="None." && s.weakness!=="N/A" && (
                <div className="insight">
                  <span className="insight-icon" style={{ color:"var(--red)" }}>✖</span>
                  <span className="insight-text">{s.weakness}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkillsContent({ missingSkills }) {
  const levels = ["HIGH","MEDIUM","LOW"];
  const colors = { HIGH:"var(--red)", MEDIUM:"var(--orange)", LOW:"var(--blue)" };
  const bgs    = { HIGH:"var(--red-dim)", MEDIUM:"var(--orange-dim)", LOW:"var(--blue-dim)" };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      {levels.map(lvl => {
        const skills = missingSkills?.filter(s => s.importance===lvl) || [];
        if (!skills.length) return null;
        return (
          <div key={lvl}>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:colors[lvl], display:"inline-block" }} />
              <span className="label" style={{ color:colors[lvl] }}>{lvl} PRIORITY</span>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {skills.map((item, i) => (
                <span key={i} style={{ fontFamily:"var(--f-mono)", fontSize:11.5, color:"var(--t2)", background:"var(--card-2)", border:"1px solid var(--line-2)", borderRadius:"var(--r)", padding:"5px 10px" }}>
                  {item.skill}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalysisTabs({ data }) {
  const [active, setActive] = useState("impact");

  const TABS = [
    { key:"impact",      label:"Impact",      score:data.impactScore?.score      },
    { key:"keywords",    label:"Keywords",    score:data.keywordMatch?.score     },
    { key:"credibility", label:"Credibility", score:data.credibilityCheck?.score },
    { key:"ats",         label:"ATS",         score:data.atsFriendliness?.score  },
    { key:"sections",    label:"Sections"                                        },
    { key:"skills",      label:"Skill Gaps"                                      },
  ];

  const content = {
    impact:      <CategoryContent data={data.impactScore}      feedback={data.impactScore?.feedback}      fixedExample={data.impactScore?.fixedExample} />,
    keywords:    <CategoryContent data={data.keywordMatch}     feedback={data.keywordMatch?.feedback}     fixedExample={data.keywordMatch?.fixedExample} />,
    credibility: <CategoryContent data={data.credibilityCheck} feedback={data.credibilityCheck?.feedback} fixedExample={data.credibilityCheck?.fixedExample} />,
    ats:         <CategoryContent data={data.atsFriendliness}  feedback={data.atsFriendliness?.feedback}  fixedExample={data.atsFriendliness?.fixedExample} />,
    sections:    <SectionsContent sections={data.sectionAnalysis} />,
    skills:      <SkillsContent missingSkills={data.missingSkills} />,
  };

  return (
    <div className="card" style={{ overflow:"hidden" }}>
      <div className="tab-bar">
        {TABS.map(tab => {
          const isActive = active===tab.key;
          const color = tab.score!==undefined ? getColor(tab.score) : null;
          return (
            <button key={tab.key} onClick={() => setActive(tab.key)}
              className={`tab-btn ${isActive ? "active" : ""}`}
            >
              {tab.label}
              {tab.score!==undefined && (
                <span style={{ fontFamily:"var(--f-mono)", fontSize:10, fontWeight:600, color: isActive ? color : "var(--t4)", background: isActive ? (tab.score>=75?"var(--green-dim)":tab.score>=50?"var(--orange-dim)":"var(--red-dim)") : "var(--card-2)", padding:"1px 6px", borderRadius:"var(--r)", transition:"all 0.15s" }}>
                  {tab.score}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div style={{ padding:"20px 22px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity:0, y:5 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.18 }}
          >
            {content[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}