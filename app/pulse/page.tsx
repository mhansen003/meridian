'use client';

import { useState, useEffect } from 'react';
import SignalCard from '@/components/SignalCard';
import { ROLES, CATEGORY_COLORS } from '@/lib/store';
import type { Signal, Role, SignalCategory } from '@/lib/types';
import { Radio, Loader2, CheckCircle2, MessageSquare } from 'lucide-react';

const PROMPT_SUGGESTIONS = [
  {
    label: 'Client Pattern',
    text: 'What pattern am I noticing with clients or prospects?',
    icon: '📊',
  },
  {
    label: 'Work Friction',
    text: "What's creating friction in my work this week?",
    icon: '⚡',
  },
  {
    label: 'Risk / Opportunity',
    text: 'What risk or opportunity am I seeing that leadership should know about?',
    icon: '🔍',
  },
];

interface AnalyzeResult {
  category: SignalCategory;
  summary: string;
  relatedStrategy: string | null;
}

interface SignalsResponse {
  signals: Signal[];
}

export default function PulsePage() {
  const [selectedRole, setSelectedRole] = useState<Role>('Senior Consultant');
  const [signalText, setSignalText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ category: SignalCategory; summary: string } | null>(null);
  const [recentSignals, setRecentSignals] = useState<Signal[]>([]);
  const [loadingSignals, setLoadingSignals] = useState(true);

  useEffect(() => {
    fetch('/api/signals')
      .then((r) => r.json() as Promise<SignalsResponse>)
      .then((d) => setRecentSignals(d.signals.slice(0, 5)))
      .catch(console.error)
      .finally(() => setLoadingSignals(false));
  }, []);

  const handlePromptClick = (text: string) => {
    setSignalText(text);
    setSubmitted(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signalText.trim()) return;

    setSubmitting(true);
    setSubmitted(null);

    try {
      // Analyze the signal
      const analyzeRes = await fetch('/api/analyze-signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal: signalText, role: selectedRole }),
      });
      const analysis = (await analyzeRes.json()) as AnalyzeResult;

      // Store the signal
      await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
          text: signalText,
          category: analysis.category,
          summary: analysis.summary,
          relatedStrategy: analysis.relatedStrategy,
        }),
      });

      setSubmitted({ category: analysis.category, summary: analysis.summary });

      // Refresh signals feed
      const signalsRes = await fetch('/api/signals');
      const signalsData = (await signalsRes.json()) as SignalsResponse;
      setRecentSignals(signalsData.signals.slice(0, 5));

      setSignalText('');
    } catch (err) {
      console.error('Failed to submit signal', err);
      setSubmitted({ category: 'Market Intel', summary: 'Signal captured.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Radio className="w-5 h-5 text-cyan-400" />
        <h1 className="text-3xl font-bold text-white">What are you seeing?</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        Share a micro-moment observation. Your signal feeds the organizational intelligence map.
      </p>

      {/* Role Selector */}
      <div className="mb-6">
        <label className="block text-sm text-white/50 mb-1.5">Your Role</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as Role)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-white text-sm transition-all appearance-none cursor-pointer"
        >
          {ROLES.map((role) => (
            <option key={role} value={role} className="bg-[#1a1d26]">
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Prompt Suggestions */}
      <div className="mb-4">
        <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Quick prompts</p>
        <div className="grid grid-cols-3 gap-2">
          {PROMPT_SUGGESTIONS.map((prompt) => (
            <button
              key={prompt.label}
              onClick={() => handlePromptClick(prompt.text)}
              className="p-3 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all text-left group"
            >
              <div className="text-lg mb-1">{prompt.icon}</div>
              <div className="text-xs font-medium text-white/60 group-hover:text-white/80 transition-colors leading-tight">
                {prompt.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Signal Form */}
      <form onSubmit={(e) => { void handleSubmit(e); }} className="mb-6">
        <div className="mb-3">
          <label className="block text-sm text-white/50 mb-1.5">Share your observation</label>
          <textarea
            value={signalText}
            onChange={(e) => setSignalText(e.target.value)}
            placeholder="What are you noticing? What's creating friction? What should leadership know about?"
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-white placeholder-white/25 text-sm resize-none transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !signalText.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg shadow-cyan-500/25"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing your signal...
            </>
          ) : (
            <>
              <Radio className="w-4 h-4" />
              Add to the Intelligence Feed &rarr;
            </>
          )}
        </button>
      </form>

      {/* Success Confirmation */}
      {submitted && (
        <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 animate-[slideUp_0.3s_ease-out]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-300 mb-1">
                Your signal has been added to the intelligence feed
              </p>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[submitted.category]}`}>
                  {submitted.category}
                </span>
                <span className="text-xs text-white/50">{submitted.summary}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Signals */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-white/40" />
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            Recent from the feed
          </h2>
        </div>
        {loadingSignals ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl skeleton" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {recentSignals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
