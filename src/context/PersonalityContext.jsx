import { createContext, useContext, useState } from "react";

export const PERSONALITIES = {
  savage:       { key:"savage",       emoji:"😈", label:"Savage",       accent:"var(--red)",    accentRgb:"248,113,113", tagline:"No mercy. Full damage report.",    scoreLabel:"DAMAGE SCORE",     verdictLabel:"VERDICT" },
  balanced:     { key:"balanced",     emoji:"😌", label:"Balanced",     accent:"var(--amber)",  accentRgb:"245,158,11",  tagline:"Honest feedback. No filter.",       scoreLabel:"ROAST SCORE",      verdictLabel:"ANALYSIS" },
  professional: { key:"professional", emoji:"🧠", label:"Professional", accent:"var(--blue)",   accentRgb:"96,165,250",  tagline:"Structured, actionable, precise.",  scoreLabel:"ASSESSMENT SCORE", verdictLabel:"REPORT" },
};

const Ctx = createContext(null);

export const PersonalityProvider = ({ children }) => {
  const [mode, setMode] = useState("balanced");
  return <Ctx.Provider value={{ mode, setMode, personality: PERSONALITIES[mode], PERSONALITIES }}>{children}</Ctx.Provider>;
};

export const usePersonality = () => useContext(Ctx);