import { useState, useEffect } from "react";

const STEPS = [
  "Parsing document structure",
  "Extracting work experience",
  "Matching keywords to job description",
  "Evaluating impact statements",
  "Running ATS compatibility check",
  "Checking credibility signals",
  "Comparing with top candidates",
  "Simulating recruiter reactions",
  "Generating fix recommendations",
];

export default function LoadingScreen() {
  const [step, setStep]         = useState(0);
  const [chars, setChars]       = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStep(s => {
        if (s < STEPS.length - 1) { setChars(0); return s + 1; }
        clearInterval(t); return s;
      });
    }, 2600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const target = STEPS[step];
    if (chars >= target.length) return;
    const t = setTimeout(() => setChars(c => c + 1), 28);
    return () => clearTimeout(t);
  }, [step, chars]);

  useEffect(() => {
    const target = Math.round(((step + 1) / STEPS.length) * 94);
    const t = setInterval(() => {
      setProgress(p => { if (p >= target) { clearInterval(t); return p; } return p + 1; });
    }, 40);
    return () => clearInterval(t);
  }, [step]);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:36 }}>

      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:18 }}>🔥</span>
        <span style={{ fontFamily:"var(--f-display)", fontSize:16, fontWeight:700, color:"var(--t1)" }}>RoastMyResume</span>
      </div>

      {/* Spinner */}
      <div style={{ position:"relative", width:48, height:48 }}>
        <svg width={48} height={48} style={{ position:"absolute", inset:0, animation:"spin 2s linear infinite" }}>
          <circle cx={24} cy={24} r={18} fill="none" stroke="var(--line-2)" strokeWidth={2} />
          <circle cx={24} cy={24} r={18} fill="none" stroke="var(--amber)" strokeWidth={2}
            strokeDasharray="28 84" strokeLinecap="round" />
        </svg>
      </div>

      {/* Step text */}
      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"var(--f-mono)", fontSize:11, color:"var(--t3)", letterSpacing:"1.5px", marginBottom:10 }}>
          STEP {step + 1} OF {STEPS.length}
        </div>
        <div style={{ fontFamily:"var(--f-display)", fontSize:17, fontWeight:600, color:"var(--t1)", minHeight:26 }}>
          {STEPS[step].slice(0, chars)}
          <span style={{ display:"inline-block", width:2, height:"1em", background:"var(--amber)", marginLeft:2, verticalAlign:"text-bottom", animation:"blink 0.7s step-end infinite" }} />
        </div>
      </div>

      {/* Progress */}
      <div style={{ width:260 }}>
        <div style={{ height:2, background:"var(--line)", borderRadius:1, overflow:"hidden", marginBottom:8 }}>
          <div style={{ height:"100%", width:`${progress}%`, background:"var(--amber)", transition:"width 0.04s linear" }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontFamily:"var(--f-mono)", fontSize:10, color:"var(--t3)" }}>Analyzing</span>
          <span style={{ fontFamily:"var(--f-mono)", fontSize:10, color:"var(--amber)" }}>{progress}%</span>
        </div>
      </div>

      {/* Step dots */}
      <div style={{ display:"flex", gap:3 }}>
        {STEPS.map((_,i) => (
          <div key={i} style={{ width: i===step ? 14 : 3, height:3, borderRadius:2, background: i<step ? "rgba(245,158,11,0.35)" : i===step ? "var(--amber)" : "var(--line-2)", transition:"all 0.3s ease" }} />
        ))}
      </div>
    </div>
  );
}