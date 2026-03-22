import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersonality } from "../context/PersonalityContext";
import PersonalitySelector from "./PersonalitySelector";

export default function UploadForm({ onSubmit, isLoading }) {
  const { personality } = usePersonality();
  const [file, setFile]     = useState(null);
  const [jd,   setJd]       = useState("");
  const [drag, setDrag]     = useState(false);
  const can = file && jd.trim() && !isLoading;

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
  };

  return (
    <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
      style={{ maxWidth:520, margin:"0 auto", padding:"0 16px" }}>

      <PersonalitySelector />

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onClick={() => document.getElementById("rf").click()}
        style={{
          borderRadius:"var(--r3)",
          padding:"40px 24px",
          textAlign:"center",
          cursor:"pointer",
          border:`1.5px dashed ${drag ? "var(--amber)" : file ? "rgba(52,211,153,0.4)" : "var(--line-2)"}`,
          background: drag ? "var(--amber-dim)" : "var(--card)",
          transition:"all 0.15s ease",
          marginBottom:12,
        }}
      >
        <input id="rf" type="file" accept="application/pdf" style={{ display:"none" }} onChange={e => setFile(e.target.files[0])} />
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div key="f" initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}>
              <div style={{ fontSize:28, marginBottom:10 }}>📄</div>
              <p style={{ fontFamily:"var(--f-display)", fontSize:14, fontWeight:600, color:"var(--green)", marginBottom:4 }}>{file.name}</p>
              <p className="label">Click to replace</p>
            </motion.div>
          ) : (
            <motion.div key="e" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <div style={{ fontSize:28, marginBottom:12 }}>📄</div>
              <p style={{ fontFamily:"var(--f-display)", fontSize:15, fontWeight:600, color:"var(--t2)", marginBottom:6 }}>Drop resume here</p>
              <p className="label">PDF only · max 5MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* JD */}
      <div style={{ marginBottom:12 }}>
        <div className="label" style={{ marginBottom:8 }}>Job Description</div>
        <textarea rows={6} placeholder="Paste the full job description..." value={jd} onChange={e => setJd(e.target.value)}
          style={{ width:"100%", background:"var(--card)", border:"1px solid var(--line)", borderRadius:"var(--r3)", padding:"13px 14px", color:"var(--t1)", resize:"none", outline:"none", fontSize:13, lineHeight:1.6, transition:"border-color 0.15s" }}
          onFocus={e => e.target.style.borderColor="var(--amber-line)"}
          onBlur={e => e.target.style.borderColor="var(--line)"}
        />
      </div>

      {/* Submit */}
      <motion.button onClick={() => can && onSubmit(file, jd)} disabled={!can}
        whileHover={can ? { scale:1.008 } : {}} whileTap={can ? { scale:0.997 } : {}}
        style={{ width:"100%", padding:"15px", borderRadius:"var(--r3)", border:"none", cursor:can?"pointer":"not-allowed", fontFamily:"var(--f-display)", fontSize:15, fontWeight:700, transition:"all 0.15s",
          background: can ? "var(--amber)" : "var(--card)",
          color: can ? "#0F0F0F" : "var(--t4)",
          boxShadow: can ? "0 0 24px var(--amber-dim)" : "none",
        }}
      >
        {isLoading ? "Analyzing..." : `${personality.emoji} Roast My Resume`}
      </motion.button>

      <p className="label" style={{ textAlign:"center", marginTop:12 }}>5 free roasts / hour · no account required</p>
    </motion.div>
  );
}