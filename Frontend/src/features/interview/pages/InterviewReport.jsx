import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { gsap } from "gsap";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { useInterview } from "../hooks/useInterview.js";

function severityStyle(severity) {
  if (severity === "high") return "bg-red-100 text-red-500 border-red-200";
  if (severity === "medium")
    return "bg-[#BA9B5F]/12 text-[#BA9B5F] border-[#BA9B5F]/20";
  return "bg-[#5E775E]/10 text-[#5E775E] border-[#5E775E]/20";
}

function scoreRingColor(score) {
  if (score >= 80) return "#5E775E";
  if (score >= 60) return "#BA9B5F";
  return "#e57373";
}

function scoreLabel(score) {
  if (score >= 80) return "Strong match for this role";
  if (score >= 60) return "Moderate match — prep needed";
  return "Low match — significant gaps";
}

function jobTitle(desc) {
  return desc?.split("\n")[0]?.slice(0, 60) || "Untitled";
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const SECTIONS = [
  { id: "technical", label: "Technical Questions", icon: "code" },
  { id: "behavioral", label: "Behavioral Questions", icon: "chat" },
  { id: "plan", label: "Road Map", icon: "map" },
];

function SectionIcon({ type }) {
  if (type === "code")
    return (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    );
  if (type === "chat")
    return (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    );
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  );
}

