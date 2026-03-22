import { forwardRef } from "react";

const getScoreConfig = (score) => {
  if (score >= 80) return { label: "STRONG PROFILE", emoji: "💪", color: "#00FFA3", glow: "rgba(0,255,163,0.4)" };
  if (score >= 60) return { label: "NEEDS WORK",     emoji: "🔧", color: "#F59E0B", glow: "rgba(245,158,11,0.4)" };
  return              { label: "MAJOR RED FLAGS",    emoji: "🚨", color: "#FF4D4F", glow: "rgba(255,77,79,0.4)" };
};

const CircleScore = ({ score, color }) => {
  const SIZE = 140;
  const cx = SIZE / 2, cy = SIZE / 2, R = 54;
  const CIRC = 2 * Math.PI * R;
  const progress = (score / 100) * CIRC;
  return (
    <svg width={SIZE} height={SIZE} style={{ flexShrink: 0 }}>
      <defs>
        <filter id="scGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={9} />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={`${progress} ${CIRC}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        filter="url(#scGlow)"
      />
      <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="40" fontWeight="900" fontFamily="'Syne', system-ui, sans-serif">
        {score}
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(255,255,255,0.25)" fontSize="10" fontFamily="'DM Mono', monospace" letterSpacing="0.5">
        / 100
      </text>
    </svg>
  );
};

const BarRow = ({ label, score }) => {
  const color = score >= 75 ? "#00FFA3" : score >= 50 ? "#F59E0B" : "#FF4D4F";
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: "'Manrope', system-ui" }}>
          {label}
        </span>
        <span style={{ fontSize: 12, fontWeight: 800, color, fontFamily: "'Syne', system-ui" }}>
          {score}
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{
          width: `${score}%`, height: "100%",
          borderRadius: 99,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
        }} />
      </div>
    </div>
  );
};

const ShareCard = forwardRef(({ data }, ref) => {
  const { label, emoji, color } = getScoreConfig(data.overallScore);
  return (
    <div ref={ref} style={{
      width: 600,
      background: "linear-gradient(150deg, #0B0F1A 0%, #111827 50%, #1a1040 100%)",
      padding: "48px",
      borderRadius: 24,
      fontFamily: "'Manrope', system-ui, sans-serif",
      color: "white",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",
    }}>
      {/* Ambient glows */}
      <div style={{
        position: "absolute", top: -80, right: -80,
        width: 280, height: 280, borderRadius: "50%",
        background: `radial-gradient(circle, ${color}18 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60,
        width: 240, height: 240, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 14 }}>🔥</span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
          RoastMyResume
        </span>
      </div>

      {/* Title */}
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 28, fontFamily: "'Syne', system-ui", letterSpacing: "-0.3px" }}>
        My Resume Got Roasted 🔥
      </div>

      {/* Score + badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
        <CircleScore score={data.overallScore} color={color} />
        <div style={{ flex: 1 }}>
          <svg width="200" height="30" style={{ display: "block", marginBottom: 12 }}>
            <rect x="0" y="0" width="200" height="30" rx="15" fill={`${color}18`} stroke={color} strokeOpacity="0.35" strokeWidth="1" />
            <text x="100" y="15" textAnchor="middle" dominantBaseline="central"
              fontFamily="'Syne', system-ui" fontSize="10" fontWeight="800" letterSpacing="1.5" fill={color}>
              {emoji} {label}
            </text>
          </svg>
          <div style={{ fontSize: 12.5, fontStyle: "italic", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
            "{data.savageOneLiner}"
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 24 }} />

      {/* Bars */}
      <div style={{ marginBottom: 20 }}>
        <BarRow label="💥  Impact Score"       score={data.impactScore?.score} />
        <BarRow label="🔍  Keyword Match"      score={data.keywordMatch?.score} />
        <BarRow label="🎯  Credibility Check"  score={data.credibilityCheck?.score} />
        <BarRow label="🤖  ATS Friendliness"   score={data.atsFriendliness?.score} />
      </div>

      {/* Top issue */}
      {data.topIssues?.[0] && (
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderLeft: `3px solid ${color}`,
          borderRadius: 10, padding: "14px 16px", marginBottom: 28,
        }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color, marginBottom: 8 }}>
            🚨 Biggest Issue
          </div>
          <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
            {data.topIssues[0].issue}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 18 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>Get roasted at</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: "#00FFA3" }}>roastedresume.vercel.app 🔥</span>
      </div>
    </div>
  );
});

ShareCard.displayName = "ShareCard";
export default ShareCard;
