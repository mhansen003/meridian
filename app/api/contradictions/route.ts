import { NextResponse } from 'next/server';
import { observations, contradictions } from '@/lib/store';
import type { Contradiction } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ contradictions });
}

interface ContradictionAIItem {
  observationIdA: string;
  observationIdB: string;
  roleA: string;
  roleB: string;
  summary: string;
}

export async function POST() {
  const recent = observations.slice(-20);

  const observationContext = recent
    .map((s) => `ID: ${s.id} | Role: ${s.role} | "${s.text}"`)
    .join('\n');

  const prompt = `You are an organizational intelligence AI. Analyze these observations from different roles and identify 2-3 pairs where people are saying conflicting or contradictory things.

Observations:
${observationContext}

Return JSON array only (no markdown):
[
  {
    "observationIdA": "<id>",
    "observationIdB": "<id>",
    "roleA": "<role of observation A>",
    "roleB": "<role of observation B>",
    "summary": "<one sentence describing the contradiction>"
  }
]

Only include genuine contradictions where people hold opposing views on the same topic.`;

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
        temperature: 0.4,
        max_tokens: 1000,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    const raw = data.choices[0]?.message?.content ?? '[]';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const items = JSON.parse(cleaned) as ContradictionAIItem[];

    const newContradictions: Contradiction[] = items.map((item) => ({
      id: `cont-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      observationIdA: item.observationIdA,
      observationIdB: item.observationIdB,
      roleA: item.roleA,
      roleB: item.roleB,
      summary: item.summary,
      detectedAt: new Date().toISOString(),
    }));

    contradictions.push(...newContradictions);

    return NextResponse.json({ contradictions: newContradictions });
  } catch {
    return NextResponse.json({ error: 'Contradiction detection failed' }, { status: 500 });
  }
}
