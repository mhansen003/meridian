import { NextRequest, NextResponse } from 'next/server';
import { observations, decisionMemories } from '@/lib/store';
import type { DecisionMemory } from '@/lib/types';

export async function GET() {
  const now = new Date();
  const memoriesWithReview = decisionMemories.map((d) => ({
    ...d,
    needsReview: new Date(d.resurface90) <= now,
  }));
  return NextResponse.json({ decisions: memoriesWithReview });
}

interface DecisionBody {
  title: string;
  rationale: string;
  strategyId: string | null;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as DecisionBody;

  const observationContext = observations.slice(-15).map((s) => s.id);
  const resurface90 = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

  const decision: DecisionMemory = {
    id: `dec-${Date.now()}`,
    title: body.title,
    rationale: body.rationale,
    observationContext,
    strategyId: body.strategyId,
    madeAt: new Date().toISOString(),
    resurface90,
  };

  decisionMemories.unshift(decision);

  return NextResponse.json({ decision }, { status: 201 });
}
