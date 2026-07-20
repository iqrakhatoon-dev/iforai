import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { gsap } from "gsap";

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef();
  const navRef = useRef();
  const featuresRef = useRef();

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7 }
    )
    .fromTo(heroRef.current.children,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 }, "-=0.3"
    )
    .fromTo(featuresRef.current.children,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.2"
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#E9E0CF] flex flex-col">

      {/* Nav */}
      <nav
        ref={navRef}
        className="opacity-0 w-full px-8 py-6 flex items-center justify-between"
      >
        <span className="text-xl font-bold font-serif text-[#132B23]">
          ifor<span className="text-[#5E775E]">ai</span>
        </span>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-[#132B23]/60 hover:text-[#132B23] transition duration-200 font-medium"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="text-sm font-semibold bg-[#132B23] text-[#E9E0CF] px-5 py-2.5 rounded-lg hover:bg-[#1e3d2f] transition duration-200"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center px-8 sm:px-16 lg:px-24 py-12">
        <div
          ref={heroRef}
          className="max-w-2xl flex flex-col gap-7"
        >
          <p className="opacity-0 text-xs font-semibold tracking-[0.2em] text-[#5E775E] uppercase">
            AI Resume Builder
          </p>

          <h1 className="opacity-0 text-5xl sm:text-6xl lg:text-7xl font-bold font-serif text-[#132B23] leading-[1.1]">
            Beat the bots.<br />
            Land the<br />
            <span className="text-[#BA9B5F]">interview.</span>
          </h1>

          <p className="opacity-0 text-[#132B23]/55 text-base sm:text-lg leading-relaxed max-w-sm">
            Upload your resume. Get a full AI analysis, spot skill gaps, and
            download an ATS-ready version in minutes.
          </p>

          <div className="opacity-0 flex items-center gap-4 pt-2">
            <button
              onClick={() => navigate("/register")}
              className="bg-[#BA9B5F] hover:bg-[#a78a52] text-[#132B23] font-bold px-7 py-3.5 rounded-lg transition duration-200 hover:scale-[1.02] active:scale-95 text-sm"
            >
              Create account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-[#132B23]/70 hover:text-[#132B23] font-semibold text-sm transition duration-200 underline underline-offset-4 decoration-[#132B23]/20 hover:decoration-[#132B23]/50"
            >
              Already have an account
            </button>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="px-8 sm:px-16 lg:px-24 py-12 border-t border-[#132B23]/8">
        <div
          ref={featuresRef}
          className="flex flex-col sm:flex-row gap-10 sm:gap-0 sm:divide-x divide-[#132B23]/10"
        >
          {[
            { label: "Resume Parsing", desc: "Skills and experience extracted instantly" },
            { label: "Skill Gap Detection", desc: "Know exactly what's missing for your target role" },
            { label: "ATS Optimized Output", desc: "PDF resumes that actually pass screening" },
          ].map((f) => (
            <div key={f.label} className="opacity-0 flex flex-col gap-1.5 sm:px-10 first:pl-0 last:pr-0">
              <h3 className="text-sm font-bold text-[#132B23]">{f.label}</h3>
              <p className="text-xs text-[#132B23]/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}