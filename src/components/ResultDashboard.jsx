import { useState } from "react";
import { motion } from "framer-motion";
import { usePersonality } from "../context/PersonalityContext";
import ScorePanel from "./ScorePanel";
import IssuesPanel from "./IssuesPanel";
import AnalysisTabs from "./AnalysisTabs";
import RecruiterTabs from "./RecruiterTabs";
import ShareCard from "./ShareCard";
import useShareCard from "../hooks/useShareCard";

const SectionDivider = ({ label, delay=0 }) => (
  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay, duration:0.3 }}
    style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
    <span className="label">{label}</span>
    <div style={{ flex:1, height:1, background:"var(--line)" }} />
  </motion.div>
);

export default function ResultDashboard({ data, onReset }) {
  const { personality } = usePersonality();
  const [dl, setDl] = useState(false);
  const { cardRef, downloadCard } = useShareCard();

  const handleDl = async () => { setDl(true); await downloadCard(); setDl(false); };

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 20px 64px" }}>
      <div style={{ position:"fixed", left:"-9999px", top:0, zIndex:-1 }}>
        <ShareCard ref={cardRef} data={data} />
      </div>

      {/* Row 1: Score + Issues */}
      <SectionDivider label="Overview" delay={0} />
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}
        style={{ display:"grid", gridTemplateColumns:"minmax(300px,380px) 1fr", gap:12, marginBottom:12, alignItems:"stretch" }}>
        <ScorePanel score={data.overallScore} shortlistProbability={data.shortlistProbability} savageOneLiner={data.savageOneLiner} confidenceScore={data.confidenceScore} />
        <IssuesPanel topIssues={data.topIssues} missingSkills={data.missingSkills} />
      </motion.div>

      {/* Row 2: Analysis */}
      <SectionDivider label="Analysis" delay={0.1} />
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3, delay:0.1 }} style={{ marginBottom:12 }}>
        <AnalysisTabs data={data} />
      </motion.div>

      {/* Row 3: Recruiter */}
      {data.recruiterSimulation && (
        <>
          <SectionDivider label="Recruiter Reactions" delay={0.18} />
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3, delay:0.18 }} style={{ marginBottom:12 }}>
            <RecruiterTabs recruiterSimulation={data.recruiterSimulation} />
          </motion.div>
        </>
      )}

      {/* CTAs */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25, duration:0.3 }}
        style={{ display:"flex", gap:8, marginTop:4 }}>

        <motion.button onClick={handleDl} disabled={dl}
          whileHover={!dl?{scale:1.008}:{}} whileTap={!dl?{scale:0.997}:{}}
          style={{ flex:1, padding:"13px 18px", borderRadius:"var(--r3)", border:"none", cursor:dl?"not-allowed":"pointer", fontFamily:"var(--f-display)", fontSize:14, fontWeight:700, transition:"all 0.15s",
            background:dl?"var(--card)":"var(--amber)", color:dl?"var(--t4)":"#0F0F0F",
            boxShadow:dl?"none":"0 0 20px var(--amber-dim)",
          }}>
          {dl ? "Generating..." : "⬇ Download Report"}
        </motion.button>

        <motion.button whileHover={{ background:"var(--card-2)" }} whileTap={{ scale:0.998 }}
          style={{ padding:"13px 20px", borderRadius:"var(--r3)", border:"1px solid var(--line-2)", background:"var(--card)", color:"var(--t2)", fontFamily:"var(--f-display)", fontSize:14, fontWeight:600, cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap" }}>
          ✦ Improve Resume
        </motion.button>

        <motion.button onClick={onReset}
          whileHover={{ color:"var(--t2)" }} whileTap={{ scale:0.998 }}
          style={{ padding:"13px 18px", borderRadius:"var(--r3)", border:"1px solid var(--line)", background:"transparent", color:"var(--t3)", fontFamily:"var(--f-body)", fontSize:13, fontWeight:400, cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap" }}>
          Run Again
        </motion.button>
      </motion.div>
    </div>
  );
}