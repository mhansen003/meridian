'use client';

import { useState } from 'react';
import { Target, Loader2, Sparkles } from 'lucide-react';
import { CATEGORY_COLORS } from '@/lib/store';
import type { SignalCategory } from '@/lib/types';

interface KeyResult {
  title: string;
  categories: string[];
  prompts: string[];
}

interface OKRResult {
  keyResults: KeyResult[];
}

export default function OKRPage() {
  const [okrText, setOkrText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OKRResult | null>(null);
  const [error, setError] = useState('');

  const handleSynthesize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!okrText.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const res = await fetch('/api/okr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ okrText }),
      });
      const data = (await res.json()) as OKRResult;
      setResults(data);
    } catch {
      setError('Synthesis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-5 h-5 text-blue-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">OKR Observation Synthesis</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        Paste your OKR text and Meridian will map each key result to observation categories and suggest employee prompts for your next Capture campaign.
      </p>

      <form onSubmit={(e) => { void handleSynthesize(e); }} className="mb-8">
        <div className="mb-3">
          <label className="block text-sm text-white/50 mb-1.5">Paste OKR Text</label>
          <textarea
            value={okrText}
            onChange={(e) => setOkrText(e.target.value)}
            rows={8}
            placeholder={`Objective: Accelerate mid-market growth\n\nKR1: Close 40 new logos in H1 2026\nKR2: Reduce average sales cycle to 45 days\nKR3: Achieve $2M in AI advisory revenue`}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-white placeholder-white/25 text-sm resize-none transition-all font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !okrText.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Synthesizing...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Synthesize →</>
          )}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">{error}</div>
      )}

      {results && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Synthesis Results</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-xs">
              {results.keyResults.length} key results
            </span>
          </div>
          <div className="space-y-4">
            {results.keyResults.map((kr, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/10 bg-white/3">
                <h3 className="text-sm font-semibold text-white mb-3">{kr.title}</h3>

                <div className="mb-4">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Observation Categories</p>
                  <div className="flex gap-2 flex-wrap">
                    {kr.categories.map((cat) => (
                      <span key={cat} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[cat as SignalCategory] ?? 'bg-gray-500/20 text-gray-300'}`}>
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Use these prompts in your next Capture campaign</p>
                  <ul className="space-y-1.5">
                    {kr.prompts.map((prompt, j) => (
                      <li key={j} className="flex gap-2 text-sm text-white/70">
                        <span className="text-blue-400 shrink-0 font-mono text-xs mt-0.5">→</span>
                        <span>{prompt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
