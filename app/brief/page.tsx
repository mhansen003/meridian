'use client';

import { useState } from 'react';
import { ROLES } from '@/lib/store';
import type { Role } from '@/lib/types';
import { Newspaper, Loader2, CheckCircle2 } from 'lucide-react';

interface Brief {
  bullets: string[];
}

const BULLET_ICONS = ['◆', '◆', '◆'];

export default function BriefPage() {
  const [role, setRole] = useState<Role>('CEO');
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [error, setError] = useState('');
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setBrief(null);
    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = (await res.json()) as { brief: Brief };
      setBrief(data.brief);
      setGeneratedAt(new Date().toLocaleString());
    } catch {
      setError('Brief generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <Newspaper className="w-5 h-5 text-cyan-400" />
        <h1 className="text-3xl font-bold text-white">Your Daily Brief</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        Get a role-specific intelligence briefing grounded in your organization&apos;s live signal data.
      </p>

      <div className="flex gap-3 mb-8">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none text-white text-sm transition-all appearance-none cursor-pointer"
        >
          {ROLES.map((r) => (
            <option key={r} value={r} className="bg-[#1a1d26]">{r}</option>
          ))}
        </select>
        <button
          onClick={() => { void handleGenerate(); }}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center gap-2 whitespace-nowrap"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : 'Generate Brief'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">{error}</div>
      )}

      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-white/3 animate-pulse" />
          ))}
        </div>
      )}

      {brief && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400">{role} Brief</span>
            </div>
            {generatedAt && (
              <span className="text-xs text-white/30">Generated {generatedAt}</span>
            )}
          </div>
          <div className="space-y-4">
            {brief.bullets.map((bullet, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/10 bg-white/3 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0">
                  {BULLET_ICONS[i] ?? '◆'}
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{bullet}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
