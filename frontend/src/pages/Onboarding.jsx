// // src/pages/Onboarding.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import onboard1 from "../assets/onboarding1.svg";
// import onboard2 from "../assets/onboarding2.svg";
// import onboard3 from "../assets/onboarding3.svg";
// import logos from "../assets/logos.png";

// const slides = [
//   {
//     image: onboard1,
//     title: "Welcome to Shelfline",
//     desc: "Your shop, in your pocket. Track sales, manage stock, and grow your business from anywhere.",
//   },
//   {
//     image: onboard2,
//     title: "Manage Sales Efficiently",
//     desc: "Built for the hustle. Record sales, track stock, and know your numbers.",
//   },
//   {
//     image: onboard3,
//     title: "Grow Your Business",
//     desc: "Increase your work management & career development radically.",
//   },
// ];

// export default function Onboarding() {
//   const [slide, setSlide] = useState(0);
//   const navigate = useNavigate();
//   const isLast = slide === slides.length - 1;

// return (
//   <div className="min-h-screen bg-gradient-to-b from-brand-500 to-brand-700 flex flex-col lg:flex-row">

//     {/* Left panel — illustration, shown full screen on mobile, half on desktop */}
//     <div className="lg:flex-1 flex flex-col items-center justify-center px-8 py-12 text-white">
//       {/* Logo */}
//       <div className="flex items-center gap-2 mb-8 lg:mb-12">
//         <img src={logos} alt="logo" className="w-10 h-10 object-contain" />
//         <span className="text-xl font-black tracking-wide">Shelfline</span>
//       </div>

//       {/* Illustration */}
//       <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white/10 rounded-3xl flex items-center justify-center mb-8">
//         <span className="text-white/40 text-sm">Illustration</span>
//       </div>

//       {/* Text */}
//       <div className="text-center max-w-sm">
//         <h2 className="text-2xl lg:text-3xl font-bold mb-3">{slides[slide].title}</h2>
//         <p className="text-white/70 text-sm lg:text-base leading-relaxed">{slides[slide].desc}</p>
//       </div>

//       {/* Dots — visible on mobile only */}
//       <div className="flex gap-2 mt-6 lg:hidden">
//         {slides.map((_, i) => (
//           <div
//             key={i}
//             className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
//           />
//         ))}
//       </div>
//     </div>

//     {/* Right panel — actions, shown at bottom on mobile, right side on desktop */}
//     <div className="lg:w-96 lg:flex lg:flex-col lg:justify-center bg-white/5 lg:bg-white/10 lg:backdrop-blur-sm px-6 py-8 lg:px-10 lg:py-12 rounded-t-3xl lg:rounded-none">

//       {/* Dots — desktop only */}
//       <div className="hidden lg:flex gap-2 mb-8">
//         {slides.map((_, i) => (
//           <div
//             key={i}
//             className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
//           />
//         ))}
//       </div>

//       <div className="flex flex-col gap-3 w-full max-w-sm mx-auto lg:max-w-none">
//         {isLast ? (
//           <>
//             <button
//               onClick={() => navigate("/signup")}
//               className="w-full py-4 bg-white text-brand-600 font-bold rounded-2xl text-base hover:bg-gray-50 transition-colors"
//             >
//               Create Account
//             </button>
//             <button
//               onClick={() => navigate("/login")}
//               className="w-full py-4 border-2 border-white/60 text-white font-semibold rounded-2xl text-base hover:border-white transition-colors"
//             >
//               Sign In
//             </button>
//           </>
//         ) : (
//           <>
//             <button
//               onClick={() => setSlide(slide + 1)}
//               className="w-full py-4 bg-white text-brand-600 font-bold rounded-2xl text-base hover:bg-gray-50 transition-colors"
//             >
//               Next
//             </button>
//             <button
//               onClick={() => navigate("/login")}
//               className="w-full py-4 border-2 border-white/60 text-white font-semibold rounded-2xl text-base hover:border-white transition-colors"
//             >
//               Skip
//             </button>
//           </>
//         )}

//         {/* Already have account */}
//         <p className="text-white/60 text-sm text-center mt-2">
//           Already have an account?{" "}
//           <button
//             onClick={() => navigate("/login")}
//             className="text-white font-semibold underline"
//           >
//             Sign In
//           </button>
//         </p>
//       </div>
//     </div>
//   </div>
// );
// }










// src/pages/Onboarding.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import onboard1 from "../assets/onboarding1.svg";
import onboard2 from "../assets/onboarding2.svg";
import onboard3 from "../assets/onboarding3.svg";
import logos from "../assets/logos.png";

const slides = [
  {
    image: onboard1,
    title: "Welcome to Shelfline",
    desc: "Your shop, in your pocket. Track sales, manage stock, and grow your business from anywhere.",
  },
  {
    image: onboard2,
    title: "Manage Sales Efficiently",
    desc: "Built for the hustle. Record sales, track stock, and know your numbers — all in real time.",
  },
  {
    image: onboard3,
    title: "Grow Your Business",
    desc: "Increase your work management & career development radically with smart insights.",
  },
];

export default function Onboarding() {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();
  const isLast = slide === slides.length - 1;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-brand-500 to-brand-700 flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-sm flex flex-col items-center">

        {/* Logo */}
        <div className="flex items-center gap-2 self-start mb-10">
          <img src={logos} alt="logo" className="w-9 h-9 object-contain" />
          <span className="text-lg font-black text-white tracking-tight">Shelfline</span>
        </div>

        {/* Illustration */}
        <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-sm">
          <img
            src={slides[slide].image}
            alt={slides[slide].title}
            className="w-40 h-40 lg:w-52 lg:h-52 object-contain"
          />
        </div>

        {/* Heading + description */}
        <div className="text-center mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
            {slides[slide].title}
          </h2>
          <p className="text-sm lg:text-base text-white/70 leading-relaxed">
            {slides[slide].desc}
          </p>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5 mb-6">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slide ? "w-6 bg-white" : "w-1.5 bg-white/35"
              }`}
            />
          ))}
        </div>

        {/* Skip / Next — below dots */}
        {isLast ? (
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => navigate("/signup")}
              className="w-full py-4 bg-white text-brand-600 font-bold rounded-2xl text-sm hover:bg-gray-50 active:scale-95 transition-all"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-4 border-2 border-white/50 text-white font-semibold rounded-2xl text-sm hover:border-white active:scale-95 transition-all"
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between px-1">
            <button
              onClick={() => navigate("/login")}
              className="text-white/60 text-sm font-medium hover:text-white transition-colors py-2"
            >
              Skip
            </button>
            <button
              onClick={() => setSlide(slide + 1)}
              className="text-white text-sm font-bold hover:text-white/80 transition-colors py-2 flex items-center gap-1"
            >
              Next
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 8h6M8 5l3 3-3 3" />
              </svg>
            </button>
          </div>
        )}
        </div>
    </div>
  );
}