'use client';

import { useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import { CATEGORY_COLORS } from '@/lib/store';
import type { SignalCategory } from '@/lib/types';

interface RoleNode {
  role: string;
  signalCount: number;
  dominantCategory: SignalCategory;
  lastSignalText: string;
}

const ORG_HIERARCHY = [
  ['CEO'],
  ['COO', 'Partner'],
  ['Practice Lead', 'Account Manager', 'Senior Consultant'],
  ['Senior Analyst', 'Operations Manager', 'HR Business Partner'],
];

const CATEGORY_GLOW: Record<string, string> = {
  Risk: 'shadow-red-500/30 border-red-500/30',
  Opportunity: 'shadow-emerald-500/30 border-emerald-500/30',
  Friction: 'shadow-amber-500/30 border-amber-500/30',
  'Market Intel': 'shadow-blue-500/30 border-blue-500/30',
  Culture: 'shadow-purple-500/30 border-purple-500/30',
};

const CATEGORY_BG: Record<string, string> = {
  Risk: 'bg-red-500/10',
  Opportunity: 'bg-emerald-500/10',
  Friction: 'bg-amber-500/10',
  'Market Intel': 'bg-blue-500/10',
  Culture: 'bg-purple-500/10',
};

export default function MapPage() {
  const [mapData, setMapData] = useState<RoleNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/map')
      .then((r) => r.json() as Promise<{ map: RoleNode[] }>)
      .then((d) => setMapData(d.map))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getNodeData = (role: string): RoleNode | null => {
    return mapData.find((n) => n.role === role) ?? null;
  };

  const maxSignals = Math.max(...mapData.map((n) => n.signalCount), 1);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <Map className="w-5 h-5 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Intelligence Map</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        Signal activity across your organizational structure. Node brightness indicates signal volume.
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {ORG_HIERARCHY.map((tier, tierIdx) => (
            <div key={tierIdx}>
              {/* Connector line from previous tier */}
              {tierIdx > 0 && (
                <div className="flex justify-center mb-4">
                  <div className="w-px h-6 bg-white/15" />
                </div>
              )}
              <div className="flex justify-center gap-4 flex-wrap">
                {tier.map((role) => {
                  const node = getNodeData(role);
                  const intensity = node ? node.signalCount / maxSignals : 0;
                  const glow = node ? CATEGORY_GLOW[node.dominantCategory] ?? '' : '';
                  const catBg = node ? CATEGORY_BG[node.dominantCategory] ?? '' : '';

                  return (
                    <div
                      key={role}
                      title={node ? `Last signal: ${node.lastSignalText}` : role}
                      className={`relative px-4 py-3 rounded-xl border transition-all cursor-default ${
                        node
                          ? `${catBg} ${glow} shadow-lg`
                          : 'bg-white/3 border-white/8'
                      }`}
                      style={{
                        opacity: node ? 0.5 + intensity * 0.5 : 0.4,
                        minWidth: '140px',
                        borderColor: node ? undefined : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <p className="text-sm font-semibold text-white/90 text-center mb-1">{role}</p>
                      {node ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${CATEGORY_COLORS[node.dominantCategory]}`}>
                            {node.signalCount}
                          </span>
                          <span className="text-[10px] text-white/40">{node.dominantCategory}</span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-white/25 text-center">0 signals</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-10 p-4 rounded-xl border border-white/8 bg-white/3">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Category Legend</p>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(CATEGORY_COLORS).map(([cat, cls]) => (
            <span key={cat} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{cat}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
