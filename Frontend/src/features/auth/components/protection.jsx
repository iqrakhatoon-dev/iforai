import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Protection = ({ children }) => {
  const { loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

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

  if (!user) {
    return null; 
  }

  return children;
};

export default Protection;
