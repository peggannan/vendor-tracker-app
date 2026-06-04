// src/pages/Onboarding.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import onboard1 from "../assets/onboarding1.svg";
import onboard2 from "../assets/onboarding2.svg";
import onboard3 from "../assets/onboarding3.svg";
import logo from "../assets/logo.svg";

const slides = [
  {
    image: onboard1,
    title: "Welcome to Shelfline",
    desc: "Your shop, in your pocket. Track sales, manage stock, and grow your business from anywhere.",
  },
  {
    image: onboard2,
    title: "Manage Sales Efficiently",
    desc: "Built for the hustle. Record sales, track stock, and know your numbers.",
  },
  {
    image: onboard3,
    title: "Grow Your Business",
    desc: "Increase your work management & career development radically.",
  },
];

export default function Onboarding() {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();
  const isLast = slide === slides.length - 1;

return (
  <div className="min-h-screen bg-gradient-to-b from-brand-500 to-brand-700 flex flex-col lg:flex-row">

    {/* Left panel — illustration, shown full screen on mobile, half on desktop */}
    <div className="lg:flex-1 flex flex-col items-center justify-center px-8 py-12 text-white">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 lg:mb-12">
        <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
        <span className="text-xl font-black tracking-wide">Shelfy</span>
      </div>

      {/* Illustration */}
      <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white/10 rounded-3xl flex items-center justify-center mb-8">
        <span className="text-white/40 text-sm">Illustration</span>
      </div>

      {/* Text */}
      <div className="text-center max-w-sm">
        <h2 className="text-2xl lg:text-3xl font-bold mb-3">{slides[slide].title}</h2>
        <p className="text-white/70 text-sm lg:text-base leading-relaxed">{slides[slide].desc}</p>
      </div>

      {/* Dots — visible on mobile only */}
      <div className="flex gap-2 mt-6 lg:hidden">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
          />
        ))}
      </div>
    </div>

    {/* Right panel — actions, shown at bottom on mobile, right side on desktop */}
    <div className="lg:w-96 lg:flex lg:flex-col lg:justify-center bg-white/5 lg:bg-white/10 lg:backdrop-blur-sm px-6 py-8 lg:px-10 lg:py-12 rounded-t-3xl lg:rounded-none">

      {/* Dots — desktop only */}
      <div className="hidden lg:flex gap-2 mb-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm mx-auto lg:max-w-none">
        {isLast ? (
          <>
            <button
              onClick={() => navigate("/signup")}
              className="w-full py-4 bg-white text-brand-600 font-bold rounded-2xl text-base hover:bg-gray-50 transition-colors"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-4 border-2 border-white/60 text-white font-semibold rounded-2xl text-base hover:border-white transition-colors"
            >
              Sign In
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setSlide(slide + 1)}
              className="w-full py-4 bg-white text-brand-600 font-bold rounded-2xl text-base hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-4 border-2 border-white/60 text-white font-semibold rounded-2xl text-base hover:border-white transition-colors"
            >
              Skip
            </button>
          </>
        )}

        {/* Already have account */}
        <p className="text-white/60 text-sm text-center mt-2">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-white font-semibold underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  </div>
);
}