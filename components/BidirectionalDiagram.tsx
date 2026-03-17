'use client';

export default function BidirectionalDiagram() {
  return (
    <div className="relative flex flex-col items-center gap-0 my-8">
      {/* Executive Strategy */}
      <div className="px-6 py-3 rounded-xl border border-blue-500/40 bg-blue-500/10 text-blue-300 text-sm font-semibold shadow-lg shadow-blue-500/10">
        Executive Strategy
      </div>

      {/* Down arrow */}
      <div className="flex flex-col items-center my-1">
        <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500 to-cyan-400 animate-[flowDown_1.8s_ease-in-out_infinite]" />
        <svg width="12" height="8" viewBox="0 0 12 8" className="text-cyan-400 fill-current">
          <path d="M6 8L0 0h12z" />
        </svg>
      </div>

      {/* Center loop node */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-white/10 animate-[pulse_3s_ease-in-out_infinite]" />
        {/* Inner ring */}
        <div className="absolute inset-3 rounded-full border border-blue-500/20" />
        {/* Core */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/20 border border-blue-500/40 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <div className="text-center">
            <div className="text-[10px] font-bold text-white/80 leading-tight">THE</div>
            <div className="text-[10px] font-bold text-blue-400 leading-tight">LOOP</div>
          </div>
        </div>
        {/* Orbit dots */}
        <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
        </div>
        <div className="absolute inset-0 animate-[spin_8s_linear_infinite_reverse]">
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </div>
      </div>

      {/* Up arrow */}
      <div className="flex flex-col items-center my-1">
        <svg width="12" height="8" viewBox="0 0 12 8" className="text-cyan-400 fill-current">
          <path d="M6 0L12 8H0z" />
        </svg>
        <div className="w-0.5 h-6 bg-gradient-to-t from-cyan-400 to-blue-500 animate-[flowUp_1.8s_ease-in-out_infinite_0.9s]" />
      </div>

      {/* Frontline Observation */}
      <div className="px-6 py-3 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-sm font-semibold shadow-lg shadow-cyan-500/10">
        Frontline Observation
      </div>

      {/* Side labels */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs text-white/30 font-medium rotate-[-90deg] -translate-x-6">
        Top-Down
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-white/30 font-medium rotate-[90deg] translate-x-6">
        Bottom-Up
      </div>
    </div>
  );
}
