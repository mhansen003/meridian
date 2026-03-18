'use client';

import { useState, useEffect } from 'react';
import { Lock, Download, Building2 } from 'lucide-react';
import type { SignalCategory } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/store';

interface PatternSummary {
  id: string;
  title: string;
  confidence: 'High' | 'Medium' | 'Low';
  observationCount: number;
  category: SignalCategory;
  relatedStrategy: string;
}

const MOCK_PARTNER_ORGS = [
  { name: 'Thornfield Consulting', observations: 142, patterns: 9, lastActive: '2 hours ago' },
  { name: 'Vantage Advisory Partners', observations: 87, patterns: 5, lastActive: '1 day ago' },
];

export default function AdminPage() {
  const [patterns, setPatterns] = useState<PatternSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/patterns')
      .then((r) => r.json() as Promise<{ patterns: PatternSummary[] }>)
      .then((d) => setPatterns(d.patterns))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleExport = () => {
    const data = { exportedAt: new Date().toISOString(), patterns };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meridian-patterns-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <Lock className="w-5 h-5 text-violet-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Design Partner Admin</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        Cross-organizational pattern data for Meridian design partners. All data is anonymized.
      </p>

      {/* Anonymized Patterns */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Cross-Org Pattern Library</h2>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 hover:border-violet-500/30 hover:bg-violet-500/5 text-white/60 hover:text-violet-400 text-sm font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            Export Anonymized Patterns
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/3 animate-pulse" />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/8 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8 bg-white/3">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Pattern</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Observations</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {patterns.map((p, idx) => (
                  <tr key={p.id} className={`${idx < patterns.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/3 transition-colors`}>
                    <td className="px-4 py-3 text-sm text-white/80">{p.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[p.category]}`}>{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/50 font-mono">{p.observationCount}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${p.confidence === 'High' ? 'text-emerald-400' : p.confidence === 'Medium' ? 'text-amber-400' : 'text-white/40'}`}>
                        {p.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Partner Organizations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-white/40" />
          <h2 className="text-lg font-semibold text-white">Partner Organizations</h2>
          <span className="px-2 py-0.5 rounded-full bg-white/8 text-white/30 text-xs">Demo</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_PARTNER_ORGS.map((org) => (
            <div key={org.name} className="p-5 rounded-xl border border-white/8 bg-white/3">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">{org.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">Active</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xl font-bold text-white">{org.observations}</p>
                  <p className="text-xs text-white/30">Observations</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{org.patterns}</p>
                  <p className="text-xs text-white/30">Patterns</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-white/60 mt-1">{org.lastActive}</p>
                  <p className="text-xs text-white/30">Last Active</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
