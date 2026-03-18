'use client';

import { useState } from 'react';
import { ROLES } from '@/lib/store';
import type { StrategySimulation, Role } from '@/lib/types';
import { Zap, Loader2, ArrowRight } from 'lucide-react';

export default function SimulatePage() {
  const [strategyText, setStrategyText] = useState('');
  const [authorRole, setAuthorRole] = useState<Role>('CEO');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StrategySimulation | null>(null);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strategyText.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setPublished(false);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategyText, authorRole }),
      });
      const data = (await res.json()) as { simulation: StrategySimulation };
      setResult(data.simulation);
    } catch {
      setError('Simulation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!result) return;
    setPublishing(true);
    try {
      await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective: result.strategyText, authorRole: result.authorRole, author: result.authorRole }),
      });
      setPublished(true);
    } catch (err) {
      console.error('Publish failed', err);
    } finally {
      setPublishing(false);
    }
  };

  const scoreColor = result
    ? result.alignmentScore >= 70 ? 'text-emerald-400' : result.alignmentScore >= 45 ? 'text-amber-400' : 'text-red-400'
    : '';

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-blue-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Strategy Simulation</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        Test a strategy against your organization&apos;s current observation patterns before committing.
      </p>

      <form onSubmit={(e) => { void handleSimulate(e); }} className="mb-8">
        <div className="mb-3">
          <label className="block text-sm text-white/50 mb-1.5">Strategy to Simulate</label>
          <textarea
            value={strategyText}
            onChange={(e) => setStrategyText(e.target.value)}
            rows={4}
            placeholder="Describe the strategy you want to test against current organizational observations..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-white placeholder-white/25 text-sm resize-none transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value as Role)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none text-white text-sm transition-all appearance-none cursor-pointer"
          >
            {ROLES.map((r) => (
              <option key={r} value={r} className="bg-[#1a1d26]">{r}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading || !strategyText.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Running Simulation...</> : <>Run Simulation <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
      </form>

      {error && <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">{error}</div>}

      {result && (
        <div className="space-y-4">
          {/* Alignment Score */}
          <div className="p-5 rounded-xl border border-white/10 bg-white/3 text-center">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Alignment Score</p>
            <p className={`text-5xl md:text-6xl font-black ${scoreColor}`}>{result.alignmentScore}</p>
            <p className="text-sm text-white/40 mt-1">out of 100</p>
          </div>

          {/* Predicted Reaction */}
          <div className="p-5 rounded-xl border border-white/10 bg-white/3">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Predicted Organizational Reaction</p>
            <p className="text-sm text-white/80 leading-relaxed">{result.predictedReaction}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risks */}
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
              <p className="text-xs text-red-400 uppercase tracking-wider mb-3">Risks</p>
              <ul className="space-y-2">
                {result.risks.map((r, i) => (
                  <li key={i} className="text-sm text-white/70 flex gap-2">
                    <span className="text-red-400 shrink-0">!</span>{r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <p className="text-xs text-emerald-400 uppercase tracking-wider mb-3">Opportunities</p>
              <ul className="space-y-2">
                {result.opportunities.map((o, i) => (
                  <li key={i} className="text-sm text-white/70 flex gap-2">
                    <span className="text-emerald-400 shrink-0">+</span>{o}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Publish button */}
          {!published ? (
            <button
              onClick={() => { void handlePublish(); }}
              disabled={publishing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold transition-all disabled:opacity-50"
            >
              {publishing ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : 'Publish to Strategies →'}
            </button>
          ) : (
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center">
              <p className="text-sm text-emerald-400 font-semibold">Strategy published to the Strategy feed</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
