import { useState } from "react";
import ScoreCard from "./ScoreCard";
import ShareCard from "./ShareCard";
import useShareCard from "../hooks/useShareCard";

const RoastResult = ({ data, onReset }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { cardRef, downloadCard } = useShareCard();

  const getOverallColor = (score) => {
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    await downloadCard();
    setIsDownloading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ShareCard rendered off-screen — invisible but captured by html2canvas */}
      <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -1 }}>
        <ShareCard ref={cardRef} data={data} />
      </div>

      {/* Overall Score */}
      <div className="text-center bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Overall Roast Score
        </p>
        <p className={`text-8xl font-black ${getOverallColor(data.overallScore)}`}>
          {data.overallScore}
        </p>
        <p className="text-gray-400 text-sm mt-1">out of 100</p>
        <p className="mt-4 text-gray-600 italic text-base font-medium">
          "{data.savageOneLiner}"
        </p>
      </div>

      {/* Share Card Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-700 text-lg">Share Your Result 🔥</h2>
            <p className="text-sm text-gray-400">Download and post on LinkedIn or Twitter</p>
          </div>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all
              ${isDownloading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 active:scale-95"}`}
          >
            {isDownloading ? "Generating..." : "⬇️ Download Card"}
          </button>
        </div>

        {/* Score preview teaser */}
        <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 
          rounded-xl p-4 flex items-center gap-4 border border-purple-100">
          <div className="text-4xl font-black text-purple-600">{data.overallScore}</div>
          <div>
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
              Your Roast Score
            </p>
            <p className="text-sm text-gray-600 italic mt-0.5">"{data.savageOneLiner}"</p>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="space-y-4">
        <h2 className="font-bold text-gray-700 text-lg">Detailed Breakdown</h2>
        <ScoreCard
          title="Impact Score" icon="💥"
          score={data.impactScore?.score}
          feedback={data.impactScore?.feedback}
          fixedExample={data.impactScore?.fixedExample}
        />
        <ScoreCard
          title="Keyword Match" icon="🔍"
          score={data.keywordMatch?.score}
          feedback={data.keywordMatch?.feedback}
          fixedExample={data.keywordMatch?.fixedExample}
        />
        <ScoreCard
          title="Credibility Check" icon="🎯"
          score={data.credibilityCheck?.score}
          feedback={data.credibilityCheck?.feedback}
          fixedExample={data.credibilityCheck?.fixedExample}
        />
        <ScoreCard
          title="ATS Friendliness" icon="🤖"
          score={data.atsFriendliness?.score}
          feedback={data.atsFriendliness?.feedback}
          fixedExample={data.atsFriendliness?.fixedExample}
        />
      </div>

      {/* Top 3 Issues */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3">
        <h2 className="font-bold text-red-600 text-lg">🚨 Top 3 Issues to Fix</h2>
        {[data.topIssue1, data.topIssue2, data.topIssue3].map((issue, i) => (
          <div key={i} className="flex gap-3">
            <span className="font-bold text-red-400">#{i + 1}</span>
            <p className="text-sm text-gray-700">{issue}</p>
          </div>
        ))}
      </div>

      {/* Rewritten Summary */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 space-y-2">
        <h2 className="font-bold text-purple-600 text-lg">✨ Rewritten Professional Summary</h2>
        <p className="text-sm text-gray-700 leading-relaxed">{data.rewrittenSummary}</p>
      </div>

      {/* Roast Again */}
      <button
        onClick={onReset}
        className="w-full py-4 rounded-xl font-bold text-white text-lg bg-purple-600 
          hover:bg-purple-700 active:scale-95 transition-all"
      >
        Roast Another Resume 🔥
      </button>
    </div>
  );
};

export default RoastResult;