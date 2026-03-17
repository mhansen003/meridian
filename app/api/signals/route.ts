import { NextResponse } from 'next/server';
import { signals } from '@/lib/store';
import type { Signal } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ signals: [...signals].reverse() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<Signal, 'id' | 'timestamp'>;

  const newSignal: Signal = {
    ...body,
    id: `sig-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  signals.push(newSignal);

  return NextResponse.json({ signal: newSignal }, { status: 201 });
}
