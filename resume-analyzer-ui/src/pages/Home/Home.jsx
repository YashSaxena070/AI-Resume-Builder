import DarkVeil from "../../components/Effects/DarkVeil";
import Hero from "../../components/Hero";
import Showcase from "../../components/Showcase";
import Testimonials from "../../components/Testimonials";
import Marquee from "../../components/Marquee";
import About from "../../components/About";
import Footer from "../../components/Footer";

const Home = () => {
  const movingTestimonials = [
    { text: "Landed a job at Amazon!", role: "SDE II", color: "text-blue-400" },
    { text: "Salary hiked by 40%", role: "Product Designer", color: "text-emerald-400" },
    { text: "Recruiters kept calling", role: "Marketing Lead", color: "text-purple-400" },
    { text: "Passed ATS instantly", role: "Data Analyst", color: "text-amber-400" },
    { text: "Best resume builder ever", role: "Frontend Dev", color: "text-pink-400" },
    { text: "Got hired in 2 weeks", role: "UX Researcher", color: "text-cyan-400" },
    { text: "Simple and effective", role: "Sales Manager", color: "text-rose-400" },
    { text: "The AI suggestions rock", role: "Content Strat", color: "text-indigo-400" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white font-sans overflow-x-hidden relative">
      {/* DarkVeil background for navbar + hero */}
      <div
        style={{
          width: "100%",
          height: "785px",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <DarkVeil />
      </div>

      {/* Marquee animation keyframes */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <Hero />
      
      {/* Floating Analyze Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <a 
          href="/analyze" 
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105"
        >
          <span>✨ Analyze Resume</span>
        </a>
      </div>

      <Showcase />
      <Testimonials />
      <Marquee items={movingTestimonials} />
      <Footer />
    </div>
  );
};

export default Home;

