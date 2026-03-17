'use client';

import Link from 'next/link';

export default function SplashPage() {
  return (
    <div className="relative min-h-screen bg-[#0f1117] flex flex-col items-center justify-center overflow-hidden">
      <style>{`
        @keyframes particleUp {
          0% { transform: translateY(80px) scale(0.3); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-80px) scale(1.2); opacity: 0; }
        }
        @keyframes particleDown {
          0% { transform: translateY(-80px) scale(0.3); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(80px) scale(1.2); opacity: 0; }
        }
        @keyframes burst {
          0% { transform: scale(0.5); opacity: 0; }
          40% { transform: scale(1.4); opacity: 1; }
          70% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .particle-up {
          animation: particleUp 2.4s ease-in-out infinite;
        }
        .particle-down {
          animation: particleDown 2.4s ease-in-out infinite;
        }
        .burst-dot {
          animation: burst 2.4s ease-out infinite;
        }
        .fade-slide { animation: fadeSlideUp 0.8s ease-out forwards; }
        .fade-slide-1 { animation: fadeSlideUp 0.8s 0.3s ease-out both; }
        .fade-slide-2 { animation: fadeSlideUp 0.8s 0.6s ease-out both; }
        .fade-slide-3 { animation: fadeSlideUp 0.8s 0.9s ease-out both; }
      `}</style>

      {/* Splash artwork placeholder — positioned behind content */}
      <div
        id="splash-image"
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(135deg, #0a0d15 0%, #0f1117 50%, #0a0f1a 100%)' }}
      >
        <img
          src="/splash-artwork.png"
          alt="Splash artwork"
          className="w-full h-full object-cover opacity-30"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Background ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-cyan-400/5 rounded-full blur-2xl pointer-events-none z-0" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Particle animation area */}
        <div className="relative w-32 h-48 mb-8 flex items-center justify-center">
          {/* Blue stream going up */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={`up-${i}`}
              className="particle-up absolute w-1.5 h-1.5 rounded-full bg-blue-400"
              style={{
                left: `calc(50% - ${6 + i * 2}px)`,
                animationDelay: `${i * 0.48}s`,
                animationDuration: '2.4s',
                boxShadow: '0 0 6px 2px rgba(96, 165, 250, 0.6)',
              }}
            />
          ))}

          {/* Teal stream going down */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={`down-${i}`}
              className="particle-down absolute w-1.5 h-1.5 rounded-full bg-cyan-400"
              style={{
                left: `calc(50% + ${2 + i * 2}px)`,
                animationDelay: `${i * 0.48 + 0.24}s`,
                animationDuration: '2.4s',
                boxShadow: '0 0 6px 2px rgba(34, 211, 238, 0.6)',
              }}
            />
          ))}

          {/* Center burst */}
          <div
            className="burst-dot w-4 h-4 rounded-full bg-white"
            style={{
              boxShadow: '0 0 24px 8px rgba(255, 255, 255, 0.4), 0 0 48px 16px rgba(96, 165, 250, 0.3)',
            }}
          />
        </div>

        {/* MERIDIAN */}
        <h1
          className="fade-slide text-6xl md:text-8xl font-black tracking-[0.25em] text-white uppercase mb-3"
          style={{ letterSpacing: '0.3em' }}
        >
          MERIDIAN
        </h1>

        {/* Tagline */}
        <p className="fade-slide-1 text-sm md:text-base text-white/40 tracking-[0.2em] uppercase mb-12">
          Organizational Intelligence
        </p>

        {/* Enter button */}
        <Link
          href="/dashboard"
          className="fade-slide-2 group flex items-center gap-3 px-8 py-4 rounded-2xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-400/60 text-blue-300 hover:text-white font-semibold tracking-wide transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:-translate-y-0.5"
        >
          Enter
          <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
