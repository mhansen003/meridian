import { NextResponse } from 'next/server';
import { observations } from '@/lib/store';
import type { SignalCategory } from '@/lib/types';

export async function GET() {
  const roleMap: Record<string, { observationCount: number; categories: Record<string, number>; lastObservationText: string }> = {};

  for (const observation of observations) {
    if (!roleMap[observation.role]) {
      roleMap[observation.role] = { observationCount: 0, categories: {}, lastObservationText: '' };
    }
    roleMap[observation.role].observationCount++;
    roleMap[observation.role].categories[observation.category] = (roleMap[observation.role].categories[observation.category] ?? 0) + 1;
    roleMap[observation.role].lastObservationText = observation.text.slice(0, 80);
  }

  const result = Object.entries(roleMap).map(([role, data]) => {
    const dominantCategory = Object.entries(data.categories).sort((a, b) => b[1] - a[1])[0]?.[0] as SignalCategory ?? 'Market Intel';
    return {
      role,
      observationCount: data.observationCount,
      dominantCategory,
      lastObservationText: data.lastObservationText,
    };
  });

  return NextResponse.json({ map: result });
}
