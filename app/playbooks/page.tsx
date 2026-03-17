'use client';

import { useState, useEffect } from 'react';
import PlaybookCard from '@/components/PlaybookCard';
import type { Playbook } from '@/lib/types';
import { BookOpen, Loader2, Plus } from 'lucide-react';

export default function PlaybooksPage() {
  const [patternTitle, setPatternTitle] = useState('');
  const [patternDescription, setPatternDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/playbooks')
      .then((r) => r.json() as Promise<{ playbooks: Playbook[] }>)
      .then((d) => setPlaybooks(d.playbooks))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patternTitle.trim()) return;
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/playbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patternTitle, patternDescription }),
      });
      const data = (await res.json()) as { playbook: Playbook };
      setPlaybooks((prev) => [data.playbook, ...prev]);
      setPatternTitle('');
      setPatternDescription('');
    } catch {
      setError('Playbook generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Playbooks</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        Generate action playbooks from detected organizational patterns.
      </p>

      {/* Generate form */}
      <div className="p-5 rounded-2xl border border-white/10 bg-white/3 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-4 h-4 text-blue-400" />
          <h2 className="text-base font-semibold text-white">Generate from Pattern</h2>
        </div>
        <form onSubmit={(e) => { void handleGenerate(e); }} className="space-y-3">
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Pattern Title</label>
            <input
              type="text"
              value={patternTitle}
              onChange={(e) => setPatternTitle(e.target.value)}
              placeholder="e.g. AI Capability Gap Threatening Pipeline"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none text-white placeholder-white/25 text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Pattern Description</label>
            <textarea
              value={patternDescription}
              onChange={(e) => setPatternDescription(e.target.value)}
              rows={3}
              placeholder="Describe what the pattern is and why it matters..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none text-white placeholder-white/25 text-sm resize-none transition-all"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={generating || !patternTitle.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
          >
            {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : 'Generate Playbook →'}
          </button>
        </form>
      </div>

      {/* Playbooks list */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          All Playbooks
          {playbooks.length > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-white/8 text-white/40 text-xs font-normal">
              {playbooks.length}
            </span>
          )}
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/3 animate-pulse" />)}
          </div>
        ) : playbooks.length === 0 ? (
          <div className="p-6 rounded-xl border border-white/8 text-center">
            <p className="text-sm text-white/40">No playbooks yet. Generate one from a pattern above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {playbooks.map((pb) => <PlaybookCard key={pb.id} playbook={pb} />)}
          </div>
        )}
      </div>
    </div>
  );
}
