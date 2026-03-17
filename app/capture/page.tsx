'use client';

import { useState, useEffect } from 'react';
import ObservationCard from '@/components/ObservationCard';
import { ROLES, CATEGORY_COLORS } from '@/lib/store';
import type { Observation, Role, SignalCategory } from '@/lib/types';
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

interface ObservationsResponse {
  observations: Observation[];
}

export default function CapturePage() {
  const [selectedRole, setSelectedRole] = useState<Role>('Senior Consultant');
  const [observationText, setObservationText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ category: SignalCategory; summary: string } | null>(null);
  const [recentObservations, setRecentObservations] = useState<Observation[]>([]);
  const [loadingObservations, setLoadingObservations] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isCompetitorIntel, setIsCompetitorIntel] = useState(false);
  const [competitorName, setCompetitorName] = useState('');

  useEffect(() => {
    fetch('/api/observations')
      .then((r) => r.json() as Promise<ObservationsResponse>)
      .then((d) => setRecentObservations(d.observations.slice(0, 5)))
      .catch(console.error)
      .finally(() => setLoadingObservations(false));
  }, []);

  const handlePromptClick = (text: string) => {
    setObservationText(text);
    setSubmitted(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observationText.trim()) return;

    setSubmitting(true);
    setSubmitted(null);

    try {
      // Analyze the observation
      const analyzeRes = await fetch('/api/analyze-observation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ observation: observationText, role: selectedRole }),
      });
      const analysis = (await analyzeRes.json()) as AnalyzeResult;

      // Store the observation
      await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
          text: observationText,
          category: analysis.category,
          summary: analysis.summary,
          relatedStrategy: analysis.relatedStrategy,
          anonymous: isAnonymous,
          competitorTag: isCompetitorIntel && competitorName.trim() ? competitorName.trim() : undefined,
        }),
      });

      setSubmitted({ category: analysis.category, summary: analysis.summary });

      // Refresh observations feed
      const observationsRes = await fetch('/api/observations');
      const observationsData = (await observationsRes.json()) as ObservationsResponse;
      setRecentObservations(observationsData.observations.slice(0, 5));

      setObservationText('');
    } catch (err) {
      console.error('Failed to submit observation', err);
      setSubmitted({ category: 'Market Intel', summary: 'Observation captured.' });
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
        Share a micro-moment observation. Your capture feeds the organizational intelligence map.
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

      {/* Observation Form */}
      <form onSubmit={(e) => { void handleSubmit(e); }} className="mb-6">
        <div className="mb-3">
          <label className="block text-sm text-white/50 mb-1.5">Share your observation</label>
          <textarea
            value={observationText}
            onChange={(e) => setObservationText(e.target.value)}
            placeholder="What are you noticing? What's creating friction? What should leadership know about?"
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-white placeholder-white/25 text-sm resize-none transition-all"
          />
        </div>

        {/* Options */}
        <div className="space-y-2 mb-3">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 cursor-pointer"
            />
            <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
              Submit anonymously <span className="text-white/30">(role still recorded internally)</span>
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={isCompetitorIntel}
              onChange={(e) => setIsCompetitorIntel(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 cursor-pointer"
            />
            <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
              Tag as competitor intel
            </span>
          </label>

          {isCompetitorIntel && (
            <div className="ml-6">
              <input
                type="text"
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                placeholder="Competitor name (e.g. McKinsey, Accenture)"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-orange-500/50 focus:outline-none text-white placeholder-white/25 text-sm transition-all"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || !observationText.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg shadow-cyan-500/25"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing your observation...
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
                Your observation has been added to the intelligence feed
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

      {/* Recent Observations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-white/40" />
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            Recent from the feed
          </h2>
        </div>
        {loadingObservations ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl skeleton" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {recentObservations.map((observation) => (
              <ObservationCard key={observation.id} observation={observation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
