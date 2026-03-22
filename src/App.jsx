import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PersonalityProvider, usePersonality } from "./context/PersonalityContext";
import UploadForm from "./components/UploadForm";
import LoadingScreen from "./components/LoadingScreen";
import ResultDashboard from "./components/ResultDashboard";
import { roastResume } from "./services/api";

const scoreColor = (s) => s>=75 ? "var(--green)" : s>=60 ? "var(--orange)" : "var(--red)";

const AppInner = () => {
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const onSubmit = async (file, jd) => {
    setLoading(true); setError(null);
    try { setResult(await roastResume(file, jd)); }
    catch(e) { setError(e.response?.data?.error || "Something went wrong."); }
    finally { setLoading(false); }
  };

  const onReset = () => { setResult(null); setError(null); };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <AnimatePresence>{loading && <LoadingScreen key="loader" />}</AnimatePresence>

      {/* Header */}
      <header style={{ position:"sticky", top:0, zIndex:40, background:"rgba(15,15,15,0.95)", backdropFilter:"blur(8px)", borderBottom:"1px solid var(--line)", padding:"0 20px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:50 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:15 }}>🔥</span>
            <span style={{ fontFamily:"var(--f-display)", fontSize:15, fontWeight:700, color:"var(--t1)", letterSpacing:"-0.3px" }}>RoastMyResume</span>
          </div>

          {result ? (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, padding:"4px 11px", background:"var(--card)", border:"1px solid var(--line)", borderRadius:"var(--r2)" }}>
                <span className="label">Score</span>
                <span style={{ fontFamily:"var(--f-mono)", fontSize:13, fontWeight:700, color:scoreColor(result.overallScore) }}>
                  {result.overallScore}/100
                </span>
              </div>
              <button onClick={onReset} className="label" style={{ background:"none", border:"none", cursor:"pointer", color:"var(--t3)", transition:"color 0.15s", padding:"4px 8px" }}
                onMouseEnter={e=>e.target.style.color="var(--t2)"}
                onMouseLeave={e=>e.target.style.color="var(--t3)"}
              >
                ← New
              </button>
            </div>
          ) : (
            <span className="label">AI Resume Analyzer</span>
          )}
        </div>
      </header>

      <main style={{ paddingTop: result ? 28 : 48 }}>
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              style={{ maxWidth:520, margin:"0 auto 20px", padding:"11px 16px", background:"var(--red-dim)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:"var(--r3)", fontFamily:"var(--f-body)", fontSize:13, color:"var(--red)", textAlign:"center" }}>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!loading && (
            result ? (
              <motion.div key="r" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>
                <ResultDashboard data={result} onReset={onReset} />
              </motion.div>
            ) : (
              <motion.div key="u" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>
                <UploadForm onSubmit={onSubmit} isLoading={loading} />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  return <PersonalityProvider><AppInner /></PersonalityProvider>;
}