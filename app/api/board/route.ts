import { NextRequest, NextResponse } from 'next/server';
import { signals, strategies, patterns, driftScores, boardPackages } from '@/lib/store';
import type { BoardPackage } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ packages: boardPackages });
}

interface BoardBody {
  period: string;
}

interface BoardAIResult {
  executiveSummary: string;
  topPatterns: string[];
  strategyHealth: string;
  keyRisks: string[];
  keyOpportunities: string[];
  rawMarkdown: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as BoardBody;

  const signalContext = signals
    .slice(-40)
    .map((s) => `[${s.role}] (${s.category}): ${s.text}`)
    .join('\n');

  const strategyContext = strategies
    .map((s) => `- ${s.objective} (by ${s.authorRole})`)
    .join('\n');

  const patternContext = patterns
    .map((p) => `- ${p.title} [${p.confidence} confidence, ${p.signalCount} signals]`)
    .join('\n');

  const driftContext = driftScores.length > 0
    ? driftScores.map((d) => `- Strategy ${d.strategyId}: score ${d.score}/100 — ${d.reasoning}`).join('\n')
    : 'No drift analysis available.';

  const prompt = `You are a senior strategy advisor preparing an intelligence package for the Board of Directors of Apex Advisory Group.

Period: ${body.period}

Active Strategies:
${strategyContext}

Detected Patterns:
${patternContext}

Strategy Drift Analysis:
${driftContext}

Recent Signals (${signals.length} total):
${signalContext}

Generate a comprehensive board intelligence package. Return JSON only:
{
  "executiveSummary": "<3-4 sentence executive summary of organizational intelligence>",
  "topPatterns": ["<pattern summary 1>", "<pattern summary 2>", "<pattern summary 3>"],
  "strategyHealth": "<2-3 sentences on overall strategy execution health>",
  "keyRisks": ["<risk 1>", "<risk 2>", "<risk 3>"],
  "keyOpportunities": ["<opportunity 1>", "<opportunity 2>", "<opportunity 3>"],
  "rawMarkdown": "<full markdown document with headers, sections, and detail suitable for board distribution>"
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
        max_tokens: 3000,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    const raw = data.choices[0]?.message?.content ?? '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned) as BoardAIResult;

    const pkg: BoardPackage = {
      id: `board-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      period: body.period,
      executiveSummary: result.executiveSummary,
      topPatterns: result.topPatterns,
      strategyHealth: result.strategyHealth,
      keyRisks: result.keyRisks,
      keyOpportunities: result.keyOpportunities,
      rawMarkdown: result.rawMarkdown,
    };

    boardPackages.unshift(pkg);

    return NextResponse.json({ package: pkg });
  } catch {
    return NextResponse.json({ error: 'Board package generation failed' }, { status: 500 });
  }
}
