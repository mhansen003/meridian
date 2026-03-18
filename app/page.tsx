'use client';

import Link from 'next/link';

export default function SplashPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-[#0a0c12]">
      <style>{`
        @keyframes spin-logo {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        .logo-spin {
          animation: spin-logo 10s linear infinite;
          filter: drop-shadow(0 0 40px rgba(59,130,246,0.6)) drop-shadow(0 0 80px rgba(6,182,212,0.3));
        }
      `}</style>

      {/* Geometric SVG logo — two opposing blades + starburst center */}
      <svg
        className="logo-spin w-64 md:w-96 h-auto mb-12"
        viewBox="0 0 160 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blueGrad" x1="80" y1="130" x2="80" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="tealGrad" x1="80" y1="130" x2="80" y2="260" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#164e63" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <filter id="starGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Blue upper blade */}
        <path
          d="M80,130 C58,112 18,82 28,42 C36,10 62,0 80,0 C98,0 124,10 132,42 C142,82 102,112 80,130Z"
          fill="url(#blueGrad)"
        />

        {/* Teal lower blade */}
        <path
          d="M80,130 C102,148 142,178 132,218 C124,250 98,260 80,260 C62,260 36,250 28,218 C18,178 58,148 80,130Z"
          fill="url(#tealGrad)"
        />

        {/* Center starburst */}
        <g filter="url(#starGlow)">
          {/* 8 rays */}
          <line x1="80" y1="118" x2="80" y2="108" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          <line x1="80" y1="142" x2="80" y2="152" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          <line x1="68" y1="130" x2="58" y2="130" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          <line x1="92" y1="130" x2="102" y2="130" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          <line x1="71.5" y1="121.5" x2="64.5" y2="114.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <line x1="88.5" y1="138.5" x2="95.5" y2="145.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <line x1="88.5" y1="121.5" x2="95.5" y2="114.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <line x1="71.5" y1="138.5" x2="64.5" y2="145.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          {/* Center dot */}
          <circle cx="80" cy="130" r="4" fill="white" />
        </g>
      </svg>

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
