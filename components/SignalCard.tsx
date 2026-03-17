import { formatDistanceToNow } from '@/lib/utils';
import type { Signal } from '@/lib/types';
import { CATEGORY_COLORS, ROLE_COLORS } from '@/lib/store';

interface SignalCardProps {
  signal: Signal;
}

export default function SignalCard({ signal }: SignalCardProps) {
  return (
    <div className="p-4 rounded-xl bg-[#13161f] hover:bg-[#161a24] transition-all group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[signal.role] ?? 'bg-gray-500/20 text-gray-300'}`}>
            {signal.anonymous ? 'Anonymous' : signal.role}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[signal.category]}`}>
            {signal.category}
          </span>
          {signal.competitorTag && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/15 text-orange-400 border border-orange-500/25">
              {signal.competitorTag}
            </span>
          )}
          {signal.isExitInterview && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/15 text-violet-400 border border-violet-500/25">
              Exit Interview
            </span>
          )}
        </div>
        <span className="text-xs text-white/30 whitespace-nowrap shrink-0">
          {formatDistanceToNow(signal.timestamp)}
        </span>
      </div>
      <p className="text-sm text-white/80 leading-relaxed mb-2">
        &ldquo;{signal.text}&rdquo;
      </p>
      {signal.summary && (
        <p className="text-xs text-white/40 italic">{signal.summary}</p>
      )}
    </div>
  );
}
