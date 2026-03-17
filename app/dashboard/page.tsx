'use client';

import { useState, useEffect, useCallback } from 'react';
import SignalCard from '@/components/SignalCard';
import StrategyCard from '@/components/StrategyCard';
import PatternInsight from '@/components/PatternInsight';
import VelocityAlertBanner from '@/components/VelocityAlertBanner';
import { patterns } from '@/lib/store';
import type { Signal, Strategy, VelocityAlert } from '@/lib/types';
import { Activity, Target, Users, Brain, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [velocityAlertsData, setVelocityAlertsData] = useState<VelocityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      const [signalsRes, strategiesRes, alertsRes] = await Promise.all([
        fetch('/api/signals'),
        fetch('/api/strategies'),
        fetch('/api/velocity-alerts'),
      ]);
      const [signalsData, strategiesData, alertsData] = await Promise.all([
        signalsRes.json() as Promise<{ signals: Signal[] }>,
        strategiesRes.json() as Promise<{ strategies: Strategy[] }>,
        alertsRes.json() as Promise<{ alerts: VelocityAlert[] }>,
      ]);
      setSignals(signalsData.signals);
      setStrategies(strategiesData.strategies);
      setVelocityAlertsData(alertsData.alerts);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
    const interval = setInterval(() => { void fetchData(); }, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Velocity Alert Banners */}
      {velocityAlertsData.slice(0, 3).map((alert) => (
        <VelocityAlertBanner key={alert.id} alert={alert} />
      ))}

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Intelligence Dashboard</h1>
          <p className="text-white/40 text-sm">Apex Advisory Group &middot; Live organizational intelligence feed</p>
        </div>
        <button
          onClick={() => { void fetchData(); }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 text-white/50 hover:text-white/80 text-xs transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Signals Captured"
          value={loading ? '—' : String(signals.length)}
          icon={<Activity className="w-4 h-4 text-cyan-400" />}
          color="text-cyan-400"
        />
        <StatCard
          label="Patterns Detected"
          value="3"
          icon={<Brain className="w-4 h-4 text-violet-400" />}
          color="text-violet-400"
        />
        <StatCard
          label="Active Strategies"
          value={loading ? '—' : String(strategies.length)}
          icon={<Target className="w-4 h-4 text-blue-400" />}
          color="text-blue-400"
        />
        <StatCard
          label="Roles Covered"
          value="8"
          icon={<Users className="w-4 h-4 text-emerald-400" />}
          color="text-emerald-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        {/* Signal Feed (60%) */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Live Signal Feed</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs text-white/40">
                Updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl skeleton" />
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {signals.map((signal) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
          )}
        </div>

        {/* Strategy Panel (40%) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Active Strategies</h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl skeleton" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {strategies.map((strategy) => (
                <StrategyCard key={strategy.id} strategy={strategy} showTranslations />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Intelligence Patterns */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Intelligence Patterns</h2>
          <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 text-xs font-medium">
            AI-Detected
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {patterns.slice(0, 3).map((pattern) => (
            <PatternInsight key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-white/8 bg-white/3">
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
      </div>
      <p className="text-xs text-white/40">{label}</p>
    </div>
  );
}
