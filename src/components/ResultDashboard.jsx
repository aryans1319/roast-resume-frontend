import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShareCard from "./ShareCard";
import useShareCard from "../hooks/useShareCard";

// ─── Constants ──────────────────────────────────
const AVG = 62;
const TOP = 88;

// ─── Helpers ────────────────────────────────────
const sc = (s) => s >= 75 ? "var(--ok)" : s >= 50 ? "var(--wa)" : "var(--er)";
const scHex = (s) => s >= 75 ? "#4ADE80" : s >= 50 ? "#FB923C" : "#F87171";

const useCount = (n, run) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let s = null;
    const f = ts => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 900, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * n));
      if (p < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }, [n, run]);
  return v;
};

// ─── Animated bar ───────────────────────────────
const Bar = ({ val, color, delay = 0, h = 3 }) => {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(val), 80 + delay);
    return () => clearTimeout(t);
  }, [val, delay]);
  return (
    <div style={{ height: h, background: "var(--t4)", borderRadius: 1, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 1, transition: `width 0.9s cubic-bezier(0.4,0,0.2,1) ${delay}ms` }} />
    </div>
  );
};

// ─── Category summary bar (top) ─────────────────
const SummaryBar = ({ data }) => {
  const cats = [
    { label: "Impact",      score: data.impactScore?.score },
    { label: "Keywords",    score: data.keywordMatch?.score },
    { label: "Credibility", score: data.credibilityCheck?.score },
    { label: "ATS",         score: data.atsFriendliness?.score },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      style={{
        display: "flex", gap: 0,
        background: "var(--s1)",
        border: "1px solid var(--rl2)",
        borderRadius: "var(--rl3)",
        overflow: "hidden",
        marginBottom: 36,
      }}
    >
      {cats.map((cat, i) => {
        const color = scHex(cat.score);
        return (
          <div key={cat.label} style={{
            flex: 1, padding: "14px 16px",
            borderRight: i < cats.length - 1 ? "1px solid var(--rl)" : "none",
            position: "relative", overflow: "hidden",
          }}>
            {/* Score accent bar at top */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color, opacity: 0.6 }} />
            <div className="ol" style={{ marginBottom: 6 }}>{cat.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontFamily: "var(--f1)", fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>
                {cat.score}
              </span>
              <span style={{ fontFamily: "var(--f2)", fontSize: 10, color: "var(--t4)" }}>/100</span>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

// ─── Score label ────────────────────────────────
const ScoreLabel = ({ score }) => {
  const [label, color] = score >= 88 ? ["Interview Ready", "#4ADE80"]
    : score >= 75 ? ["Strong Profile", "#4ADE80"]
    : score >= 60 ? ["Needs Work", "#FB923C"]
    : ["High Risk", "#F87171"];
  return (
    <span style={{
      fontFamily: "var(--f2)", fontSize: 10, fontWeight: 600,
      color, background: `${color}18`,
      border: `1px solid ${color}28`,
      borderRadius: "var(--r)", padding: "3px 9px", letterSpacing: "0.5px",
    }}>
      {label}
    </span>
  );
};

// ─── Issue row ──────────────────────────────────
const Issue = ({ item, idx }) => {
  const cfgMap = {
    HIGH:   ["#F87171", "rgba(248,113,113,0.06)", "ch"],
    MEDIUM: ["#FB923C", "rgba(251,146,60,0.06)",  "cm"],
    LOW:    ["#60A5FA", "rgba(96,165,250,0.06)",   "cl"],
  };
  const [color, bg, chip] = cfgMap[item.severity] || cfgMap.MEDIUM;
  const short = item.explanation?.split(".")[0] || "";

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1 + 0.2, duration: 0.3 }}
      style={{
        borderLeft: `3px solid ${color}`,
        background: bg, borderRadius: "0 var(--rm) var(--rm) 0",
        marginBottom: 10, overflow: "hidden",
      }}
    >
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--f2)", fontSize: 11, fontWeight: 700, color, minWidth: 24 }}>
            {String(idx + 1).padStart(2, "0")}
          </span>
          <span style={{ fontFamily: "var(--f1)", fontSize: 13.5, fontWeight: 700, color: "var(--t1)", flex: 1 }}>
            {item.issue}
          </span>
          <span className={`chip ${chip}`}>{item.severity}</span>
        </div>
        {short && (
          <p style={{ fontFamily: "var(--f1)", fontSize: 12, color: "var(--t3)", lineHeight: 1.5, paddingLeft: 33 }}>
            → {short}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ─── Insight bullet ─────────────────────────────
const Insight = ({ icon, color, text }) => (
  <div style={{ display: "flex", gap: 9, padding: "9px 0", borderBottom: "1px solid var(--rl)", alignItems: "flex-start" }}>
    <span style={{ flexShrink: 0, width: 14, textAlign: "center", fontSize: 11, color, marginTop: 2 }}>{icon}</span>
    <span style={{ fontFamily: "var(--f1)", fontSize: 13, lineHeight: 1.5, color: "var(--t2)" }}>{text}</span>
  </div>
);

const parseBullets = (feedback, score) => {
  if (!feedback) return [];
  return feedback.split(/\. /).filter(s => s.trim().length > 4).slice(0, 4).map((s, i) => ({
    icon: score >= 75 ? "✔" : i === 0 ? "✔" : "✖",
    color: score >= 75 ? "var(--ok)" : i === 0 ? "var(--ok)" : "var(--er)",
    text: s.trim().replace(/\.$/, ""),
  }));
};

// ─── Analysis tabs ──────────────────────────────
const CategoryView = ({ data, feedback, fixedExample }) => {
  const color = sc(data?.score);
  const bullets = parseBullets(feedback, data?.score);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ width: 54, height: 54, background: `${scHex(data?.score)}10`, border: `1px solid ${scHex(data?.score)}20`, borderRadius: "var(--rm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--f2)", fontSize: 20, fontWeight: 700, color }}>{data?.score}</span>
        </div>
        <div style={{ flex: 1 }}>
          <Bar val={data?.score} color={scHex(data?.score)} h={3} />
          <div className="ol" style={{ marginTop: 5 }}>Score {data?.score}/100</div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--rl)", paddingTop: 12 }}>
        {bullets.map((b, i) => <Insight key={i} {...b} />)}
      </div>
      {fixedExample && !fixedExample.toLowerCase().includes("n/a") && !fixedExample.toLowerCase().includes("already") && (
        <div style={{ borderLeft: "2px solid var(--a)", paddingLeft: 14 }}>
          <div className="ol" style={{ color: "var(--a)", marginBottom: 7 }}>Suggested Rewrite</div>
          <p style={{ fontFamily: "var(--f1)", fontSize: 12.5, lineHeight: 1.65, color: "var(--t2)" }}>{fixedExample}</p>
        </div>
      )}
    </div>
  );
};

const SectionsView = ({ sections }) => (
  <div>
    {sections?.map((s, i) => {
      const c = sc(s.score);
      const hex = scHex(s.score);
      return (
        <div key={i} style={{ padding: "14px 0", borderBottom: i < sections.length - 1 ? "1px solid var(--rl)" : "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <span style={{ fontFamily: "var(--f1)", fontSize: 13, fontWeight: 600, color: "var(--t1)" }}>{s.section}</span>
            <span style={{ fontFamily: "var(--f2)", fontSize: 12, fontWeight: 600, color: c }}>{s.score}</span>
          </div>
          <Bar val={s.score} color={hex} h={2} delay={i * 60} />
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {s.strength && s.strength !== "None." && s.strength !== "N/A" && (
              <Insight icon="✔" color="var(--ok)" text={s.strength} />
            )}
            {s.weakness && s.weakness !== "None." && s.weakness !== "N/A" && (
              <Insight icon="✖" color="var(--er)" text={s.weakness} />
            )}
          </div>
        </div>
      );
    })}
  </div>
);

const SkillsView = ({ missing }) => {
  const cfg = { HIGH: "#F87171", MEDIUM: "#FB923C", LOW: "#60A5FA" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {["HIGH", "MEDIUM", "LOW"].map(lvl => {
        const skills = missing?.filter(s => s.importance === lvl) || [];
        if (!skills.length) return null;
        const c = cfg[lvl];
        return (
          <div key={lvl}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: c }} />
              <span className="ol" style={{ color: c }}>{lvl} priority</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {skills.map((item, i) => (
                <span key={i} style={{ fontFamily: "var(--f2)", fontSize: 11.5, color: "var(--t2)", background: "var(--s2)", border: "1px solid var(--rl2)", borderRadius: "var(--rm)", padding: "5px 10px" }}>
                  {item.skill}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AnalysisTabs = ({ data }) => {
  const [tab, setTab] = useState("impact");
  const TABS = [
    { k: "impact",    l: "Impact",      s: data.impactScore?.score },
    { k: "keywords",  l: "Keywords",    s: data.keywordMatch?.score },
    { k: "cred",      l: "Credibility", s: data.credibilityCheck?.score },
    { k: "ats",       l: "ATS",         s: data.atsFriendliness?.score },
    { k: "sections",  l: "Sections" },
    { k: "skills",    l: "Skill Gaps" },
  ];
  const views = {
    impact:   <CategoryView data={data.impactScore}      feedback={data.impactScore?.feedback}      fixedExample={data.impactScore?.fixedExample} />,
    keywords: <CategoryView data={data.keywordMatch}     feedback={data.keywordMatch?.feedback}     fixedExample={data.keywordMatch?.fixedExample} />,
    cred:     <CategoryView data={data.credibilityCheck} feedback={data.credibilityCheck?.feedback} fixedExample={data.credibilityCheck?.fixedExample} />,
    ats:      <CategoryView data={data.atsFriendliness}  feedback={data.atsFriendliness?.feedback}  fixedExample={data.atsFriendliness?.fixedExample} />,
    sections: <SectionsView sections={data.sectionAnalysis} />,
    skills:   <SkillsView missing={data.missingSkills} />,
  };
  return (
    <div>
      <div className="tabs">
        {TABS.map(t => {
          const on = tab === t.k;
          const c = t.s != null ? sc(t.s) : null;
          const hex = t.s != null ? scHex(t.s) : null;
          return (
            <button key={t.k} className={`tab${on ? " on" : ""}`} onClick={() => setTab(t.k)}>
              {t.l}
              {t.s != null && (
                <span style={{ fontFamily: "var(--f2)", fontSize: 10, fontWeight: 600, color: on ? hex : "var(--t4)", background: on ? `${hex}15` : "transparent", padding: "1px 6px", borderRadius: "var(--r)", transition: "all 0.15s" }}>
                  {t.s}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          style={{ padding: "20px 0" }}>
          {views[tab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ─── Recruiter sim ──────────────────────────────
const PERSONAS = [
  { k: "hr",            l: "HR Screener",    icon: "👩‍💼", c: "var(--ok)"  },
  { k: "hiringManager", l: "Hiring Manager", icon: "👨‍💻", c: "var(--a)"   },
  { k: "ats",           l: "ATS System",     icon: "🤖",  c: "var(--in)"  },
];

const RecruiterSim = ({ sim }) => {
  const [active, setActive] = useState("hr");
  const [typing, setTyping] = useState(true);
  const [key,    setKey]    = useState(0);
  useEffect(() => {
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 650);
    return () => clearTimeout(t);
  }, [active]);
  if (!sim) return null;
  const p = PERSONAS.find(x => x.k === active);
  return (
    <div>
      <div className="tabs" style={{ marginBottom: 0 }}>
        {PERSONAS.map(px => (
          <button key={px.k} className={`tab${active === px.k ? " on" : ""}`}
            style={{ borderBottomColor: active === px.k ? px.c : "transparent" }}
            onClick={() => { setActive(px.k); setKey(k => k + 1); }}>
            <span style={{ fontSize: 14 }}>{px.icon}</span>
            <span style={{ color: active === px.k ? "var(--t1)" : "var(--t3)" }}>{px.l}</span>
          </button>
        ))}
      </div>
      <div style={{ padding: "20px 0", minHeight: 100 }}>
        <AnimatePresence mode="wait">
          {typing ? (
            <motion.div key="typ" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--s2)", border: `1px solid ${p.c}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{p.icon}</div>
              <div style={{ display: "flex", gap: 4, padding: "9px 13px", background: "var(--s2)", border: "1px solid var(--rl2)", borderRadius: "2px 10px 10px 10px" }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ y: [0, -3, 0] }} transition={{ duration: 0.5, delay: i * 0.12, repeat: Infinity }}
                    style={{ width: 4, height: 4, borderRadius: "50%", background: p.c, opacity: 0.7 }} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key={`m${key}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
              style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--s2)", border: `1px solid ${p.c}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, marginTop: 2 }}>{p.icon}</div>
              <div>
                <div className="ol" style={{ color: p.c, marginBottom: 8 }}>{p.l}</div>
                <div style={{ padding: "12px 14px", background: "var(--s2)", border: `1px solid ${p.c}12`, borderRadius: "2px 10px 10px 10px" }}>
                  <p style={{ fontFamily: "var(--f1)", fontSize: 13, lineHeight: 1.65, color: "var(--t2)" }}>{sim[p.k]}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── Main ───────────────────────────────────────
export default function ResultDashboard({ data, onReset }) {
  const [dl, setDl]         = useState(false);
  const { cardRef, downloadCard } = useShareCard();
  const [run, setRun]       = useState(false);
  const count               = useCount(data.overallScore, run);
  const color               = sc(data.overallScore);
  const hex                 = scHex(data.overallScore);

  useEffect(() => { const t = setTimeout(() => setRun(true), 100); return () => clearTimeout(t); }, []);
  const handleDl = async () => { setDl(true); await downloadCard(); setDl(false); };

  return (
    <div style={{ maxWidth: 1020, margin: "0 auto", padding: "0 24px 80px" }}>
      <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -1 }}>
        <ShareCard ref={cardRef} data={data} />
      </div>

      {/* ── Category summary bar ── */}
      <SummaryBar data={data} />

      {/* ── Hero: 2-col ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginBottom: 56, alignItems: "start" }}
      >
        {/* LEFT — Score */}
        <div style={{ paddingRight: 44, borderRight: "1px solid var(--rl)", position: "relative" }}>

          {/* Ambient score glow behind number */}
          <div style={{
            position: "absolute", top: -20, left: -20,
            width: 260, height: 200, borderRadius: "50%",
            background: `radial-gradient(ellipse at center, ${hex}08 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />

          {/* Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={run ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
            style={{ fontFamily: "var(--f1)", fontSize: 120, fontWeight: 900, lineHeight: 1, color: hex, letterSpacing: "-6px", marginBottom: -2, position: "relative" }}
          >
            {count}
          </motion.div>

          <div style={{ fontFamily: "var(--f2)", fontSize: 12, color: "var(--t3)", marginBottom: 12 }}>
            /100 resume score
          </div>
          <ScoreLabel score={data.overallScore} />

          {/* Score bar */}
          <div style={{ marginTop: 18, marginBottom: 22 }}>
            <div style={{ height: 4, background: "var(--t4)", borderRadius: 2, overflow: "hidden", marginBottom: 5 }}>
              <div style={{ height: "100%", width: run ? `${data.overallScore}%` : "0%", background: `linear-gradient(90deg, ${hex}70, ${hex})`, borderRadius: 2, transition: "width 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s" }} />
            </div>
          </div>

          {/* Comparison */}
          <div style={{ marginBottom: 20 }}>
            <div className="ol" style={{ marginBottom: 12 }}>Compared to applicants</div>
            {[
              { l: "You",           v: data.overallScore, c: hex,          w: 700 },
              { l: "Top 10%",       v: TOP,               c: "var(--t3)",  w: 400 },
              { l: "Avg. Applicant",v: AVG,               c: "var(--t3)",  w: 400 },
            ].map((row, i) => (
              <div key={row.l} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "var(--f1)", fontSize: 12, color: row.l === "You" ? "var(--t1)" : "var(--t3)", fontWeight: row.w }}>{row.l}</span>
                  <span style={{ fontFamily: "var(--f2)", fontSize: 12, fontWeight: 600, color: row.c }}>{row.v}</span>
                </div>
                <Bar val={row.v} color={row.c} h={2} delay={i * 120 + 200} />
              </div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={run ? { opacity: 1 } : {}} transition={{ delay: 1.2, duration: 0.3 }}
              style={{ marginTop: 10, display: "inline-block", padding: "5px 10px", background: data.overallScore > AVG ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${data.overallScore > AVG ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`, borderRadius: "var(--r)" }}>
              <span style={{ fontFamily: "var(--f2)", fontSize: 11, fontWeight: 600, color: data.overallScore > AVG ? "var(--ok)" : "var(--er)" }}>
                {data.overallScore > AVG ? `↑ ${data.overallScore - AVG} pts above average` : `↓ ${AVG - data.overallScore} pts below average`}
              </span>
            </motion.div>
          </div>

          {/* Shortlist prob */}
          {data.shortlistProbability !== undefined && (
            <div style={{ paddingTop: 14, borderTop: "1px solid var(--rl)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--f1)", fontSize: 12, color: "var(--t3)" }}>Shortlist probability</span>
              <span style={{ fontFamily: "var(--f2)", fontSize: 15, fontWeight: 700, color: hex }}>{data.shortlistProbability}%</span>
            </div>
          )}

          {/* Verdict */}
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--rl)" }}>
            <div className="ol" style={{ marginBottom: 9 }}>Verdict</div>
            <p style={{ fontFamily: "var(--f1)", fontSize: 13.5, fontStyle: "italic", lineHeight: 1.7, color: "var(--t2)", borderLeft: "2px solid var(--a)", paddingLeft: 14 }}>
              "{data.savageOneLiner}"
            </p>
          </div>
        </div>

        {/* RIGHT — Issues */}
        <div style={{ paddingLeft: 44 }}>
          <div className="ol" style={{ marginBottom: 14 }}>Priority Issues</div>
          {data.topIssues?.slice(0, 3).map((item, i) => <Issue key={i} item={item} idx={i} />)}

          {/* Skill gaps */}
          {data.missingSkills?.length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--rl)" }}>
              <div className="ol" style={{ marginBottom: 12 }}>Skill Gaps</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.missingSkills.slice(0, 8).map((item, i) => {
                  const c = { HIGH: "#F87171", MEDIUM: "#FB923C", LOW: "#60A5FA" }[item.importance] || "var(--t3)";
                  return (
                    <span key={i} style={{ fontFamily: "var(--f2)", fontSize: 11.5, color: "var(--t2)", background: "var(--s2)", border: "1px solid var(--rl2)", borderRadius: "var(--rm)", padding: "4px 10px", display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: c, flexShrink: 0 }} />
                      {item.skill}
                    </span>
                  );
                })}
                {data.missingSkills.length > 8 && (
                  <span style={{ fontFamily: "var(--f2)", fontSize: 11.5, color: "var(--t3)", background: "var(--s1)", border: "1px solid var(--rl)", borderRadius: "var(--rm)", padding: "4px 10px" }}>
                    +{data.missingSkills.length - 8}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Analysis tabs ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }} style={{ marginBottom: 48 }}>
        <div className="ol" style={{ marginBottom: 16 }}>Detailed Analysis</div>
        <AnalysisTabs data={data} />
      </motion.div>

      {/* ── Recruiter sim ── */}
      {data.recruiterSimulation && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.35 }} style={{ marginBottom: 48 }}>
          <div className="ol" style={{ marginBottom: 16 }}>Recruiter Simulation</div>
          <RecruiterSim sim={data.recruiterSimulation} />
        </motion.div>
      )}

      {/* ── Actions ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.3 }}
        style={{ display: "flex", gap: 8, paddingTop: 24, borderTop: "1px solid var(--rl)" }}>
        <motion.button onClick={handleDl} disabled={dl}
          whileHover={!dl ? { opacity: 0.88 } : {}} whileTap={!dl ? { scale: 0.99 } : {}}
          style={{ flex: 1, padding: "13px 20px", borderRadius: "var(--rm)", border: "none", cursor: dl ? "not-allowed" : "pointer", fontFamily: "var(--f1)", fontSize: 14, fontWeight: 700, background: dl ? "var(--s2)" : "var(--a)", color: dl ? "var(--t3)" : "#0F1115", transition: "all 0.15s", boxShadow: dl ? "none" : "0 0 24px var(--a-dim)" }}>
          {dl ? "Generating..." : "⬇ Download Report"}
        </motion.button>
        <motion.button whileHover={{ background: "var(--s3)" }} whileTap={{ scale: 0.99 }}
          style={{ padding: "13px 20px", borderRadius: "var(--rm)", border: "1px solid var(--rl2)", background: "var(--s2)", color: "var(--t2)", fontFamily: "var(--f1)", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>
          ✦ Improve Resume
        </motion.button>
        <motion.button onClick={onReset} whileHover={{ color: "var(--t2)" }} whileTap={{ scale: 0.99 }}
          style={{ padding: "13px 18px", borderRadius: "var(--rm)", border: "1px solid var(--rl)", background: "transparent", color: "var(--t3)", fontFamily: "var(--f1)", fontSize: 13, fontWeight: 400, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>
          Run Again
        </motion.button>
      </motion.div>
    </div>
  );
}
