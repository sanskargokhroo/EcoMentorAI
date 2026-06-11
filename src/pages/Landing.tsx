import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Landing: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 selection:bg-green-500 selection:text-white font-sans">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.8; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.2); }
        }
        @keyframes slow-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes footprint-fade {
          0% { opacity: 0; transform: translateY(20px) scale(0.8); }
          20% { opacity: 0.15; transform: translateY(0px) scale(1); }
          80% { opacity: 0.15; transform: translateY(-40px) scale(1.1); }
          100% { opacity: 0; transform: translateY(-60px) scale(1.2); }
        }
        @keyframes flutter-wings {
          0%, 100% { transform: rotateY(0deg) rotateZ(5deg); }
          50% { transform: rotateY(70deg) rotateZ(-5deg); }
        }
        @keyframes fly-random-1 {
          0% { transform: translate(-10vw, 60vh) scale(0.6); opacity: 0; }
          15% { opacity: 0.7; transform: translate(15vw, 20vh) scale(0.8); }
          35% { transform: translate(40vw, 50vh) scale(0.7); }
          65% { transform: translate(70vw, 10vh) scale(0.9); }
          85% { opacity: 0.7; transform: translate(90vw, 40vh) scale(0.7); }
          100% { transform: translate(110vw, 20vh) scale(0.6); opacity: 0; }
        }
        @keyframes fly-random-2 {
          0% { transform: translate(110vw, 15vh) scale(0.5) scaleX(-1); opacity: 0; }
          25% { opacity: 0.6; transform: translate(75vw, 65vh) scale(0.7) scaleX(-1); }
          50% { transform: translate(45vw, 25vh) scale(0.6) scaleX(-1); }
          75% { opacity: 0.6; transform: translate(20vw, 75vh) scale(0.8) scaleX(-1); }
          100% { transform: translate(-10vw, 35vh) scale(0.5) scaleX(-1); opacity: 0; }
        }
        @keyframes fly-random-3 {
          0% { transform: translate(30vw, 110vh) scale(0.7); opacity: 0; }
          25% { opacity: 0.8; transform: translate(15vw, 70vh) scale(0.9); }
          50% { transform: translate(50vw, 40vh) scale(0.7); }
          75% { opacity: 0.8; transform: translate(75vw, 15vh) scale(0.8); }
          100% { transform: translate(90vw, -10vh) scale(0.7); opacity: 0; }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-spin-slow { animation: slow-spin 24s linear infinite; }
        
        .animate-footprint-1 { animation: footprint-fade 8s infinite linear 0s; }
        .animate-footprint-2 { animation: footprint-fade 9s infinite linear 2s; }
        .animate-footprint-3 { animation: footprint-fade 7s infinite linear 4s; }
        .animate-footprint-4 { animation: footprint-fade 10s infinite linear 1s; }
        .animate-footprint-5 { animation: footprint-fade 8s infinite linear 5s; }
        
        .animate-bird-1 { animation: fly-random-1 25s ease-in-out infinite 0s; }
        .animate-bird-2 { animation: fly-random-2 30s ease-in-out infinite 5s; }
        .animate-bird-3 { animation: fly-random-3 22s ease-in-out infinite 10s; }

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .dark .glass-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Beautiful deep curve for sections */
        .curved-top {
          clip-path: ellipse(150% 100% at 50% 100%);
        }
        .curved-bottom {
          clip-path: ellipse(150% 100% at 50% 0%);
        }
      `}</style>

      {/* HERO SECTION - Immersive Nature Theme */}
      <section className="relative w-full min-h-[95vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-950 via-emerald-900 to-green-800 pb-20">
        
        {/* Background Overlay Pattern (Subtle Leaves) */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%2322c55e\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}>
        </div>

        {/* Flying Butterflies Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 perspective-[1000px]">
          <div className="absolute top-0 left-0 text-5xl animate-bird-1">
            <div className="animate-[flutter-wings_0.2s_ease-in-out_infinite]">🦋</div>
          </div>
          <div className="absolute top-0 left-0 text-4xl animate-bird-2">
            <div className="animate-[flutter-wings_0.3s_ease-in-out_infinite]">🦋</div>
          </div>
          <div className="absolute top-0 left-0 text-6xl animate-bird-3">
            <div className="animate-[flutter-wings_0.25s_ease-in-out_infinite]">🦋</div>
          </div>
        </div>

        {/* Floating Footprints Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-[10%] bottom-[10%] text-green-400/20 text-6xl animate-footprint-1">👣</div>
          <div className="absolute left-[30%] bottom-[20%] text-green-400/20 text-5xl animate-footprint-2">👣</div>
          <div className="absolute right-[20%] bottom-[15%] text-emerald-300/20 text-7xl animate-footprint-3">👣</div>
          <div className="absolute right-[40%] bottom-[5%] text-green-500/20 text-6xl animate-footprint-4">👣</div>
          <div className="absolute left-[50%] bottom-[30%] text-emerald-400/20 text-4xl animate-footprint-5">👣</div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-12 mb-16">
          <div className="mb-8 flex justify-center animate-glow">
            {/* Earth showing Asia/India */}
            <div className="origin-center">
              <span className="text-[120px] sm:text-[140px] leading-none drop-shadow-[0_0_50px_rgba(34,197,94,0.8)] block">🌏</span>
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-green-200 tracking-tight leading-tight mb-6 drop-shadow-lg">
            {t('landing.hero.title')}
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl sm:text-3xl text-green-100 font-light leading-relaxed mb-12 drop-shadow-md">
            {t('landing.hero.subtitle')}
          </p>
          
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>
            <Link
              to="/calculate"
              className="relative inline-flex items-center justify-center px-10 py-5 text-xl font-extrabold text-green-950 bg-white hover:bg-green-50 rounded-full shadow-2xl transition-transform transform group-hover:scale-105"
            >
              <span className="mr-3 text-2xl">🌱</span>
              {t('landing.hero.cta')}
              <svg className="ml-2 w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Beautiful Deep SVG Curve at the bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
          <svg className="relative block w-full h-[100px] md:h-[200px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" d="M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,213.3C672,235,768,245,864,224C960,203,1056,149,1152,138.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" className="text-gray-50 dark:text-gray-900"></path>
          </svg>
        </div>
      </section>

      {/* WHY ACT NOW SECTION */}
      <section className="py-24 px-4 relative z-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            {t('landing.why.title')}
          </h2>
          <p className="text-2xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
            {t('landing.why.desc')}
          </p>
        </div>
      </section>

      {/* THE COST OF INACTION - Dramatic Dark Red Section */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden shadow-2xl curved-top">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto pt-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              {t('landing.consequences.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
            <div className="glass-card p-10 rounded-3xl border-red-500/30 hover:border-red-500/60 hover:-translate-y-2 transition-all duration-300 group">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">🌪️</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('landing.consequences.1.title')}
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {t('landing.consequences.1.desc')}
              </p>
            </div>

            <div className="glass-card p-10 rounded-3xl border-red-500/30 hover:border-red-500/60 hover:-translate-y-2 transition-all duration-300 group">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(0,150,255,0.5)]">🌊</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('landing.consequences.2.title')}
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {t('landing.consequences.2.desc')}
              </p>
            </div>

            <div className="glass-card p-10 rounded-3xl border-red-500/30 hover:border-red-500/60 hover:-translate-y-2 transition-all duration-300 group">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(255,255,0,0.5)]">☠️</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('landing.consequences.3.title')}
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {t('landing.consequences.3.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID - Glassmorphism over Nature with Curved Top */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-green-800 to-emerald-950 overflow-hidden curved-top -mt-20">
        {/* Subtle Nature Background Elements */}
        <div className="absolute top-[0%] right-[-5%] text-[30rem] opacity-5 pointer-events-none rotate-45">🌿</div>
        <div className="absolute bottom-[-10%] left-[-5%] text-[30rem] opacity-5 pointer-events-none -rotate-12">🌳</div>
        
        <div className="relative z-10 max-w-7xl mx-auto pt-20">
          <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-20 drop-shadow-md">
            {t('landing.features.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:bg-white/10 transition-all duration-300">
              <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-green-400/30">
                <span className="text-4xl" role="img" aria-label="Robot">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t('landing.features.ai.title')}
              </h3>
              <p className="text-green-100/80 leading-relaxed text-lg">
                {t('landing.features.ai.desc')}
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:bg-white/10 transition-all duration-300">
              <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-blue-400/30">
                <span className="text-4xl" role="img" aria-label="Chart">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t('landing.features.dashboard.title')}
              </h3>
              <p className="text-green-100/80 leading-relaxed text-lg">
                {t('landing.features.dashboard.desc')}
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:bg-white/10 transition-all duration-300">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-yellow-400/30">
                <span className="text-4xl" role="img" aria-label="Trophy">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t('landing.features.challenges.title')}
              </h3>
              <p className="text-green-100/80 leading-relaxed text-lg">
                {t('landing.features.challenges.desc')}
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:bg-white/10 transition-all duration-300">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-emerald-400/30">
                <span className="text-4xl" role="img" aria-label="Tree">🌳</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t('landing.features.tree.title')}
              </h3>
              <p className="text-green-100/80 leading-relaxed text-lg">
                {t('landing.features.tree.desc')}
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:bg-white/10 transition-all duration-300">
              <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-purple-400/30">
                <span className="text-4xl" role="img" aria-label="Scanner">📱</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t('landing.features.scanner.title')}
              </h3>
              <p className="text-green-100/80 leading-relaxed text-lg">
                {t('landing.features.scanner.desc')}
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:bg-white/10 transition-all duration-300">
              <div className="w-20 h-20 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-orange-400/30">
                <span className="text-4xl" role="img" aria-label="Target">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t('landing.features.offset.title')}
              </h3>
              <p className="text-green-100/80 leading-relaxed text-lg">
                {t('landing.features.offset.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL VISION / CTA */}
      <section className="py-32 px-4 bg-gray-50 dark:bg-gray-900 text-center relative overflow-hidden curved-top -mt-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 dark:bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto pt-10">
          <div className="text-6xl mb-8 animate-float">🦋</div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-8">
            {t('landing.future.title')}
          </h2>
          <p className="text-2xl text-gray-600 dark:text-gray-400 leading-relaxed mb-12">
            {t('landing.future.desc')}
          </p>
          
          <div className="relative inline-block group">
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-green-600 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-500"></div>
            <Link
              to="/calculate"
              className="relative inline-flex items-center justify-center px-12 py-6 text-2xl font-extrabold text-white bg-gray-900 dark:bg-black rounded-full hover:scale-105 transition-transform duration-300 border-2 border-transparent hover:border-green-400"
            >
              <span className="mr-3">👣</span>
              Start Your Green Journey
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
