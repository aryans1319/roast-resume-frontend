import { useState } from "react";

const UploadForm = ({ onSubmit, isLoading }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleSubmit = () => {
    if (!resumeFile || !jobDescription.trim()) return;
    onSubmit(resumeFile, jobDescription);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* PDF Upload */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
          ${dragOver ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400"}`}
        onClick={() => document.getElementById("resumeInput").click()}
      >
        <input
          id="resumeInput"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => setResumeFile(e.target.files[0])}
        />
        {resumeFile ? (
          <div className="space-y-1">
            <p className="text-2xl">✅</p>
            <p className="font-semibold text-gray-700">{resumeFile.name}</p>
            <p className="text-sm text-gray-400">Click to change</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-4xl">📄</p>
            <p className="font-semibold text-gray-600">Drop your resume here</p>
            <p className="text-sm text-gray-400">PDF only, max 5MB</p>
          </div>
        )}
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Paste the Job Description
        </label>
        <textarea
          rows={6}
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-4 text-sm text-gray-700 
            focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!resumeFile || !jobDescription.trim() || isLoading}
        className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all
          ${!resumeFile || !jobDescription.trim() || isLoading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700 active:scale-95"}`}
      >
        {isLoading ? "Roasting your resume... 🔥" : "Roast My Resume 🔥"}
      </button>
    </div>
  );
};

export default UploadForm;