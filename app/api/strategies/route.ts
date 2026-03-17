import { NextResponse } from 'next/server';
import { strategies } from '@/lib/store';
import type { Strategy } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ strategies });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<Strategy, 'id' | 'timestamp'>;

  const newStrategy: Strategy = {
    ...body,
    id: `strat-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  strategies.push(newStrategy);

  return NextResponse.json({ strategy: newStrategy }, { status: 201 });
}
