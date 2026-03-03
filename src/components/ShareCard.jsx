import { forwardRef } from "react";

const getScoreColor = (score) => {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
};

const getScoreLabel = (score) => {
  if (score >= 80) return "Strong Profile 💪";
  if (score >= 60) return "Needs Work 🔧";
  return "Major Red Flags 🚨";
};

const CategoryRow = ({ icon, label, score }) => (
  <div style={{ marginBottom: "12px" }}>
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: "center", marginBottom: "5px"
    }}>
      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>
        {icon} {label}
      </span>
      <span style={{
        fontSize: "13px", fontWeight: 700,
        color: getScoreColor(score)
      }}>
        {score}/100
      </span>
    </div>
    <div style={{
      width: "100%", height: "6px",
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: "3px", overflow: "hidden"
    }}>
      <div style={{
        width: `${score}%`, height: "100%",
        backgroundColor: getScoreColor(score),
        borderRadius: "3px"
      }} />
    </div>
  </div>
);

const ShareCard = forwardRef(({ data }, ref) => {
  const scoreColor = getScoreColor(data.overallScore);
  const scoreLabel = getScoreLabel(data.overallScore);

  return (
    <div
      ref={ref}
      style={{
        width: "560px",
        background: "linear-gradient(160deg, #1e1b4b 0%, #3b0764 100%)",
        padding: "40px",
        borderRadius: "20px",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "white",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.5)",
          margin: "0 0 6px 0",
          letterSpacing: "0.5px"
        }}>
          🔥 RoastMyResume.dev
        </p>
        <h1 style={{
          fontSize: "26px",
          fontWeight: 900,
          margin: 0,
          letterSpacing: "-0.5px"
        }}>
          My Resume Got Roasted
        </h1>
      </div>

      {/* Score Section */}
      <div style={{
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
        marginBottom: "28px"
      }}>
        {/* Circle Score */}
        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          border: `3px solid ${scoreColor}`,
          backgroundColor: "rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <span style={{
            fontSize: "38px",
            fontWeight: 900,
            color: scoreColor,
            lineHeight: "1",
            display: "block",
            textAlign: "center"
          }}>
            {data.overallScore}
          </span>
          <span style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.5)",
            display: "block",
            textAlign: "center"
          }}>
            out of 100
          </span>
        </div>

        {/* Label + One Liner */}
        <div style={{ flex: 1, paddingTop: "4px" }}>
          <p style={{
            fontSize: "13px",
            fontWeight: 700,
            color: scoreColor,
            textTransform: "uppercase",
            letterSpacing: "1px",
            margin: "0 0 8px 0"
          }}>
            {scoreLabel}
          </p>
          <p style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.8)",
            fontStyle: "italic",
            lineHeight: "1.6",
            margin: 0
          }}>
            "{data.savageOneLiner}"
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: "1px",
        backgroundColor: "rgba(255,255,255,0.1)",
        marginBottom: "24px"
      }} />

      {/* Category Scores */}
      <div style={{ marginBottom: "24px" }}>
        <CategoryRow icon="💥" label="Impact" score={data.impactScore?.score} />
        <CategoryRow icon="🔍" label="Keywords" score={data.keywordMatch?.score} />
        <CategoryRow icon="🎯" label="Credibility" score={data.credibilityCheck?.score} />
        <CategoryRow icon="🤖" label="ATS" score={data.atsFriendliness?.score} />
      </div>

      {/* Biggest Issue Box */}
      <div style={{
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "28px",
        borderLeft: "3px solid #ef4444"
      }}>
        <p style={{
          fontSize: "10px",
          color: "#ef4444",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "1px",
          margin: "0 0 6px 0"
        }}>
          🚨 Biggest Issue
        </p>
        <p style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.85)",
          lineHeight: "1.5",
          margin: 0
        }}>
          {data.topIssue1}
        </p>
      </div>

      {/* Divider */}
      <div style={{
        height: "1px",
        backgroundColor: "rgba(255,255,255,0.1)",
        marginBottom: "16px"
      }} />

      {/* Footer */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <p style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.4)",
          margin: 0
        }}>
          Get your resume roasted at
        </p>
        <p style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#a78bfa",
          margin: 0
        }}>
          roastmyresume.dev 🔥
        </p>
      </div>
    </div>
  );
});

ShareCard.displayName = "ShareCard";
export default ShareCard;