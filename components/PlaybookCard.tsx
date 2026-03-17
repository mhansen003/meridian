'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Playbook } from '@/lib/types';

interface PlaybookCardProps {
  playbook: Playbook;
}

export default function PlaybookCard({ playbook }: PlaybookCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 hover:bg-white/5 transition-all flex items-center justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-semibold text-white">{playbook.title}</h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-xs font-medium">
              {playbook.owner}
            </span>
          </div>
          <p className="text-xs text-white/40 truncate">Pattern: {playbook.triggeredByPattern}</p>
        </div>
        <div className="shrink-0">
          {expanded
            ? <ChevronUp className="w-4 h-4 text-white/40" />
            : <ChevronDown className="w-4 h-4 text-white/40" />
          }
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/8">
          <ol className="mt-3 space-y-2">
            {playbook.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-white/70">
                <span className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
