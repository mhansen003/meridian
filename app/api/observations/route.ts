import { NextResponse } from 'next/server';
import { observations } from '@/lib/store';
import type { Observation } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ observations: [...observations].reverse() });
}

interface ObservationPostBody extends Omit<Observation, 'id' | 'timestamp'> {
  anonymous?: boolean;
  competitorTag?: string;
  isExitInterview?: boolean;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ObservationPostBody;

  const newObservation: Observation = {
    ...body,
    id: `sig-${Date.now()}`,
    timestamp: new Date().toISOString(),
    anonymous: body.anonymous,
    competitorTag: body.competitorTag,
    isExitInterview: body.isExitInterview,
  };

  observations.push(newObservation);

  return NextResponse.json({ observation: newObservation }, { status: 201 });
}
