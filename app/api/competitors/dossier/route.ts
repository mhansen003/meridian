import { NextRequest, NextResponse } from 'next/server';
import { observations, competitorDossiers } from '@/lib/store';
import type { CompetitorDossier } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const competitor = searchParams.get('competitor');
  if (!competitor) {
    return NextResponse.json({ dossiers: competitorDossiers });
  }
  const dossier = competitorDossiers.find((d) => d.competitor === competitor);
  return NextResponse.json({ dossier: dossier ?? null });
}

interface DossierBody {
  competitor: string;
}

interface DossierAIResult {
  summary: string;
  strengths: string[];
  threats: string[];
  recommendations: string[];
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as DossierBody;

  const competitorObservations = observations.filter((s) => s.competitorTag === body.competitor);

  if (competitorObservations.length === 0) {
    return NextResponse.json({ error: 'No observations found for this competitor' }, { status: 404 });
  }

  const observationContext = competitorObservations
    .map((s) => `[${s.role}]: ${s.text}`)
    .join('\n');

  const prompt = `You are an organizational intelligence AI. Synthesize these internal employee observations about competitor "${body.competitor}" into a competitive dossier.

Observations:
${observationContext}

Return JSON only:
{
  "summary": "<2-3 sentence executive summary of the competitive threat>",
  "strengths": ["<competitor strength 1>", "<competitor strength 2>", "<competitor strength 3>"],
  "threats": ["<specific threat 1>", "<specific threat 2>", "<specific threat 3>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
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
        max_tokens: 1000,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    const raw = data.choices[0]?.message?.content ?? '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned) as DossierAIResult;

    const dossier: CompetitorDossier = {
      competitor: body.competitor,
      observationIds: competitorObservations.map((s) => s.id),
      summary: result.summary,
      lastUpdated: new Date().toISOString(),
    };

    const existingIdx = competitorDossiers.findIndex((d) => d.competitor === body.competitor);
    if (existingIdx >= 0) {
      competitorDossiers.splice(existingIdx, 1, dossier);
    } else {
      competitorDossiers.push(dossier);
    }

    return NextResponse.json({ dossier, ...result });
  } catch {
    return NextResponse.json({ error: 'Dossier generation failed' }, { status: 500 });
  }
}
