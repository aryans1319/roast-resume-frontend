import { useState } from "react";
import UploadForm from "./components/UploadForm";
import RoastResult from "./components/RoastResult";
import { roastResume } from "./services/api";

const App = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (resumeFile, jobDescription) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await roastResume(resumeFile, jobDescription);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 mb-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-black text-gray-800">
            🔥 RoastMyResume
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Brutally honest AI feedback on your resume. No sugarcoating.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-16">
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 
            rounded-xl p-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {result ? (
          <RoastResult data={result} onReset={handleReset} />
        ) : (
          <UploadForm onSubmit={handleSubmit} isLoading={isLoading} />
        )}
      </div>

    </div>
  );
};

export default App;