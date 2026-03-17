'use client';

import { useState, useEffect } from 'react';
import PatternInsight from '@/components/PatternInsight';
import { patterns, strategyHealth } from '@/lib/store';
import type { Signal } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
} from 'lucide-react';

interface SignalsResponse {
  signals: Signal[];
}

export default function InsightsPage() {
  const [signalCount, setSignalCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/signals')
      .then((r) => r.json() as Promise<SignalsResponse>)
      .then((d) => setSignalCount(d.signals.length))
      .catch(console.error);
  }, []);

  const today = formatDate(new Date().toISOString());
  const urgentPattern = patterns[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-5 h-5 text-violet-400" />
            <h1 className="text-3xl font-bold text-white">Intelligence Report</h1>
          </div>
          <p className="text-white/40 text-sm">{today}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {signalCount !== null ? signalCount : '—'}
          </div>
          <div className="text-xs text-white/40">signals analyzed</div>
        </div>
      </div>

      {/* Attention Required */}
      {urgentPattern && (
        <div className="mb-8 p-5 rounded-2xl border border-red-500/30 bg-red-500/8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500/60 rounded-l-2xl" />
          <div className="pl-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                Attention Required
              </span>
            </div>
            <h3 className="text-base font-semibold text-white/90 mb-1">
              {urgentPattern.title}
            </h3>
            <p className="text-sm text-white/50 mb-3 leading-relaxed">
              {urgentPattern.executiveAction}
            </p>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span>{urgentPattern.signalCount} supporting signals</span>
              <span>·</span>
              <span className="text-red-400 font-medium">{urgentPattern.confidence} confidence</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Patterns */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Top Patterns This Week</h2>
          <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 text-xs font-medium">
            {patterns.length} detected
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {patterns.map((pattern) => (
            <PatternInsight key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </div>

      {/* Strategy Health Table */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Strategy Health</h2>
        </div>
        <div className="rounded-2xl border border-white/8 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Strategy
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Signal Alignment
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Signals
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {strategyHealth.map((sh, idx) => (
                <tr
                  key={sh.strategyId}
                  className={`${idx < strategyHealth.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/3 transition-colors`}
                >
                  <td className="px-4 py-4 text-sm text-white/80 max-w-[240px]">
                    {sh.objective}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/8 max-w-[80px]">
                        <div
                          className={`h-full rounded-full transition-all ${
                            sh.signalAlignment >= 70
                              ? 'bg-emerald-400'
                              : sh.signalAlignment >= 50
                              ? 'bg-amber-400'
                              : 'bg-red-400'
                          }`}
                          style={{ width: `${sh.signalAlignment}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/50 font-mono">{sh.signalAlignment}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-white/50 font-mono">
                    {sh.supportingSignals}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={sh.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'On Track' | 'At Risk' | 'Needs Attention' }) {
  const config = {
    'On Track': {
      class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
      icon: <TrendingUp className="w-3 h-3" />,
    },
    'At Risk': {
      class: 'bg-red-500/15 text-red-400 border-red-500/25',
      icon: <TrendingDown className="w-3 h-3" />,
    },
    'Needs Attention': {
      class: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
      icon: <Minus className="w-3 h-3" />,
    },
  };

  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.class}`}>
      {c.icon}
      {status}
    </span>
  );
}
