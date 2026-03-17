import { NextResponse } from 'next/server';
import { signals } from '@/lib/store';
import type { Signal } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ signals: [...signals].reverse() });
}

interface SignalPostBody extends Omit<Signal, 'id' | 'timestamp'> {
  anonymous?: boolean;
  competitorTag?: string;
  isExitInterview?: boolean;
}

export async function POST(request: Request) {
  const body = (await request.json()) as SignalPostBody;

  const newSignal: Signal = {
    ...body,
    id: `sig-${Date.now()}`,
    timestamp: new Date().toISOString(),
    anonymous: body.anonymous,
    competitorTag: body.competitorTag,
    isExitInterview: body.isExitInterview,
  };

  signals.push(newSignal);

  return NextResponse.json({ signal: newSignal }, { status: 201 });
}
