'use client';

import Link from 'next/link';

export default function SplashPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-[#0a0c12]">
      <img
        src="/logo.png"
        alt="Meridian"
        className="w-[576px] md:w-[832px] h-auto object-contain drop-shadow-[0_0_120px_rgba(59,130,246,0.5)] mb-10"
        style={{ mixBlendMode: 'screen' }}
      />

      <Link
        href="/dashboard"
        className="group flex items-center gap-3 px-10 py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-semibold tracking-wide transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-400/40 hover:-translate-y-0.5"
      >
        Launch Dashboard
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  );
}
