import { NextRequest, NextResponse } from 'next/server';
import { signals, strategies, driftScores } from '@/lib/store';
import type { DriftScore } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ driftScores });
}

interface DriftBody {
  strategyId: string;
}

interface DriftAIResult {
  score: number;
  alignedSignals: number;
  misalignedSignals: number;
  reasoning: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as DriftBody;
  const strategy = strategies.find((s) => s.id === body.strategyId);
  if (!strategy) {
    return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });
  }

  const signalContext = signals
    .slice(-30)
    .map((s) => `[${s.role}] ${s.text}`)
    .join('\n');

  const prompt = `You are an organizational intelligence AI. Evaluate the alignment of the following signals with this strategic objective.

Strategy: "${strategy.objective}"

Recent signals:
${signalContext}

Return JSON only:
{
  "score": <0-100 integer, 100 = perfectly aligned>,
  "alignedSignals": <count of signals supporting the strategy>,
  "misalignedSignals": <count of signals contradicting or creating friction>,
  "reasoning": "<2-3 sentence explanation>"
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
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    const raw = data.choices[0]?.message?.content ?? '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned) as DriftAIResult;

    const driftScore: DriftScore = {
      strategyId: body.strategyId,
      score: result.score,
      alignedSignals: result.alignedSignals,
      misalignedSignals: result.misalignedSignals,
      flaggedAt: new Date().toISOString(),
      reasoning: result.reasoning,
    };

    // Replace existing score for this strategy if present
    const existingIdx = driftScores.findIndex((d) => d.strategyId === body.strategyId);
    if (existingIdx >= 0) {
      driftScores.splice(existingIdx, 1, driftScore);
    } else {
      driftScores.push(driftScore);
    }

    return NextResponse.json({ driftScore });
  } catch {
    return NextResponse.json({ error: 'Drift analysis failed' }, { status: 500 });
  }
}
