const getScoreColor = (score) => {
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getScoreBg = (score) => {
    if (score >= 75) return "bg-green-50 border-green-200";
    if (score >= 50) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };
  
  const ScoreCard = ({ title, icon, score, feedback, fixedExample }) => {
    return (
      <div className={`border rounded-xl p-5 space-y-3 ${getScoreBg(score)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="font-bold text-gray-700">{title}</span>
          </div>
          <span className={`text-2xl font-extrabold ${getScoreColor(score)}`}>
            {score}/100
          </span>
        </div>
  
        <p className="text-sm text-gray-600">{feedback}</p>
  
        {fixedExample && (
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-400 mb-1">✨ Suggested Fix</p>
            <p className="text-sm text-gray-700">{fixedExample}</p>
          </div>
        )}
      </div>
    );
  };
  
  export default ScoreCard;