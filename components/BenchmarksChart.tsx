'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { BenchmarkData } from '@/lib/types';

interface BenchmarksChartProps {
  data: BenchmarkData[];
}

export default function BenchmarksChart({ data }: BenchmarksChartProps) {
  const chartData = data.map((d) => ({
    name: d.category.replace(' ', '\n'),
    'Your Score': d.orgScore,
    'Industry Median': d.industryMedian,
  }));

  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-white/3">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#13161f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '12px',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}
          />
          <Bar dataKey="Your Score" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Industry Median" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
