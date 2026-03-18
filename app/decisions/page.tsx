'use client';

import { useState, useEffect } from 'react';
import { strategies } from '@/lib/store';
import type { DecisionMemory } from '@/lib/types';
import { Clock, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface DecisionWithReview extends DecisionMemory {
  needsReview: boolean;
}

export default function DecisionsPage() {
  const [title, setTitle] = useState('');
  const [rationale, setRationale] = useState('');
  const [strategyId, setStrategyId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [decisions, setDecisions] = useState<DecisionWithReview[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/decisions')
      .then((r) => r.json() as Promise<{ decisions: DecisionWithReview[] }>)
      .then((d) => setDecisions(d.decisions))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rationale.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, rationale, strategyId: strategyId || null }),
      });
      const data = (await res.json()) as { decision: DecisionWithReview };
      setDecisions((prev) => [{ ...data.decision, needsReview: false }, ...prev]);
      setTitle('');
      setRationale('');
      setStrategyId('');
    } catch (err) {
      console.error('Failed to record decision', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-blue-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Decision Memory</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        Record decisions with their observation context. Meridian resurfaces them after 90 days for reflection.
      </p>

      {/* Record a Decision */}
      <div className="p-5 rounded-2xl border border-white/10 bg-white/3 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Record a Decision</h2>
        <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-3">
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Decision Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Delay AI practice launch to Q3 2026"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none text-white placeholder-white/25 text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Rationale</label>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              rows={3}
              placeholder="Why was this decision made? What observations informed it?"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none text-white placeholder-white/25 text-sm resize-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Link to Strategy (optional)</label>
            <select
              value={strategyId}
              onChange={(e) => setStrategyId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none text-white text-sm transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#1a1d26]">No strategy linked</option>
              {strategies.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#1a1d26]">{s.objective.slice(0, 60)}...</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting || !title.trim() || !rationale.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Record Decision'}
          </button>
        </form>
      </div>

      {/* Decision Timeline */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Decision Timeline</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/3 animate-pulse" />)}
          </div>
        ) : decisions.length === 0 ? (
          <div className="p-6 rounded-xl border border-white/8 text-center">
            <p className="text-sm text-white/40">No decisions recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {decisions.map((d) => (
              <div key={d.id} className={`rounded-xl border overflow-hidden ${d.needsReview ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/8 bg-white/3'}`}>
                <button
                  onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                  className="w-full text-left p-4 hover:bg-white/3 transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-white">{d.title}</h3>
                      {d.needsReview && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                          <AlertCircle className="w-3 h-3" />
                          90-Day Checkpoint
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40">
                      {new Date(d.madeAt).toLocaleDateString()} · Resurface: {new Date(d.resurface90).toLocaleDateString()}
                    </p>
                  </div>
                  {expandedId === d.id ? <ChevronUp className="w-4 h-4 text-white/40 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedId === d.id && (
                  <div className="px-4 pb-4 border-t border-white/8">
                    <p className="text-sm text-white/70 leading-relaxed mt-3 mb-3">{d.rationale}</p>
                    <div>
                      <p className="text-xs text-white/30 uppercase tracking-wider mb-1.5">Observation context at time of decision</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {d.observationContext.slice(0, 8).map((sid) => (
                          <span key={sid} className="px-2 py-0.5 rounded-full bg-white/8 text-white/40 text-xs font-mono">{sid}</span>
                        ))}
                        {d.observationContext.length > 8 && (
                          <span className="px-2 py-0.5 rounded-full bg-white/8 text-white/30 text-xs">+{d.observationContext.length - 8} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
