import { NextRequest, NextResponse } from 'next/server';
import { signals, strategySimulations } from '@/lib/store';
import type { StrategySimulation } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ simulations: strategySimulations });
}

interface SimulateBody {
  strategyText: string;
  authorRole: string;
}

interface SimulateAIResult {
  predictedReaction: string;
  alignmentScore: number;
  risks: string[];
  opportunities: string[];
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as SimulateBody;

  const signalContext = signals
    .slice(-25)
    .map((s) => `[${s.role}] (${s.category}): ${s.text}`)
    .join('\n');

  const prompt = `You are an organizational intelligence AI. Test this proposed strategy against current organizational signals to predict how it will land.

Proposed Strategy (from ${body.authorRole}):
"${body.strategyText}"

Current organizational signals:
${signalContext}

Return JSON only:
{
  "predictedReaction": "<2-3 sentence narrative of how the organization will likely react>",
  "alignmentScore": <0-100 integer, how well this aligns with current signal patterns>,
  "risks": ["<risk 1>", "<risk 2>", "<risk 3>"],
  "opportunities": ["<opportunity 1>", "<opportunity 2>", "<opportunity 3>"]
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
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    const raw = data.choices[0]?.message?.content ?? '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned) as SimulateAIResult;

    const simulation: StrategySimulation = {
      id: `sim-${Date.now()}`,
      strategyText: body.strategyText,
      authorRole: body.authorRole,
      predictedReaction: result.predictedReaction,
      alignmentScore: result.alignmentScore,
      risks: result.risks,
      opportunities: result.opportunities,
      simulatedAt: new Date().toISOString(),
    };

    strategySimulations.unshift(simulation);

    return NextResponse.json({ simulation });
  } catch {
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}
