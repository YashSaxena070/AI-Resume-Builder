import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { analyzeResume, resetAnalysis } from "../redux/atsSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertTriangle, Wrench, RefreshCw, Loader2, X } from "lucide-react";
import DarkVeil from "../components/Effects/DarkVeil";

const ResumeAnalyzer = () => {
  const dispatch = useDispatch();
  const { isLoading, atsScore, strengths, gaps, fixes, error } = useSelector((state) => state.ats);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const handleUpload = (uploadedFile) => {
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setFileUrl(URL.createObjectURL(uploadedFile));
    
    const formData = new FormData();
    formData.append("file", uploadedFile);
    dispatch(analyzeResume(formData));
  };

  const handleReset = () => {
    setFile(null);
    setFileUrl(null);
    dispatch(resetAnalysis());
  };

  // Score Color Logic
  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const getScoreRingColor = (score) => {
    if (score >= 80) return "stroke-emerald-500";
    if (score >= 60) return "stroke-amber-500";
    return "stroke-rose-500";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <DarkVeil />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Resume Vibe Check
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            See how your resume stacks up against ATS algorithms. Get instant feedback on strengths, gaps, and fixes.
          </p>
        </motion.div>

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto">
          
          {/* Upload Section */}
          {!isLoading && !atsScore && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-12 text-center border-dashed border-2 hover:border-blue-500/50 transition-all group cursor-pointer relative"
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleUpload(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="bg-blue-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Upload your Resume</h3>
              <p className="text-slate-400">Drag & drop or click to browse (PDF only)</p>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-16 h-16 text-blue-500" />
              </motion.div>
              <p className="mt-6 text-xl text-slate-300 animate-pulse">Analyzing your vibe...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-center"
            >
              {error}
              <button onClick={handleReset} className="block mx-auto mt-4 text-sm underline">Try Again</button>
            </motion.div>
          )}

        </div>
      </div>

          {/* Results Modal */}
      <AnimatePresence>
        {atsScore !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 w-full h-full max-w-7xl rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-slate-800"
            >
              {/* Left Side: PDF Preview */}
              <div className="w-full md:w-1/2 bg-slate-800/50 p-4 border-r border-slate-800 flex flex-col">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {file?.name}
                  </h3>
                </div>
                <div className="flex-1 bg-slate-950 rounded-xl overflow-hidden relative">
                  {fileUrl ? (
                    <object
                      data={fileUrl}
                      type="application/pdf"
                      className="w-full h-full"
                    >
                      <div className="flex flex-col items-center justify-center h-full text-slate-500 p-4 text-center">
                        <p className="mb-2">Unable to display PDF directly.</p>
                        <a 
                          href={fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          Click here to view/download
                        </a>
                      </div>
                    </object>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      No PDF Preview Available
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Analysis Results */}
              <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 backdrop-blur z-10">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
                    <p className="text-slate-400 text-sm">Here's how you can improve</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <button 
                      onClick={handleReset}
                      className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                      title="Close & Reset"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                {atsScore === 0 ? (
                   <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                      <div className="bg-rose-500/10 p-6 rounded-full mb-6">
                        <AlertTriangle className="w-16 h-16 text-rose-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Invalid Resume Detected</h3>
                      <p className="text-slate-400 max-w-md mb-8">
                        The uploaded file does not appear to be a valid professional resume. Please upload a proper resume PDF to get an analysis.
                      </p>
                      <button 
                        onClick={handleReset}
                        className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold transition-colors"
                      >
                        Try Again
                      </button>
                   </div>
                ) : (
                /* Scrollable Content */
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                  
                  {/* Score Section */}
                  <div className="flex items-center gap-6 bg-slate-800/30 p-6 rounded-2xl border border-slate-800">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                        <circle
                          cx="48" cy="48" r="40"
                          stroke="currentColor" strokeWidth="8"
                          fill="transparent" strokeLinecap="round"
                          className={getScoreRingColor(atsScore)}
                          strokeDasharray={251}
                          strokeDashoffset={251 - (251 * atsScore) / 100}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getScoreColor(atsScore)}`}>{atsScore}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">ATS Score</h3>
                      <p className="text-slate-400 text-sm">
                        {atsScore >= 80 ? "Excellent! Your resume is well-optimized." : 
                         atsScore >= 60 ? "Good start, but there's room for improvement." : 
                         "Needs attention. Follow the fixes below."}
                      </p>
                    </div>
                  </div>

                  {/* Fixes (Priority) */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-blue-400" />
                      Recommended Fixes
                    </h3>
                    <div className="space-y-3">
                      {fixes.map((item, i) => (
                        <div key={i} className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
                          <span className="mt-1 w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                          <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
                        </div>
                      ))}
                      {fixes.length === 0 && <p className="text-slate-500 italic">No critical fixes needed!</p>}
                    </div>
                  </div>

                  {/* Gaps */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      Identified Gaps
                    </h3>
                    <div className="space-y-3">
                      {gaps.map((item, i) => (
                        <div key={i} className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3">
                          <span className="mt-1 w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                          <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
                        </div>
                      ))}
                      {gaps.length === 0 && <p className="text-slate-500 italic">No gaps found!</p>}
                    </div>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      Your Strengths
                    </h3>
                    <div className="space-y-3">
                      {strengths.map((item, i) => (
                        <div key={i} className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex gap-3">
                          <span className="mt-1 w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                          <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
                        </div>
                      ))}
                      {strengths.length === 0 && <p className="text-slate-500 italic">Keep improving!</p>}
                    </div>
                  </div>

                </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeAnalyzer;
