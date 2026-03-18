'use client';

import { useState, useEffect } from 'react';
import type { OrgDNA } from '@/lib/types';
import { Dna, Loader2, Sparkles } from 'lucide-react';

export default function DNAPage() {
  const [dna, setDna] = useState<OrgDNA | null>(null);
  const [observationCount, setObservationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dnaRes, observationsRes] = await Promise.all([
          fetch('/api/dna'),
          fetch('/api/observations'),
        ]);
        const dnaData = (await dnaRes.json()) as { dna: OrgDNA | null };
        const observationsData = (await observationsRes.json()) as { observations: unknown[] };
        setDna(dnaData.dna);
        setObservationCount(observationsData.observations.length);
      } catch (err) {
        console.error('Failed to load DNA page', err);
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/dna', { method: 'POST' });
      if (!res.ok) {
        const errData = (await res.json()) as { error: string };
        setError(errData.error);
        return;
      }
      const data = (await res.json()) as { dna: OrgDNA };
      setDna(data.dna);
    } catch {
      setError('DNA generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Dna className="w-5 h-5 text-violet-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Organizational DNA Profile</h1>
        </div>
        <div className="h-64 rounded-xl bg-white/3 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <Dna className="w-5 h-5 text-violet-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Organizational DNA Profile</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        AI-synthesized profile of your organization&apos;s character, values, and operating patterns.
      </p>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">{error}</div>
      )}

      {!dna ? (
        <div className="p-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 text-center">
          <Dna className="w-12 h-12 text-violet-400/40 mx-auto mb-4" />
          <p className="text-white/60 mb-2">Generate your DNA Profile from</p>
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">{observationCount}</p>
          <p className="text-white/40 text-sm mb-6">captured observations</p>
          <button
            onClick={() => { void handleGenerate(); }}
            disabled={generating || observationCount < 10}
            className="flex items-center justify-center gap-2 mx-auto px-8 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg shadow-violet-500/25"
          >
            {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Profile →</>}
          </button>
          {observationCount < 10 && (
            <p className="text-xs text-white/30 mt-3">Need at least 10 observations to generate DNA profile.</p>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Profile narrative */}
          <div className="p-5 rounded-xl border border-violet-500/20 bg-violet-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">DNA Profile</span>
            </div>
            <p className="text-white/85 leading-relaxed text-sm">{dna.profile}</p>
          </div>

          {/* Traits */}
          <div className="p-5 rounded-xl border border-white/10 bg-white/3">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Organizational Traits</p>
            <div className="flex gap-2 flex-wrap">
              {dna.traits.map((trait) => (
                <span key={trait} className="px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-sm font-medium">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-white/30">
            <span>Based on {dna.observationCount} observations</span>
            <span>Last generated: {new Date(dna.generatedAt).toLocaleDateString()}</span>
          </div>

          <button
            onClick={() => { void handleGenerate(); }}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/5 text-white/60 hover:text-violet-400 font-medium transition-all disabled:opacity-50"
          >
            {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Regenerating...</> : 'Regenerate Profile'}
          </button>
        </div>
      )}
    </div>
  );
}
