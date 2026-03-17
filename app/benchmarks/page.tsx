'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BarChart3 } from 'lucide-react';
import type { BenchmarkData } from '@/lib/types';

const BenchmarksChart = dynamic(() => import('@/components/BenchmarksChart'), { ssr: false });

export default function BenchmarksPage() {
  const [data, setData] = useState<BenchmarkData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/benchmarks')
      .then((r) => r.json() as Promise<{ benchmarks: BenchmarkData[] }>)
      .then((d) => setData(d.benchmarks))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const signalCapture = data.find((d) => d.category === 'Signal Capture Rate');

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-5 h-5 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Industry Benchmarks</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        Apex Advisory Group vs. Professional Services Median
      </p>

      {loading ? (
        <div className="h-80 rounded-xl bg-white/3 animate-pulse flex items-center justify-center">
          <p className="text-sm text-white/30">Loading benchmarks...</p>
        </div>
      ) : (
        <>
          <BenchmarksChart data={data} />

          {/* Callout card */}
          {signalCapture && (
            <div className="mt-6 p-5 rounded-xl border border-amber-500/25 bg-amber-500/8">
              <p className="text-sm font-semibold text-amber-300 mb-1">
                Your signal capture rate is in the {signalCapture.percentile}th percentile — below the professional services median
              </p>
              <p className="text-xs text-white/40">
                Industry median: {signalCapture.industryMedian} · Your score: {signalCapture.orgScore}
              </p>
            </div>
          )}

          {/* Interpretive section */}
          <div className="mt-6 p-5 rounded-xl border border-white/10 bg-white/3">
            <h2 className="text-base font-semibold text-white mb-3">What This Means</h2>
            <ul className="space-y-2">
              <li className="flex gap-2 text-sm text-white/60">
                <span className="text-blue-400 shrink-0">→</span>
                Your cross-role coverage (88th percentile) is a competitive advantage — most firms struggle to capture signals from all organizational levels.
              </li>
              <li className="flex gap-2 text-sm text-white/60">
                <span className="text-amber-400 shrink-0">→</span>
                Decision Memory Rate at 28th percentile suggests decisions are being made without systematic signal context — a gap that compounds over time.
              </li>
              <li className="flex gap-2 text-sm text-white/60">
                <span className="text-emerald-400 shrink-0">→</span>
                Pattern Detection Velocity at 72nd percentile means you&apos;re identifying patterns faster than most peers — accelerate this by increasing signal volume.
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