export default function InterviewReport() {
  const { user } = useAuth();
  const { currentReport, fetchReportById, loading, downloadPdf } =
    useInterview();
  const navigate = useNavigate();
  const { id } = useParams();
  const navRef = useRef();
  const contentRef = useRef();

  const [activeSection, setActiveSection] = useState("technical");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReportById(id);
    }
  }, [id]);

  useEffect(() => {
    if (!currentReport) return; // wait for data
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      navRef.current,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.6 },
    ).fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.3",
    );
  }, [currentReport]);

  if (loading || !currentReport) {
    return (
      <main className="min-h-screen bg-[#E9E0CF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#132B23]/20 border-t-[#BA9B5F] rounded-full animate-spin" />
          <p className="text-xs text-[#132B23]/40 uppercase tracking-widest font-medium">
            Loading report...
          </p>
        </div>
      </main>
    );
  }

  const handleDownload = async () => {
    await downloadPdf(id);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  const report = currentReport;

  // Score ring
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (report.matchScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#E9E0CF] flex flex-col">
      {/* ── Navbar ── */}
      <nav
        ref={navRef}
        className="opacity-0 w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-[#132B23]/8 bg-[#E9E0CF]/80 backdrop-blur-sm sticky top-0 z-20"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#132B23]/50 hover:text-[#132B23] bg-[#132B23]/5 hover:bg-[#132B23]/10 px-3 py-1.5 rounded-lg transition duration-200"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <span
            className="text-xl font-bold font-serif text-[#132B23] cursor-pointer"
            onClick={() => navigate("/")}
          >
            ifor<span className="text-[#5E775E]">ai</span>
          </span>
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

      {/* ── Body ── */}
      <div ref={contentRef} className="opacity-0 flex flex-1 overflow-hidden">
        {/* ── Left Sidebar — Sections ── */}
        <aside className="hidden md:flex w-52 lg:w-60 shrink-0 flex-col border-r border-[#132B23]/8 bg-[#E2D8C6] py-6 px-3">
          <p className="text-xs font-bold text-[#132B23]/35 uppercase tracking-widest px-3 mb-3">
            Sections
          </p>
          <div className="flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-200 ${
                  activeSection === s.id
                    ? "bg-[#132B23] text-[#E9E0CF]"
                    : "text-[#132B23]/50 hover:text-[#132B23] hover:bg-white/50"
                }`}
              >
                <SectionIcon type={s.icon} />
                {s.label}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Center — Main Content ── */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-8">
          {/* Mobile section tabs */}
          <div className="flex md:hidden gap-1 mb-6 bg-white/40 border border-[#132B23]/8 rounded-xl p-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex-1 text-xs font-semibold py-2 rounded-lg transition duration-200 ${
                  activeSection === s.id
                    ? "bg-[#132B23] text-[#E9E0CF]"
                    : "text-[#132B23]/40 hover:text-[#132B23]"
                }`}
              >
                {s.id === "technical"
                  ? "Technical"
                  : s.id === "behavioral"
                    ? "Behavioral"
                    : "Road Map"}
              </button>
            ))}
          </div>

          {/* Report header */}
          <div className="mb-7">
            <p className="text-xs text-[#132B23]/35 uppercase tracking-widest font-medium mb-1">
              Interview Report
            </p>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#132B23] leading-snug">
              {jobTitle(report.jobDescription)}
            </h1>
            <p className="text-xs text-[#132B23]/35 mt-1">
              Generated on {formatDate(report.createdAt)}
            </p>
          </div>

          {/* ── Technical Questions ── */}
          {activeSection === "technical" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#132B23]/40 font-medium">
                {report.technicalQuestions.length} questions tailored to this
                role
              </p>
              {report.technicalQuestions.map((q, i) => (
                <div
                  key={i}
                  className="bg-white/60 border border-[#132B23]/8 rounded-2xl p-5 sm:p-6 flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#132B23]/8 flex items-center justify-center text-xs font-bold text-[#132B23]">
                      {i + 1}
                    </span>
                    <p className="text-sm font-semibold text-[#132B23] leading-snug">
                      {q.question}
                    </p>
                  </div>
                  <div className="ml-9 flex flex-col gap-2">
                    <p className="text-xs text-[#5E775E] font-medium">
                      Why they ask: {q.intention}
                    </p>
                    <p className="text-xs text-[#132B23]/55 leading-relaxed border-l-2 border-[#BA9B5F]/40 pl-3">
                      {q.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Behavioral Questions ── */}
          {activeSection === "behavioral" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#132B23]/40 font-medium">
                {report.behavioralQuestions.length} behavioral questions for
                this role
              </p>
              {report.behavioralQuestions.map((q, i) => (
                <div
                  key={i}
                  className="bg-white/60 border border-[#132B23]/8 rounded-2xl p-5 sm:p-6 flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#132B23]/8 flex items-center justify-center text-xs font-bold text-[#132B23]">
                      {i + 1}
                    </span>
                    <p className="text-sm font-semibold text-[#132B23] leading-snug">
                      {q.question}
                    </p>
                  </div>
                  <div className="ml-9 flex flex-col gap-2">
                    <p className="text-xs text-[#5E775E] font-medium">
                      Why they ask: {q.intention}
                    </p>
                    <p className="text-xs text-[#132B23]/55 leading-relaxed border-l-2 border-[#BA9B5F]/40 pl-3">
                      {q.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Road Map ── */}
          {activeSection === "plan" && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-[#132B23]/40 font-medium mb-1">
                {report.preparationPlan.length}-day preparation plan
              </p>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-px bg-[#132B23]/10" />

                <div className="flex flex-col gap-4">
                  {report.preparationPlan.map((p, i) => (
                    <div key={p.day} className="flex items-start gap-4">
                      {/* Circle */}
                      <div className="shrink-0 w-10 h-10 rounded-full bg-[#E9E0CF] border-2 border-[#BA9B5F]/40 flex items-center justify-center z-10">
                        <span className="text-xs font-bold text-[#BA9B5F]">
                          {p.day}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 bg-white/60 border border-[#132B23]/8 rounded-2xl px-5 py-4">
                        <p className="text-xs font-bold text-[#132B23]/35 uppercase tracking-widest mb-1">
                          Day {p.day}
                        </p>
                        <p className="text-sm text-[#132B23]/70 leading-relaxed">
                          {p.focus}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ── Right Panel — Score + Skill Gaps ── */}
        <aside className="hidden lg:flex w-56 xl:w-64 shrink-0 flex-col border-l border-[#132B23]/8 bg-[#E2D8C6] py-6 px-4 gap-6">
          {/* Match Score */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-bold text-[#132B23]/35 uppercase tracking-widest self-start">
              Match Score
            </p>
            {/* SVG Ring */}
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#132B23"
                  strokeWidth="8"
                  strokeOpacity="0.08"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={scoreRingColor(report.matchScore)}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-serif text-[#132B23]">
                  {report.matchScore}
                </span>
                <span className="text-xs text-[#132B23]/40">%</span>
              </div>
            </div>
            <p
              className="text-xs font-semibold text-center"
              style={{ color: scoreRingColor(report.matchScore) }}
            >
              {scoreLabel(report.matchScore)}
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#132B23]/8" />

          {/* Skill Gaps */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-[#132B23]/35 uppercase tracking-widest">
              Skill Gaps
            </p>
            {/* TODO: Replace with report.skillGaps from API */}
            <div className="flex flex-col gap-2">
              {report.skillGaps.map((gap) => (
                <div
                  key={gap.skill}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold ${severityStyle(gap.severity)}`}
                >
                  <p className="leading-snug">{gap.skill}</p>
                  <p className="text-xs font-normal opacity-60 capitalize mt-0.5">
                    {gap.severity} priority
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={loading}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition duration-200 ${
              loading
                ? "bg-[#BA9B5F]/40 text-[#132B23]/40 cursor-not-allowed"
                : "bg-[#BA9B5F] hover:bg-[#a78a52] text-[#132B23] hover:scale-[1.02] active:scale-95"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {loading ? "Generating PDF..." : "Download Resume"}
          </button>
        </aside>
      </div>

      {/* ── Mobile Bottom — Score + Gaps ── */}
      <div className="lg:hidden border-t border-[#132B23]/8 bg-[#E2D8C6] px-4 py-5">
        <div className="flex items-center gap-6">
          {/* Score pill */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm font-serif text-[#132B23]"
              style={{ borderColor: scoreRingColor(report.matchScore) }}
            >
              {report.matchScore}
            </div>
            <div>
              <p className="text-xs font-bold text-[#132B23]/35 uppercase tracking-widest">
                Match
              </p>
              <p
                className="text-xs font-semibold"
                style={{ color: scoreRingColor(report.matchScore) }}
              >
                {scoreLabel(report.matchScore)}
              </p>
            </div>
          </div>
        </div>

        {/* Skill gaps horizontal scroll */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {report.skillGaps.map((gap) => (
            <span
              key={gap.skill}
              className={`shrink-0 px-3 py-1.5 rounded-lg border text-xs font-semibold ${severityStyle(gap.severity)}`}
            >
              {gap.skill}
            </span>
          ))}
        </div>

        {/* ── Download button — mobile ── */}
        <button
          onClick={handleDownload}
          disabled={loading}
          className={`mt-4 w-full flex items-center justify-center gap-2 text-xs font-semibold px-4 py-3 rounded-xl transition duration-200 ${
            loading
              ? "bg-[#BA9B5F]/40 text-[#132B23]/40 cursor-not-allowed"
              : "bg-[#BA9B5F] hover:bg-[#a78a52] text-[#132B23] active:scale-95"
          }`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {loading ? "Generating PDF..." : "Download Resume"}
        </button>
      </div>
    </div>
  );
}
