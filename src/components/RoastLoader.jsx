import { useState, useEffect } from "react";

const messages = [
  { emoji: "📄", text: "Reading your resume..." },
  { emoji: "🧐", text: "Judging your life choices..." },
  { emoji: "😬", text: "Found something concerning..." },
  { emoji: "🔍", text: "Cross-checking your skills vs reality..." },
  { emoji: "💀", text: "Your bullet points are crying..." },
  { emoji: "🤖", text: "Checking if ATS would ghosted you..." },
  { emoji: "😤", text: "15 years of recruiter trauma activating..." },
  { emoji: "🚨", text: "Credibility check... this might hurt..." },
  { emoji: "📊", text: "Calculating how generic you are..." },
  { emoji: "🔥", text: "Almost done roasting you..." },
];

const RoastLoader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 400);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const current = messages[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 space-y-10">

      {/* Fire animation */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulse ring */}
        <div className="absolute w-28 h-28 rounded-full bg-orange-500 opacity-10 animate-ping" />
        {/* Inner glow ring */}
        <div className="absolute w-20 h-20 rounded-full bg-orange-400 opacity-15 animate-pulse" />
        {/* Fire emoji */}
        <div style={{
          fontSize: "56px",
          animation: "roastBounce 0.8s ease-in-out infinite alternate",
        }}>
          🔥
        </div>
      </div>

      {/* Message */}
      <div
        style={{
          transition: "opacity 0.4s ease, transform 0.4s ease",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0px)" : "translateY(8px)",
        }}
        className="flex flex-col items-center space-y-3"
      >
        <span style={{ fontSize: "32px" }}>{current.emoji}</span>
        <p className="text-gray-700 font-semibold text-base text-center max-w-xs">
          {current.text}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {messages.map((_, i) => (
          <div
            key={i}
            style={{
              transition: "all 0.3s ease",
              width: i === currentIndex ? "20px" : "8px",
              height: "8px",
              borderRadius: "99px",
              background: i === currentIndex ? "#9333ea" : "#e5e7eb",
            }}
          />
        ))}
      </div>

      {/* Subtext */}
      <p className="text-gray-400 text-xs text-center">
        Our AI is being brutally honest. This takes ~15 seconds.
      </p>

      {/* Keyframe style */}
      <style>{`
        @keyframes roastBounce {
          from { transform: translateY(0px) rotate(-5deg); }
          to   { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default RoastLoader;