import { NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';
import { strategies, signals, velocityAlerts } from '@/lib/store';
import type { SignalCategory, VelocityAlert } from '@/lib/types';

interface AnalyzeSignalBody {
  signal: string;
  role: string;
}

interface AnalyzeSignalResult {
  category: SignalCategory;
  summary: string;
  relatedStrategy: string | null;
  theme: string;
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
  "relatedStrategy": "<strategy ID string if clearly related, or null>",
  "theme": "<2-3 word theme label, e.g. 'AI Capability Gap', 'Delivery Friction', 'Competitor Threat'>"
}`;

  try {
    const raw = await callOpenRouter(
      [{ role: 'user', content: userMessage }],
      systemPrompt
    );

    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned) as AnalyzeSignalResult;

    // Velocity check: count signals in last 24h with same theme
    if (result.theme) {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentThemeSignals = signals.filter(
        (s) => s.theme === result.theme && new Date(s.timestamp) >= cutoff
      );
      if (recentThemeSignals.length >= 2) {
        // 3+ including the new one being analyzed
        const alert: VelocityAlert = {
          id: `va-${Date.now()}`,
          theme: result.theme,
          signalIds: recentThemeSignals.map((s) => s.id),
          detectedAt: new Date().toISOString(),
          summary: `${recentThemeSignals.length + 1} signals around "${result.theme}" in the last 24 hours.`,
        };
        velocityAlerts.unshift(alert);
      }
    }

    return NextResponse.json(result);
  } catch {
    // Fallback categorization if AI fails
    const fallback: AnalyzeSignalResult = {
      category: 'Market Intel',
      summary: 'Signal captured for analysis.',
      relatedStrategy: null,
      theme: 'General Signal',
    };
    return NextResponse.json(fallback);
  }
}
