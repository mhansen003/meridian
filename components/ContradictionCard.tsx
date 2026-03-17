import type { Contradiction, Signal } from '@/lib/types';
import { ROLE_COLORS } from '@/lib/store';

interface ContradictionCardProps {
  contradiction: Contradiction;
  signalA?: Signal;
  signalB?: Signal;
}

export default function ContradictionCard({ contradiction, signalA, signalB }: ContradictionCardProps) {
  return (
    <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="p-3 rounded-lg bg-white/3 border border-white/8">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium mb-2 inline-block ${ROLE_COLORS[contradiction.roleA] ?? 'bg-gray-500/20 text-gray-300'}`}>
            {contradiction.roleA}
          </span>
          <p className="text-xs text-white/70 leading-relaxed">
            &ldquo;{signalA ? signalA.text.slice(0, 120) + (signalA.text.length > 120 ? '...' : '') : contradiction.signalIdA}&rdquo;
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white/3 border border-white/8">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium mb-2 inline-block ${ROLE_COLORS[contradiction.roleB] ?? 'bg-gray-500/20 text-gray-300'}`}>
            {contradiction.roleB}
          </span>
          <p className="text-xs text-white/70 leading-relaxed">
            &ldquo;{signalB ? signalB.text.slice(0, 120) + (signalB.text.length > 120 ? '...' : '') : contradiction.signalIdB}&rdquo;
          </p>
        </div>
      </div>
      <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <p className="text-xs text-amber-300 leading-relaxed">{contradiction.summary}</p>
      </div>
    </div>
  );
}
