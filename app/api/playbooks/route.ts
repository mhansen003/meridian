import { NextRequest, NextResponse } from 'next/server';
import { playbooks } from '@/lib/store';
import type { Playbook } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ playbooks });
}

interface PlaybookBody {
  patternTitle: string;
  patternDescription: string;
}

interface PlaybookAIResult {
  title: string;
  steps: string[];
  owner: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PlaybookBody;

  const prompt = `You are an organizational intelligence AI. Generate a concrete action playbook for the following organizational pattern.

Pattern Title: ${body.patternTitle}
Pattern Description: ${body.patternDescription}

Return JSON only:
{
  "title": "<playbook title>",
  "steps": [
    "<step 1 — specific, actionable>",
    "<step 2>",
    "<step 3>",
    "<step 4>",
    "<step 5>",
    "<step 6>"
  ],
  "owner": "<recommended role to own this playbook>"
}

Steps should be 5-7 specific, actionable steps. Be concrete.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://meridian.vercel.app',
        'X-Title': 'Meridian',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4.6',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    const raw = data.choices[0]?.message?.content ?? '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned) as PlaybookAIResult;

    const playbook: Playbook = {
      id: `pb-${Date.now()}`,
      triggeredByPattern: body.patternTitle,
      title: result.title,
      steps: result.steps,
      owner: result.owner,
      createdAt: new Date().toISOString(),
    };

    playbooks.unshift(playbook);

    return NextResponse.json({ playbook }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Playbook generation failed' }, { status: 500 });
  }
}
