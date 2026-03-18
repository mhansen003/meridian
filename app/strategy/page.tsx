'use client';

import { useState, useEffect } from 'react';
import StrategyCard from '@/components/StrategyCard';
import RoleTranslationCard from '@/components/RoleTranslationCard';
import { ROLES } from '@/lib/store';
import type { RoleTranslation, Strategy } from '@/lib/types';
import { Target, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface TranslationResult {
  translations: RoleTranslation[];
}

interface StrategiesResponse {
  strategies: Strategy[];
}

export default function StrategyPage() {
  const [objective, setObjective] = useState('');
  const [authorRole, setAuthorRole] = useState('CEO');
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState<RoleTranslation[]>([]);
  const [error, setError] = useState('');
  const [existingStrategies, setExistingStrategies] = useState<Strategy[]>([]);
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/strategies')
      .then((r) => r.json() as Promise<StrategiesResponse>)
      .then((d) => setExistingStrategies(d.strategies))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) return;

    setLoading(true);
    setTranslations([]);
    setError('');

    try {
      // Store the strategy first
      const stratRes = await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective, authorRole, author: authorRole }),
      });
      const stratData = (await stratRes.json()) as { strategy: Strategy };

      // Translate
      const translateRes = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy: objective, authorRole }),
      });

      if (!translateRes.ok) {
        throw new Error('Translation failed');
      }

      const data = (await translateRes.json()) as TranslationResult;
      setTranslations(data.translations);

      // Update strategies list
      setExistingStrategies((prev) => [
        ...prev,
        { ...stratData.strategy, translations: data.translations },
      ]);
      setObjective('');
    } catch (err) {
      setError('Translation failed. Please add your OPENROUTER_API_KEY to the Vercel environment variables.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-blue-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Strategy Translation</h1>
        </div>
        <p className="text-white/40 text-sm">
          Enter a strategic priority and AI will translate it into role-specific guidance for all 8 roles.
        </p>
      </div>

      {/* Form */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/3 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Enter a Strategic Priority</h2>
        <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Strategic Objective</label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="e.g. Accelerate mid-market client acquisition — target 40 new logos in H1 2026"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-white placeholder-white/25 text-sm resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-white/50 mb-1.5">Your Role / Title</label>
            <select
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-white text-sm transition-all appearance-none cursor-pointer"
            >
              {ROLES.map((role) => (
                <option key={role} value={role} className="bg-[#1a1d26]">
                  {role}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !objective.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg shadow-blue-500/25"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Translating strategy across your organization...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Translate to Team &rarr;
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Translation Results */}
      {loading && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="text-sm text-white/50">Generating role-specific guidance...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl skeleton" />
            ))}
          </div>
        </div>
      )}

      {translations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Role-Specific Guidance</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-xs">
              {translations.length} roles
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {translations.map((t, i) => (
              <RoleTranslationCard key={t.role} translation={t} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Existing Strategies */}
      {existingStrategies.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Existing Strategies</h2>
          <div className="space-y-2">
            {existingStrategies.map((strategy) => (
              <div key={strategy.id} className="rounded-xl border border-white/8 overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedStrategy(expandedStrategy === strategy.id ? null : strategy.id)
                  }
                  className="w-full text-left p-4 hover:bg-white/3 transition-all flex items-center justify-between"
                >
                  <div className="flex-1">
                    <StrategyCard strategy={strategy} showTranslations={false} />
                  </div>
                  <div className="ml-2 shrink-0">
                    {expandedStrategy === strategy.id ? (
                      <ChevronUp className="w-4 h-4 text-white/40" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/40" />
                    )}
                  </div>
                </button>

                {expandedStrategy === strategy.id && strategy.translations && (
                  <div className="p-4 pt-0 border-t border-white/8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {strategy.translations.map((t, i) => (
                        <RoleTranslationCard key={t.role} translation={t} index={i} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
