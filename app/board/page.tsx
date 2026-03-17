'use client';

import { useState, useEffect } from 'react';
import type { BoardPackage } from '@/lib/types';
import { FileText, Loader2, Download, ChevronDown, ChevronUp } from 'lucide-react';

const PERIODS = ['Q1 2026', 'Q2 2026', 'Full Year 2026'];

export default function BoardPage() {
  const [period, setPeriod] = useState('Q1 2026');
  const [generating, setGenerating] = useState(false);
  const [packages, setPackages] = useState<BoardPackage[]>([]);
  const [currentPackage, setCurrentPackage] = useState<BoardPackage | null>(null);
  const [observationCount, setObservationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedPkg, setExpandedPkg] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgsRes, observationsRes] = await Promise.all([
          fetch('/api/board'),
          fetch('/api/observations'),
        ]);
        const pkgsData = (await pkgsRes.json()) as { packages: BoardPackage[] };
        const observationsData = (await observationsRes.json()) as { observations: unknown[] };
        setPackages(pkgsData.packages);
        setObservationCount(observationsData.observations.length);
      } catch (err) {
        console.error('Failed to load board page', err);
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setCurrentPackage(null);
    try {
      const res = await fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period }),
      });
      const data = (await res.json()) as { package: BoardPackage };
      setCurrentPackage(data.package);
      setPackages((prev) => [data.package, ...prev]);
    } catch (err) {
      console.error('Board package generation failed', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (pkg: BoardPackage) => {
    const blob = new Blob([pkg.rawMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meridian-board-package-${pkg.period.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const displayPackage = currentPackage;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Board Intelligence Package</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        AI-generated board-ready intelligence synthesis from your organizational observation data.
      </p>

      {/* Generator */}
      <div className="p-5 rounded-2xl border border-white/10 bg-white/3 mb-8">
        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none text-white text-sm transition-all appearance-none cursor-pointer"
          >
            {PERIODS.map((p) => (
              <option key={p} value={p} className="bg-[#1a1d26]">{p}</option>
            ))}
          </select>
          <button
            onClick={() => { void handleGenerate(); }}
            disabled={generating}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
          >
            {generating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Compiling intelligence across {observationCount} observations...</>
            ) : (
              'Generate Package →'
            )}
          </button>
        </div>
      </div>

      {/* Current Package */}
      {displayPackage && (
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{displayPackage.period} — Board Intelligence Package</h2>
            <button
              onClick={() => handleDownload(displayPackage)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 hover:border-blue-500/30 hover:bg-blue-500/5 text-white/60 hover:text-blue-400 text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Download Markdown
            </button>
          </div>

          <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/5">
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-2">Executive Summary</p>
            <p className="text-sm text-white/80 leading-relaxed">{displayPackage.executiveSummary}</p>
          </div>

          <div className="p-5 rounded-xl border border-white/10 bg-white/3">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Top Patterns</p>
            <ol className="space-y-2">
              {displayPackage.topPatterns.map((pattern, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/70">
                  <span className="text-white/30 font-mono shrink-0">{i + 1}.</span>
                  {pattern}
                </li>
              ))}
            </ol>
          </div>

          <div className="p-5 rounded-xl border border-white/10 bg-white/3">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Strategy Health</p>
            <p className="text-sm text-white/80 leading-relaxed">{displayPackage.strategyHealth}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
              <p className="text-xs text-red-400 uppercase tracking-wider mb-3">Key Risks</p>
              <ul className="space-y-2">
                {displayPackage.keyRisks.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-white/70">
                    <span className="text-red-400 shrink-0">•</span>{r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <p className="text-xs text-emerald-400 uppercase tracking-wider mb-3">Key Opportunities</p>
              <ul className="space-y-2">
                {displayPackage.keyOpportunities.map((o, i) => (
                  <li key={i} className="flex gap-2 text-sm text-white/70">
                    <span className="text-emerald-400 shrink-0">•</span>{o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Previous Packages */}
      {!loading && packages.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Previous Packages</h2>
          <div className="space-y-2">
            {packages.map((pkg) => (
              <div key={pkg.id} className="rounded-xl border border-white/8 overflow-hidden">
                <button
                  onClick={() => setExpandedPkg(expandedPkg === pkg.id ? null : pkg.id)}
                  className="w-full text-left p-4 hover:bg-white/3 transition-all flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{pkg.period}</p>
                    <p className="text-xs text-white/40">{new Date(pkg.generatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(pkg); }}
                      className="p-1.5 rounded-lg hover:bg-white/8 text-white/40 hover:text-white/60 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {expandedPkg === pkg.id ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                  </div>
                </button>
                {expandedPkg === pkg.id && (
                  <div className="px-4 pb-4 border-t border-white/8 pt-3">
                    <p className="text-sm text-white/70 leading-relaxed">{pkg.executiveSummary}</p>
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
