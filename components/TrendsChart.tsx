'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrendsData {
  dates: string[];
  series: { category: string; data: number[] }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Risk: '#f87171',
  Opportunity: '#34d399',
  Friction: '#fbbf24',
  'Market Intel': '#60a5fa',
  Culture: '#a78bfa',
};

export default function TrendsChart({ data }: { data: TrendsData }) {
  // Transform into recharts format
  const chartData = data.dates.map((date, i) => {
    const point: Record<string, string | number> = { date: date.slice(5) }; // MM-DD
    for (const series of data.series) {
      point[series.category] = series.data[i] ?? 0;
    }
    return point;
  });

  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-white/3">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: '#13161f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '12px',
            }}
            labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
          />
          {data.series.map((series) => (
            <Line
              key={series.category}
              type="monotone"
              dataKey={series.category}
              stroke={CATEGORY_COLORS[series.category] ?? '#94a3b8'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap mt-4 justify-center">
        {data.series.map((series) => (
          <div key={series.category} className="flex items-center gap-1.5">
            <div
              className="w-3 h-0.5 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[series.category] ?? '#94a3b8' }}
            />
            <span className="text-xs text-white/50">{series.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
