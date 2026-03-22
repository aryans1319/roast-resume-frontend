import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UploadForm from "./components/UploadForm";
import LoadingScreen from "./components/LoadingScreen";
import ResultDashboard from "./components/ResultDashboard";
import { roastResume } from "./services/api";

const sColor = (s) => s>=75 ? "var(--ok)" : s>=60 ? "var(--wa)" : "var(--er)";

export default function App() {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const onSubmit = async (file, jd) => {
    setLoading(true); setError(null);
    try { setResult(await roastResume(file, jd)); }
    catch(e) { setError(e.response?.data?.error || "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const onReset = () => { setResult(null); setError(null); };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <AnimatePresence>{loading && <LoadingScreen key="l" />}</AnimatePresence>

      {/* Header */}
      <header style={{ position:"sticky",top:0,zIndex:40,background:"color-mix(in srgb, var(--bg) 96%, transparent)",backdropFilter:"blur(8px)",borderBottom:"1px solid var(--rl)",padding:"0 24px" }}>
        <div style={{ maxWidth:1020,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:50 }}>
          <span style={{ fontFamily:"var(--f1)",fontSize:14,fontWeight:700,color:"var(--t1)",letterSpacing:"-0.2px" }}>
            🔥 RoastMyResume
          </span>
          {result ? (
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ display:"flex",alignItems:"center",gap:7,padding:"4px 11px",background:"var(--s1)",border:"1px solid var(--rl2)",borderRadius:"var(--rm)" }}>
                <span className="ol">Score</span>
                <span style={{ fontFamily:"var(--f2)",fontSize:13,fontWeight:700,color:sColor(result.overallScore) }}>
                  {result.overallScore}/100
                </span>
              </div>
              <button onClick={onReset} className="ol"
                style={{ background:"none",border:"none",cursor:"pointer",color:"var(--t3)",padding:"4px 8px",transition:"color 0.15s" }}
                onMouseEnter={e=>e.target.style.color="var(--t2)"}
                onMouseLeave={e=>e.target.style.color="var(--t3)"}
              >
                ← New
              </button>
            </div>
          ) : (
            <span className="ol">AI Resume Analyzer</span>
          )}
        </div>
      </header>

      <main style={{ paddingTop: result ? 28 : 52 }}>
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              style={{ maxWidth:520,margin:"0 auto 20px",padding:"11px 16px",background:"var(--er-d)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:"var(--rl3)",fontFamily:"var(--f1)",fontSize:13,color:"var(--er)",textAlign:"center" }}>
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
}