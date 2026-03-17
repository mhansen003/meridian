import { NextRequest, NextResponse } from 'next/server';
import { signals } from '@/lib/store';
import type { SignalCategory } from '@/lib/types';

const CATEGORIES: SignalCategory[] = ['Risk', 'Opportunity', 'Friction', 'Market Intel', 'Culture'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') ?? '30', 10);

  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const filtered = signals.filter((s) => new Date(s.timestamp) >= cutoff);

  // Build date buckets
  const dateMap: Record<string, Record<SignalCategory, number>> = {};

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split('T')[0] ?? '';
    dateMap[key] = { Risk: 0, Opportunity: 0, Friction: 0, 'Market Intel': 0, Culture: 0 };
  }

  for (const signal of filtered) {
    const key = signal.timestamp.split('T')[0] ?? '';
    if (dateMap[key]) {
      dateMap[key][signal.category]++;
    }
  }

  const dates = Object.keys(dateMap).sort();
  const series = CATEGORIES.map((category) => ({
    category,
    data: dates.map((date) => dateMap[date]?.[category] ?? 0),
  }));

  return NextResponse.json({ dates, series });
}
