'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp } from 'lucide-react';

const TrendsChart = dynamic(() => import('@/components/TrendsChart'), { ssr: false });

interface TrendsData {
  dates: string[];
  series: { category: string; data: number[] }[];
}

export default function TrendsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/trends?days=${days}`)
      .then((r) => r.json() as Promise<TrendsData>)
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Observation Trends</h1>
          </div>
          <p className="text-white/40 text-sm">Observation volume by category over time.</p>
        </div>
        <div className="flex items-center gap-2">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                days === d
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-white/50 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-80 rounded-xl bg-white/3 animate-pulse flex items-center justify-center">
          <p className="text-sm text-white/30">Loading trends...</p>
        </div>
      ) : data ? (
        <TrendsChart data={data} />
      ) : (
        <div className="h-80 rounded-xl border border-white/8 flex items-center justify-center">
          <p className="text-sm text-white/40">No trend data available.</p>
        </div>
      )}
    </div>
  );
}
