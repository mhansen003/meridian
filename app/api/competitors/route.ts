import { NextResponse } from 'next/server';
import { observations } from '@/lib/store';
import type { Observation } from '@/lib/types';

export async function GET() {
  const competitorMap: Record<string, Observation[]> = {};

  for (const observation of observations) {
    if (observation.competitorTag) {
      if (!competitorMap[observation.competitorTag]) {
        competitorMap[observation.competitorTag] = [];
      }
      competitorMap[observation.competitorTag].push(observation);
    }
  }

  const result = Object.entries(competitorMap).map(([competitor, obs]) => ({
    competitor,
    observations: obs,
    count: obs.length,
  }));

  return NextResponse.json({ competitors: result });
}
