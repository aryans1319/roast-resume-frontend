import { forwardRef } from "react";

const getScoreConfig = (score) => {
    if (score >= 80) return { label: "STRONG PROFILE", emoji: "💪", color: "#10b981", glow: "rgba(16,185,129,0.5)" };
    if (score >= 60) return { label: "NEEDS WORK", emoji: "🔧", color: "#f59e0b", glow: "rgba(245,158,11,0.5)" };
    return { label: "MAJOR RED FLAGS", emoji: "🚨", color: "#ef4444", glow: "rgba(239,68,68,0.5)" };
};

// Score circle uses pure SVG text — no HTML overlap, no html2canvas spacing bugs
const CircleScore = ({ score, color, glow }) => {
    const size = 148;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;

    return (
        <svg width={size} height={size} style={{ flexShrink: 0 }}>
            {/* Glow filter */}
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Track ring */}
            <circle
                cx={cx} cy={cy} r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="10"
            />

            {/* Progress ring */}
            <circle
                cx={cx} cy={cy} r={radius}
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${progress} ${circumference}`}
                transform={`rotate(-90 ${cx} ${cy})`}
                filter="url(#glow)"
            />

            {/* Score number — SVG text, perfectly centered, no layout bugs */}
            <text
                x={cx}
                y={cy - 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={color}
                fontSize="42"
                fontWeight="900"
                fontFamily="'Segoe UI', system-ui, sans-serif"
            >
                {score}
            </text>

            {/* / 100 label — fixed 22px below center */}
            <text
                x={cx}
                y={cy + 22}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.3)"
                fontSize="11"
                fontWeight="500"
                fontFamily="'Segoe UI', system-ui, sans-serif"
                letterSpacing="0.5"
            >
                / 100
            </text>
        </svg>
    );
};

const BarRow = ({ label, score }) => {
    const barColor = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
    return (
        <div style={{ marginBottom: "20px" }}>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: "9px"
            }}>
                <span style={{
                    fontSize: "13px", fontWeight: 600,
                    color: "rgba(255,255,255,0.8)",
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                    {label}
                </span>
                <span style={{
                    fontSize: "13px", fontWeight: 900,
                    color: barColor,
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                    {score}
                </span>
            </div>
            {/* Track */}
            <div style={{
                width: "100%", height: "8px",
                borderRadius: "99px",
                background: "rgba(255,255,255,0.07)",
                overflow: "hidden"
            }}>
                {/* Fill */}
                <div style={{
                    width: `${score}%`, height: "100%",
                    borderRadius: "99px",
                    background: `linear-gradient(90deg, ${barColor}88, ${barColor}ff)`,
                }} />
            </div>
        </div>
    );
};

const ShareCard = forwardRef(({ data }, ref) => {
    const { label, emoji, color, glow } = getScoreConfig(data.overallScore);

    return (
        <div
            ref={ref}
            style={{
                width: "600px",
                background: "linear-gradient(150deg, #0d0b26 0%, #16103a 50%, #1f1545 100%)",
                padding: "48px",
                borderRadius: "20px",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                color: "white",
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            {/* Ambient top-right glow */}
            <div style={{
                position: "absolute", top: -100, right: -100,
                width: 300, height: 300, borderRadius: "50%",
                background: `radial-gradient(circle, ${color}1a 0%, transparent 65%)`,
                pointerEvents: "none",
            }} />

            {/* Ambient bottom-left glow */}
            <div style={{
                position: "absolute", bottom: -80, left: -80,
                width: 260, height: 260, borderRadius: "50%",
                background: "radial-gradient(circle, #6d28d91a 0%, transparent 65%)",
                pointerEvents: "none",
            }} />

            {/* ── Brand header ── */}
            <div style={{
                display: "flex", alignItems: "center",
                gap: "8px", marginBottom: "24px"
            }}>
                <span style={{ fontSize: "15px" }}>🔥</span>
                <span style={{
                    fontSize: "11px", fontWeight: 700,
                    letterSpacing: "2.5px", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.35)"
                }}>
                    RoastMyResume.dev
                </span>
            </div>

            {/* ── Title ── */}
            <div style={{
                fontSize: "24px", fontWeight: 900,
                letterSpacing: "-0.3px", marginBottom: "32px",
                color: "white"
            }}>
                My Resume Got Roasted 🔥
            </div>

            {/* ── Score row ── */}
            <div style={{
                display: "flex", alignItems: "center",
                gap: "24px", marginBottom: "36px"
            }}>
                <CircleScore score={data.overallScore} color={color} glow={glow} />

                <div style={{ flex: 1 }}>
                    {/* Pill badge — pure SVG, immune to html2canvas font metric bugs */}
                    <svg
                        width="210" height="32"
                        style={{ display: "block", marginBottom: "14px" }}
                    >
                        <rect x="0" y="0" width="210" height="32" rx="16"
                            fill={`${color}18`}
                            stroke={color} strokeOpacity="0.4" strokeWidth="1"
                        />
                        <text
                            x="105" y="16"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontFamily="'Segoe UI', system-ui, sans-serif"
                            fontSize="11" fontWeight="800"
                            letterSpacing="1.5"
                            fill={color}
                            style={{ textTransform: "uppercase" }}
                        >
                            {emoji} {label}
                        </text>
                    </svg>

                    {/* Savage one-liner */}
                    <div style={{
                        fontSize: "13.5px", fontStyle: "italic",
                        color: "rgba(255,255,255,0.7)",
                        lineHeight: "1.65",
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                    }}>
                        "{data.savageOneLiner}"
                    </div>
                </div>
            </div>

            {/* ── Divider ── */}
            <div style={{
                height: "1px",
                background: "rgba(255,255,255,0.07)",
                marginBottom: "28px"
            }} />

            {/* ── Category bars ── */}
            <div style={{ marginBottom: "24px" }}>
                <BarRow label="💥  Impact Score" score={data.impactScore?.score} />
                <BarRow label="🔍  Keyword Match" score={data.keywordMatch?.score} />
                <BarRow label="🎯  Credibility Check" score={data.credibilityCheck?.score} />
                <BarRow label="🤖  ATS Friendliness" score={data.atsFriendliness?.score} />
            </div>

            {/* ── Biggest issue box ── */}
            <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderLeft: `3px solid ${color}`,
                borderRadius: "10px",
                padding: "16px 18px",
                marginBottom: "32px",
            }}>
                <div style={{
                    fontSize: "10px", fontWeight: 800,
                    letterSpacing: "1.5px", textTransform: "uppercase",
                    color: color, marginBottom: "10px",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}>
                    🚨 Biggest Issue
                </div>
                <div style={{
                    fontSize: "13px", color: "rgba(255,255,255,0.75)",
                    lineHeight: "1.65",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}>
                    {data.topIssue1}
                </div>
            </div>

            {/* ── Footer ── */}
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                paddingTop: "20px",
            }}>
                <span style={{
                    fontSize: "12px", color: "rgba(255,255,255,0.28)",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}>
                    Get your resume roasted at
                </span>
                <span style={{
                    fontSize: "13px", fontWeight: 800,
                    color: "#a78bfa",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}>
                    roastmyresume.dev 🔥
                </span>
            </div>
        </div>
    );
});

ShareCard.displayName = "ShareCard";
export default ShareCard;   