import { NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';
import { strategies } from '@/lib/store';
import type { SignalCategory } from '@/lib/types';

interface AnalyzeSignalBody {
  signal: string;
  role: string;
}

interface AnalyzeSignalResult {
  category: SignalCategory;
  summary: string;
  relatedStrategy: string | null;
}

export async function POST(request: Request) {
  const body = (await request.json()) as AnalyzeSignalBody;

  const strategyList = strategies
    .map((s) => `- ID: ${s.id} | "${s.objective}"`)
    .join('\n');

  const systemPrompt = `You are an organizational intelligence AI that analyzes employee signals and categorizes them.

Active company strategies:
${strategyList}

Respond with valid JSON only. No markdown, no explanation outside the JSON.`;

  const userMessage = `Analyze this signal from a ${body.role}:

"${body.signal}"

Return JSON in exactly this format:
{
  "category": "<one of: Risk | Opportunity | Friction | Market Intel | Culture>",
  "summary": "<one sentence summary of the key intelligence, 15 words or less>",
  "relatedStrategy": "<strategy ID string if clearly related, or null>"
}`;

  try {
    const raw = await callOpenRouter(
      [{ role: 'user', content: userMessage }],
      systemPrompt
    );

    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned) as AnalyzeSignalResult;

    return NextResponse.json(result);
  } catch {
    // Fallback categorization if AI fails
    const fallback: AnalyzeSignalResult = {
      category: 'Market Intel',
      summary: 'Signal captured for analysis.',
      relatedStrategy: null,
    };
    return NextResponse.json(fallback);
  }
}
