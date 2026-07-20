import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { gsap } from "gsap";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { useInterview } from "../hooks/useInterview.js";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function scoreColor(score) {
  if (score >= 80) return "text-[#5E775E]";
  if (score >= 60) return "text-[#BA9B5F]";
  return "text-red-400";
}

function jobTitle(title, desc) {
  // TODO: jab backend mein title add ho jaye tab sirf title use karo
  return title || desc?.split("\n")[0]?.slice(0, 40) || "Untitled";
}

export default function Dashboard() {
  const { user } = useAuth();
  const { reports, loading, error: contextError, generateReport, fetchAllReports } = useInterview();
  const navigate = useNavigate();
  const navRef = useRef();
  const formRef = useRef();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // ── Fetch all reports on mount ──
  useEffect(() => {
    fetchAllReports();
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(navRef.current,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.6 }
    )
    .fromTo(formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 }, "-=0.3"
    );
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") setResumeFile(file);
  };

  // ── Real submit ──
  const handleSubmit = async () => {
    setError("");
    if (!jobDescription.trim()) { setError("Job description is required."); return; }
    if (!resumeFile && !selfDescription.trim()) { setError("Upload a resume or add a self description."); return; }

    setIsGenerating(true);
    const report = await generateReport({ jobDescription, selfDescription, resumeFile });
    setIsGenerating(false);

    if (report) {
      navigate(`/dashboard/report/${report._id}`);
    } else {
      setError(contextError || "Failed to generate report. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#E9E0CF] flex flex-col">

      {/* ── Navbar ── */}
      <nav
        ref={navRef}
        className="opacity-0 w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-[#132B23]/8 bg-[#E9E0CF]/80 backdrop-blur-sm sticky top-0 z-20"
      >
        <div className="flex items-center gap-3">
          <span
            className="text-xl font-bold font-serif text-[#132B23] cursor-pointer"
            onClick={() => navigate("/")}
          >
            ifor<span className="text-[#5E775E]">ai</span>
          </span>
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#132B23]/50 hover:text-[#132B23] bg-[#132B23]/5 hover:bg-[#132B23]/10 px-3 py-1.5 rounded-lg transition duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
            History
            {/* Report count badge */}
            {reports.length > 0 && (
              <span className="bg-[#132B23] text-[#E9E0CF] text-xs rounded-full px-1.5 py-0.5 leading-none">
                {reports.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-[#132B23]/50 font-medium hidden sm:block">
            {user?.username}
          </span>
          <div className="w-8 h-8 rounded-full bg-[#132B23] flex items-center justify-center text-[#E9E0CF] text-xs font-bold select-none shrink-0">
            {user?.username?.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </nav>

      {/* ── History Drawer ── */}
      {historyOpen && (
        <div className="fixed inset-0 bg-black/20 z-30" onClick={() => setHistoryOpen(false)} />
      )}

      <div className={`
        fixed top-0 left-0 h-full w-72 bg-[#E2D8C6] z-40 flex flex-col
        border-r border-[#132B23]/8 shadow-xl
        transition-transform duration-300 ease-in-out
        ${historyOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#132B23]/8">
          <p className="text-xs font-bold text-[#132B23]/40 uppercase tracking-widest">
            Past Reports
          </p>
          <button
            onClick={() => setHistoryOpen(false)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#132B23]/8 transition"
          >
            <svg className="w-4 h-4 text-[#132B23]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {/* Loading state */}
          {loading && reports.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <div className="w-5 h-5 border-2 border-[#132B23]/20 border-t-[#BA9B5F] rounded-full animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!loading && reports.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <p className="text-xs text-[#132B23]/30 text-center">No reports yet.</p>
            </div>
          )}

          {/* Real reports list */}
          {reports.length > 0 && (
            <div className="flex flex-col gap-1">
              {reports.map((r) => (
                <button
                  key={r._id}
                  onClick={() => {
                    navigate(`/dashboard/report/${r._id}`);
                    setHistoryOpen(false);
                  }}
                  className="w-full text-left px-3 py-3 rounded-xl hover:bg-white/60 transition duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-[#132B23] leading-snug line-clamp-2 flex-1">
                      {jobTitle(r.title, r.jobDescription)}
                    </p>
                    <span className={`text-xs font-bold shrink-0 ${scoreColor(r.matchScore)}`}>
                      {r.matchScore}%
                    </span>
                  </div>
                  <p className="text-xs text-[#132B23]/30 mt-1">
                    {formatDate(r.createdAt)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Main Form ── */}
      <main className="flex-1 px-4 sm:px-8 lg:px-16 py-8 sm:py-10 overflow-y-auto">
        <div ref={formRef} className="opacity-0 max-w-4xl mx-auto">

          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#132B23]">
              Generate Interview Report
            </h1>
            <p className="text-sm text-[#132B23]/45 mt-1.5">
              Paste the job description, upload your resume, and let AI build your prep plan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Job Description */}
            <div className="bg-white/60 border border-[#132B23]/8 rounded-2xl p-5 flex flex-col gap-3 lg:row-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#132B23] uppercase tracking-widest">Job Description</label>
                <span className="text-xs text-[#132B23]/30 bg-[#132B23]/5 px-2 py-0.5 rounded-md font-medium">Required</span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={12}
                maxLength={5000}
                placeholder={`Paste the full job description here...\n\ne.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript..."`}
                className="flex-1 w-full bg-[#E9E0CF]/60 border border-[#132B23]/8 rounded-xl px-4 py-3 text-sm text-[#132B23] placeholder-[#132B23]/25 focus:outline-none focus:border-[#5E775E]/40 resize-none leading-relaxed"
              />
              <p className="text-xs text-[#132B23]/25 text-right">{jobDescription.length} / 5000</p>
            </div>

            {/* Resume Upload */}
            <div className="bg-white/60 border border-[#132B23]/8 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#132B23] uppercase tracking-widest">Upload Resume</label>
                <span className="text-xs text-[#5E775E] bg-[#5E775E]/10 px-2 py-0.5 rounded-md font-medium">Best Results</span>
              </div>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("resumeInput").click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition duration-200 ${
                  isDragging ? "border-[#5E775E]/60 bg-[#5E775E]/5"
                  : resumeFile ? "border-[#5E775E]/40 bg-[#5E775E]/5"
                  : "border-[#132B23]/12 hover:border-[#132B23]/25 hover:bg-white/30"
                }`}
              >
                {resumeFile ? (
                  <>
                    <svg className="w-5 h-5 text-[#5E775E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs font-semibold text-[#5E775E] text-center break-all px-2">{resumeFile.name}</p>
                    <button onClick={(e) => { e.stopPropagation(); setResumeFile(null); }} className="text-xs text-[#132B23]/35 hover:text-[#132B23]/60 transition">Remove</button>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-[#132B23]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-xs text-[#132B23]/40 text-center">
                      Click to upload or drag & drop<br />
                      <span className="text-[#132B23]/25">PDF only · Max 5MB</span>
                    </p>
                  </>
                )}
              </div>
              <input id="resumeInput" type="file" accept="application/pdf" className="hidden" onChange={(e) => setResumeFile(e.target.files[0])} />
            </div>

            {/* Self Description */}
            <div className="bg-white/60 border border-[#132B23]/8 rounded-2xl p-5 flex flex-col gap-3">
              <label className="text-xs font-bold text-[#132B23] uppercase tracking-widest">Self Description</label>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                rows={4}
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume..."
                className="w-full bg-[#E9E0CF]/60 border border-[#132B23]/8 rounded-xl px-4 py-3 text-sm text-[#132B23] placeholder-[#132B23]/25 focus:outline-none focus:border-[#5E775E]/40 resize-none leading-relaxed"
              />
              <p className="text-xs text-[#132B23]/30 bg-[#5E775E]/5 border border-[#5E775E]/15 rounded-lg px-3 py-2">
                Either a resume <strong>or</strong> a self description is required.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && <p className="mt-4 text-xs text-red-500 font-medium">{error}</p>}

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-5">
            <p className="text-xs text-[#132B23]/30">AI-powered · Takes ~30 seconds</p>
            <button
              onClick={handleSubmit}
              disabled={isGenerating}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-sm px-8 py-3.5 rounded-xl transition duration-200 ${
                isGenerating
                  ? "bg-[#BA9B5F]/40 text-[#132B23]/40 cursor-not-allowed"
                  : "bg-[#BA9B5F] hover:bg-[#a78a52] text-[#132B23] hover:scale-[1.02] active:scale-95"
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate Report"
              )}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}