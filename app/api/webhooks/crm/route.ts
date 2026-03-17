import { NextRequest, NextResponse } from 'next/server';
import { observations } from '@/lib/store';
import type { Observation } from '@/lib/types';

interface CRMPayload {
  dealName: string;
  stage: string;
  notes: string;
  source: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CRMPayload;

  const observation: Observation = {
    id: `sig-crm-${Date.now()}`,
    role: 'Account Manager',
    text: `[CRM: ${body.dealName} — ${body.stage}] ${body.notes}`,
    category: 'Market Intel',
    summary: `CRM observation from ${body.source}: ${body.dealName} moved to ${body.stage}`,
    relatedStrategy: null,
    timestamp: new Date().toISOString(),
  };

  observations.push(observation);

  return NextResponse.json({ observation }, { status: 201 });
}
