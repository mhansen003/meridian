'use client';

import { useState, useEffect } from 'react';
import ObservationCard from '@/components/ObservationCard';
import type { Observation } from '@/lib/types';
import { Shield, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface CompetitorGroup {
  competitor: string;
  observations: Observation[];
  count: number;
}

interface DossierResult {
  dossier: { competitor: string; observationIds: string[]; summary: string; lastUpdated: string };
  summary: string;
  strengths: string[];
  threats: string[];
  recommendations: string[];
}

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<CompetitorGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingDossier, setGeneratingDossier] = useState<string | null>(null);
  const [dossiers, setDossiers] = useState<Record<string, DossierResult>>({});
  const [expandedCompetitor, setExpandedCompetitor] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/competitors')
      .then((r) => r.json() as Promise<{ competitors: CompetitorGroup[] }>)
      .then((d) => setCompetitors(d.competitors))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleGenerateDossier = async (competitor: string) => {
    setGeneratingDossier(competitor);
    try {
      const res = await fetch('/api/competitors/dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitor }),
      });
      const data = (await res.json()) as DossierResult;
      setDossiers((prev) => ({ ...prev, [competitor]: data }));
    } catch (err) {
      console.error('Dossier generation failed', err);
    } finally {
      setGeneratingDossier(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="w-5 h-5 text-orange-400" />
          <h1 className="text-3xl font-bold text-white">Competitor Intelligence</h1>
        </div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => <div key={i} className="h-32 rounded-xl bg-white/3 animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-5 h-5 text-orange-400" />
        <h1 className="text-3xl font-bold text-white">Competitor Intelligence</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        Observations tagged with competitor mentions, synthesized into competitive dossiers.
      </p>

      {competitors.length === 0 ? (
        <div className="p-8 rounded-xl border border-white/8 text-center">
          <Shield className="w-8 h-8 text-white/20 mx-auto mb-3" />
          <p className="text-sm text-white/40">No competitor intel captured yet.</p>
          <p className="text-xs text-white/25 mt-1">Tag observations as competitor intel in the Capture feed.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {competitors.map((group) => {
            const dossier = dossiers[group.competitor];
            const isExpanded = expandedCompetitor === group.competitor;

            return (
              <div key={group.competitor} className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
                {/* Header */}
                <div className="p-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{group.competitor}</h2>
                      <p className="text-xs text-white/40">{group.count} observations</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { void handleGenerateDossier(group.competitor); }}
                      disabled={generatingDossier === group.competitor}
                      className="px-4 py-2 rounded-lg bg-orange-500/15 border border-orange-500/25 text-orange-400 hover:bg-orange-500/25 text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {generatingDossier === group.competitor
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                        : dossier ? 'Regenerate Dossier' : 'Generate Dossier'
                      }
                    </button>
                    <button
                      onClick={() => setExpandedCompetitor(isExpanded ? null : group.competitor)}
                      className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/60 transition-all"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Dossier */}
                {dossier && (
                  <div className="px-5 pb-5 border-t border-white/8 pt-4">
                    <p className="text-sm text-white/80 leading-relaxed mb-4">{dossier.summary}</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2">Strengths</p>
                        <ul className="space-y-1.5">
                          {dossier.strengths?.map((s, i) => (
                            <li key={i} className="text-xs text-white/60 flex gap-2">
                              <span className="text-emerald-400">+</span>{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-red-400 uppercase tracking-wider mb-2">Threats</p>
                        <ul className="space-y-1.5">
                          {dossier.threats?.map((t, i) => (
                            <li key={i} className="text-xs text-white/60 flex gap-2">
                              <span className="text-red-400">!</span>{t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-blue-400 uppercase tracking-wider mb-2">Recommendations</p>
                        <ul className="space-y-1.5">
                          {dossier.recommendations?.map((r, i) => (
                            <li key={i} className="text-xs text-white/60 flex gap-2">
                              <span className="text-blue-400">→</span>{r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Observations */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-white/8 pt-4">
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Source Observations</p>
                    <div className="space-y-2">
                      {group.observations.map((obs) => <ObservationCard key={obs.id} observation={obs} />)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
