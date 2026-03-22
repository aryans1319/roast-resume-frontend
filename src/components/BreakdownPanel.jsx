import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersonality } from "../context/PersonalityContext";

const getColor = (score) => {
  if (score >= 75) return "#00E5B0";
  if (score >= 50) return "#F59E0B";
  return "#FF3D3D";
};

const ScoreBar = ({ label, icon, score, feedback, fixedExample, index, visible }) => {
  const [barFilled, setBarFilled] = useState(false);
  const color = getColor(score);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setBarFilled(true), index * 150);
      return () => clearTimeout(t);
    }
  }, [visible, index]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
          style={{
            padding: "18px 20px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            cursor: "default",
            transition: "border-color 0.2s ease",
          }}
          whileHover={{ borderColor: `${color}30` }}
        >
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 14, fontWeight: 700,
                color: "rgba(255,255,255,0.85)",
              }}>
                {label}
              </span>
            </div>
            <span style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 18, fontWeight: 700, color,
            }}>
              {score}
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 400 }}>/100</span>
            </span>
          </div>

          {/* Bar */}
          <div style={{
            height: 3, borderRadius: 99,
            background: "rgba(255,255,255,0.05)",
            marginBottom: 12, overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: barFilled ? `${score}%` : "0%",
              background: `linear-gradient(90deg, ${color}60, ${color})`,
              borderRadius: 99,
              transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${index * 0.1}s`,
              boxShadow: `0 0 6px ${color}60`,
            }} />
          </div>

          {/* Feedback */}
          {feedback && (
            <p style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 12.5, lineHeight: 1.6,
              color: "rgba(255,255,255,0.45)",
              marginBottom: fixedExample ? 12 : 0,
            }}>
              {feedback}
            </p>
          )}

          {/* Fixed example */}
          {fixedExample && fixedExample !== "N/A, already excellent." && (
            <div style={{
              padding: "10px 14px",
              background: "rgba(0,229,176,0.04)",
              border: "1px solid rgba(0,229,176,0.12)",
              borderRadius: 9,
            }}>
              <span style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 9, letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#00E5B0",
                display: "block", marginBottom: 6,
              }}>
                ✦ Fix
              </span>
              <p style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 12, lineHeight: 1.55,
                color: "rgba(255,255,255,0.6)",
                margin: 0,
              }}>
                {fixedExample}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SectionRow = ({ section, score, strength, weakness, index, visible }) => {
  const [barFilled, setBarFilled] = useState(false);
  const color = getColor(score);

  useEffect(() => {
    if (visible) setTimeout(() => setBarFilled(true), index * 100);
  }, [visible, index]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
              {section}
            </span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color }}>
              {score}/100
            </span>
          </div>
          <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.05)", marginBottom: 8, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: barFilled ? `${score}%` : "0%",
              background: `linear-gradient(90deg, ${color}60, ${color})`,
              borderRadius: 99, transition: `width 0.9s cubic-bezier(0.4,0,0.2,1) ${index * 0.1}s`,
            }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {strength && strength !== "None." && (
              <p style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 11.5, color: "rgba(0,229,176,0.65)", margin: 0, display: "flex", gap: 6 }}>
                <span>✓</span><span>{strength}</span>
              </p>
            )}
            {weakness && weakness !== "None." && weakness !== "N/A" && (
              <p style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 11.5, color: "rgba(255,61,61,0.65)", margin: 0, display: "flex", gap: 6 }}>
                <span>✗</span><span>{weakness}</span>
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SkillTag = ({ skill, importance }) => {
  const colors = { HIGH: "#FF3D3D", MEDIUM: "#F59E0B", LOW: "#4D9EFF" };
  const color = colors[importance] || colors.MEDIUM;
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: `0 4px 14px ${color}20` }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "7px 13px", borderRadius: 99,
        background: `${color}0d`,
        border: `1px solid ${color}25`,
        cursor: "default",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.78)" }}>
        {skill}
      </span>
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, fontWeight: 600, color, letterSpacing: "0.5px" }}>
        {importance}
      </span>
    </motion.div>
  );
};

const SectionHeader = ({ label, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}
      >
        <span style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10, fontWeight: 600, letterSpacing: "2.5px",
          textTransform: "uppercase", color: "rgba(255,255,255,0.22)",
        }}>
          {label}
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
      </motion.div>
    )}
  </AnimatePresence>
);

const BreakdownPanel = ({ data, phase }) => {
  const visible = phase >= 3;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

      {/* Category scores */}
      <div>
        <SectionHeader label="Category Breakdown" visible={visible} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Impact Score",      icon: "💥", key: "impactScore"      },
            { label: "Keyword Match",     icon: "🔍", key: "keywordMatch"     },
            { label: "Credibility Check", icon: "🎯", key: "credibilityCheck" },
            { label: "ATS Friendliness",  icon: "🤖", key: "atsFriendliness"  },
          ].map(({ label, icon, key }, i) => (
            <ScoreBar
              key={key}
              label={label}
              icon={icon}
              score={data[key]?.score}
              feedback={data[key]?.feedback}
              fixedExample={data[key]?.fixedExample}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>

      {/* Missing skills */}
      {data.missingSkills?.length > 0 && (
        <div>
          <SectionHeader label="Missing Skills" visible={visible} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 9 }}
          >
            {data.missingSkills.map((item, i) => (
              <SkillTag key={i} skill={item.skill} importance={item.importance} />
            ))}
          </motion.div>
        </div>
      )}

      {/* Section analysis */}
      {data.sectionAnalysis?.length > 0 && (
        <div>
          <SectionHeader label="Section Analysis" visible={visible} />
          <div style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, padding: "8px 20px",
          }}>
            {data.sectionAnalysis.map((s, i) => (
              <SectionRow
                key={i}
                section={s.section}
                score={s.score}
                strength={s.strength}
                weakness={s.weakness}
                index={i}
                visible={visible}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakdownPanel;
