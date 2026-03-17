import { NextResponse } from 'next/server';
import { signals } from '@/lib/store';
import type { Signal } from '@/lib/types';

export async function GET() {
  const competitorMap: Record<string, Signal[]> = {};

  for (const signal of signals) {
    if (signal.competitorTag) {
      if (!competitorMap[signal.competitorTag]) {
        competitorMap[signal.competitorTag] = [];
      }
      competitorMap[signal.competitorTag].push(signal);
    }
  }

  const result = Object.entries(competitorMap).map(([competitor, sigs]) => ({
    competitor,
    signals: sigs,
    count: sigs.length,
  }));

  return NextResponse.json({ competitors: result });
}
