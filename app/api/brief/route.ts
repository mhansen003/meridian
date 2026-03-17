import { NextRequest, NextResponse } from 'next/server';
import { signals, briefCache } from '@/lib/store';

interface BriefAIResult {
  bullets: string[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') ?? '';
  const brief = briefCache[role];
  if (!brief) {
    return NextResponse.json({ brief: null });
  }
  return NextResponse.json({ brief });
}

interface BriefBody {
  role: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as BriefBody;

  const roleSignals = signals.filter((s) => s.role === body.role);
  const otherSignals = signals.filter((s) => s.role !== body.role).slice(-10);
  const allRelevant = [...roleSignals, ...otherSignals];

  const signalContext = allRelevant
    .map((s) => `[${s.role}] (${s.category}): ${s.text}`)
    .join('\n');

  const prompt = `You are an organizational intelligence AI generating a daily brief for a ${body.role} at Apex Advisory Group.

Recent organizational signals:
${signalContext}

Generate a concise daily brief with exactly 3 bullet points. Each bullet should:
- Be directly relevant to a ${body.role}'s daily priorities
- Reference specific signal intelligence
- Be actionable

Return JSON only:
{
  "bullets": [
    "<bullet 1>",
    "<bullet 2>",
    "<bullet 3>"
  ]
}`;

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
        max_tokens: 600,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    const raw = data.choices[0]?.message?.content ?? '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned) as BriefAIResult;

    briefCache[body.role] = result;

    return NextResponse.json({ brief: result });
  } catch {
    return NextResponse.json({ error: 'Brief generation failed' }, { status: 500 });
  }
}
