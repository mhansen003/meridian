import { NextRequest, NextResponse } from 'next/server';
import { signals, webhookEvents } from '@/lib/store';
import type { Signal } from '@/lib/types';

interface SlackPayload {
  text?: string;
  event?: { text?: string };
  challenge?: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as SlackPayload;

  // Handle Slack URL verification challenge
  if (body.challenge) {
    return NextResponse.json({ challenge: body.challenge });
  }

  const text = body.text ?? body.event?.text ?? '';

  if (text) {
    const signal: Signal = {
      id: `sig-slack-${Date.now()}`,
      role: 'Senior Consultant',
      text: text.slice(0, 500),
      category: 'Market Intel',
      summary: 'Signal captured via Slack integration.',
      relatedStrategy: null,
      timestamp: new Date().toISOString(),
    };
    signals.push(signal);

    webhookEvents.unshift({
      id: `we-${Date.now()}`,
      source: 'Slack',
      text: text.slice(0, 200),
      receivedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ events: webhookEvents.slice(0, 5) });
}
