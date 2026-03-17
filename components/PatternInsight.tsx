import type { Pattern } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/store';
import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';

interface PatternInsightProps {
  pattern: Pattern;
}

const confidenceConfig = {
  High: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: TrendingUp },
  Medium: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: Minus },
  Low: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: TrendingDown },
};

export default function PatternInsight({ pattern }: PatternInsightProps) {
  const conf = confidenceConfig[pattern.confidence];
  const ConfIcon = conf.icon;

  return (
    <div className="p-5 rounded-xl bg-[#13161f] hover:bg-[#161a24] transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[pattern.category]}`}>
            {pattern.category}
          </span>
          <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${conf.bg} ${conf.color}`}>
            <ConfIcon className="w-3 h-3" />
            {pattern.confidence}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-white/40">
          <span className="font-mono text-white/60">{pattern.observationCount}</span>
          <span>observations</span>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-white/90 mb-2 leading-snug">
        {pattern.title}
      </h3>

      <div className="mt-4">
        <div className="flex items-start gap-2">
          <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-1">Recommended Action</span>
            <p className="text-xs text-white/60 leading-relaxed">{pattern.executiveAction}</p>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <span className="text-xs text-white/30">Related: {pattern.relatedStrategy}</span>
      </div>
    </div>
  );
}
