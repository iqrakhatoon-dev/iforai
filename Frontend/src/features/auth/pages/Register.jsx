import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

export default function Register() {
  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();

  const cardRef = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
  if (loading || !cardRef.current) return;

  gsap.fromTo(
    cardRef.current,
    { opacity: 0, y: 60, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power4.out" }
  );
}, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate("/dashboard");
  };

  // for loading
  if (loading) {
    return (
      <main className="min-h-screen bg-[#e8e0d0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-[#2d3d2a] tracking-tight">
              ifor<span className="text-[#b8922a]">ai</span>
            </h1>
            <p className="text-xs tracking-[0.3em] text-[#7a6e5a] uppercase mt-1">
              Beat the bots. Land the interview.
            </p>
          </div>

          {/* Dots */}
          <div className="flex gap-2.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full animate-bounce"
                style={{
                  background: i === 1 ? "#2d3d2a" : "#b8922a",
                  animationDelay: `${i * 0.15}s`,
                  opacity: i === 2 ? 0.6 : 1,
                }}
              />
            ))}
          </div>

          {/* Label */}
          <p className="text-xs tracking-[0.2em] text-[#7a6e5a] uppercase animate-pulse">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#E9E0CF] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-[#BA9B5F]/20 rounded-full blur-3xl top-10 -left-20 animate-pulse" />

      <div className="absolute w-96 h-96 bg-[#5E775E]/20 rounded-full blur-3xl bottom-0 -right-20 animate-pulse" />

      <div
        ref={cardRef}
        className="w-full max-w-md backdrop-blur-lg bg-white/70 border border-white/40 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#132B23] font-serif">
            ifor<span className="text-[#5E775E]">ai</span>
          </h1>

          <p className="mt-2 text-[#5E775E] text-sm tracking-widest uppercase">
            Beat the bots. Land the interview.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-xs font-bold tracking-widest text-[#132B23] uppercase">
              Username
            </label>

            <input
              type="text"
              name="username"
              required
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="w-full bg-[#E9E0CF] border-2 border-[#5E775E]/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#BA9B5F]"
              placeholder="Enter Your Username"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold tracking-widest text-[#132B23] uppercase">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full bg-[#E9E0CF] border-2 border-[#5E775E]/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#BA9B5F]"
              placeholder="Enter Your Email"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold tracking-widest text-[#132B23] uppercase">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full bg-[#E9E0CF] border-2 border-[#5E775E]/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#BA9B5F]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#BA9B5F] hover:bg-[#a78a52] py-3 rounded-xl font-bold text-[#132B23] transition duration-300 hover:scale-[1.02] active:scale-95"
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-6 border-t pt-5 border-[#5E775E]/20">
          <p className="text-[#5E775E]">
            Already have an account?{" "}
            <a href="/login" className="font-bold text-[#132B23]">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
