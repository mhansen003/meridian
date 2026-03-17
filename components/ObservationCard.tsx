import { formatDistanceToNow } from '@/lib/utils';
import type { Observation } from '@/lib/types';
import { CATEGORY_COLORS, ROLE_COLORS } from '@/lib/store';

interface ObservationCardProps {
  observation: Observation;
}

export default function ObservationCard({ observation }: ObservationCardProps) {
  return (
    <div className="p-4 rounded-xl bg-[#13161f] hover:bg-[#161a24] transition-all group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[observation.role] ?? 'bg-gray-500/20 text-gray-300'}`}>
            {observation.anonymous ? 'Anonymous' : observation.role}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[observation.category]}`}>
            {observation.category}
          </span>
          {observation.competitorTag && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/15 text-orange-400 border border-orange-500/25">
              {observation.competitorTag}
            </span>
          )}
          {observation.isExitInterview && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/15 text-violet-400 border border-violet-500/25">
              Exit Interview
            </span>
          )}
        </div>
        <span className="text-xs text-white/30 whitespace-nowrap shrink-0">
          {formatDistanceToNow(observation.timestamp)}
        </span>
      </div>
      <p className="text-sm text-white/80 leading-relaxed mb-2">
        &ldquo;{observation.text}&rdquo;
      </p>
      {observation.summary && (
        <p className="text-xs text-white/40 italic">{observation.summary}</p>
      )}
    </div>
  );
}
