import { NextRequest, NextResponse } from 'next/server';
import { signals } from '@/lib/store';
import type { Signal } from '@/lib/types';

interface CRMPayload {
  dealName: string;
  stage: string;
  notes: string;
  source: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CRMPayload;

  const signal: Signal = {
    id: `sig-crm-${Date.now()}`,
    role: 'Account Manager',
    text: `[CRM: ${body.dealName} — ${body.stage}] ${body.notes}`,
    category: 'Market Intel',
    summary: `CRM signal from ${body.source}: ${body.dealName} moved to ${body.stage}`,
    relatedStrategy: null,
    timestamp: new Date().toISOString(),
  };

  signals.push(signal);

  return NextResponse.json({ signal }, { status: 201 });
}
