import { formatDistanceToNow } from '@/lib/utils';
import type { Strategy } from '@/lib/types';
import { Target } from 'lucide-react';

interface StrategyCardProps {
  strategy: Strategy;
  showTranslations?: boolean;
}

export default function StrategyCard({ strategy, showTranslations = false }: StrategyCardProps) {
  const hasTranslations = strategy.translations && strategy.translations.length > 0;

  return (
    <div className="p-4 rounded-xl bg-[#13161f] hover:bg-[#161a24] transition-all">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <Target className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/90 leading-snug mb-1">
            {strategy.objective}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>{strategy.author ?? strategy.authorRole}</span>
            <span>·</span>
            <span>{formatDistanceToNow(strategy.timestamp)}</span>
          </div>
        </div>
      </div>

      {showTranslations && hasTranslations && (
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">
            Translated to {strategy.translations!.length} roles
          </span>
        </div>
      )}

      {!hasTranslations && (
        <div className="mt-3">
          <span className="text-xs text-white/30">Pending translation</span>
        </div>
      )}
    </div>
  );
}
