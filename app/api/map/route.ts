import { NextResponse } from 'next/server';
import { signals } from '@/lib/store';
import type { SignalCategory } from '@/lib/types';

export async function GET() {
  const roleMap: Record<string, { signalCount: number; categories: Record<string, number>; lastSignalText: string }> = {};

  for (const signal of signals) {
    if (!roleMap[signal.role]) {
      roleMap[signal.role] = { signalCount: 0, categories: {}, lastSignalText: '' };
    }
    roleMap[signal.role].signalCount++;
    roleMap[signal.role].categories[signal.category] = (roleMap[signal.role].categories[signal.category] ?? 0) + 1;
    roleMap[signal.role].lastSignalText = signal.text.slice(0, 80);
  }

  const result = Object.entries(roleMap).map(([role, data]) => {
    const dominantCategory = Object.entries(data.categories).sort((a, b) => b[1] - a[1])[0]?.[0] as SignalCategory ?? 'Market Intel';
    return {
      role,
      signalCount: data.signalCount,
      dominantCategory,
      lastSignalText: data.lastSignalText,
    };
  });

  return NextResponse.json({ map: result });
}
