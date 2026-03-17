import type { DriftScore } from '@/lib/types';

interface DriftScoreCardProps {
  driftScore: DriftScore;
  strategyObjective?: string;
}

export default function DriftScoreCard({ driftScore, strategyObjective }: DriftScoreCardProps) {
  const score = driftScore.score;
  const barColor =
    score >= 70
      ? 'bg-emerald-400'
      : score >= 45
      ? 'bg-amber-400'
      : 'bg-red-400';
  const textColor =
    score >= 70
      ? 'text-emerald-400'
      : score >= 45
      ? 'text-amber-400'
      : 'text-red-400';

  return (
    <div className="p-4 rounded-xl border border-white/8 bg-white/3">
      {strategyObjective && (
        <p className="text-xs text-white/50 mb-2 truncate">{strategyObjective}</p>
      )}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-white/80">Strategy Alignment</span>
        <span className={`text-xl font-bold ${textColor}`}>{score}</span>
      </div>
      <div className="h-2 rounded-full bg-white/8 mb-3">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex gap-3 text-xs text-white/40 mb-3">
        <span className="text-emerald-400">{driftScore.alignedObservations} aligned</span>
        <span>·</span>
        <span className="text-red-400">{driftScore.misalignedObservations} misaligned</span>
      </div>
      <p className="text-xs text-white/50 leading-relaxed italic">{driftScore.reasoning}</p>
    </div>
  );
}
