'use client';

import Link from 'next/link';

export default function SplashPage() {
  return (
    <div className="relative -mt-16 min-h-screen bg-[#04060d] flex flex-col items-center justify-end overflow-hidden">
      {/* Full-screen artwork — the hero */}
      <div className="absolute inset-0 z-0">
        <img
          src="/splash-artwork.png"
          alt="Meridian"
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Bottom gradient so text reads cleanly */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04060d] via-[#04060d]/40 to-transparent" />
      </div>

      {/* Content anchored to bottom */}
      <div className="relative z-10 flex flex-col items-center pb-20 w-full px-6">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-white/40 mb-3">
          Organizational Intelligence
        </p>

        <Link
          href="/dashboard"
          className="mt-6 group flex items-center gap-3 px-10 py-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 hover:border-white/35 text-white font-semibold tracking-widest uppercase text-sm transition-all"
        >
          Enter
          <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
