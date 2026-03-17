import { NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';
import { strategies, observations, velocityAlerts } from '@/lib/store';
import type { SignalCategory, VelocityAlert } from '@/lib/types';

interface AnalyzeObservationBody {
  observation: string;
  role: string;
}

interface AnalyzeObservationResult {
  category: SignalCategory;
  summary: string;
  relatedStrategy: string | null;
  theme: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as AnalyzeObservationBody;

  const strategyList = strategies
    .map((s) => `- ID: ${s.id} | "${s.objective}"`)
    .join('\n');

  const systemPrompt = `You are an organizational intelligence AI that analyzes employee observations and categorizes them.

Active company strategies:
${strategyList}

Respond with valid JSON only. No markdown, no explanation outside the JSON.`;

  const userMessage = `Analyze this observation from a ${body.role}:

"${body.observation}"

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
    const result = JSON.parse(cleaned) as AnalyzeObservationResult;

    // Velocity check: count observations in last 24h with same theme
    if (result.theme) {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentThemeObservations = observations.filter(
        (s) => s.theme === result.theme && new Date(s.timestamp) >= cutoff
      );
      if (recentThemeObservations.length >= 2) {
        // 3+ including the new one being analyzed
        const alert: VelocityAlert = {
          id: `va-${Date.now()}`,
          theme: result.theme,
          observationIds: recentThemeObservations.map((s) => s.id),
          detectedAt: new Date().toISOString(),
          summary: `${recentThemeObservations.length + 1} observations around "${result.theme}" in the last 24 hours.`,
        };
        velocityAlerts.unshift(alert);
      }
    }

    return NextResponse.json(result);
  } catch {
    // Fallback categorization if AI fails
    const fallback: AnalyzeObservationResult = {
      category: 'Market Intel',
      summary: 'Observation captured for analysis.',
      relatedStrategy: null,
      theme: 'General Observation',
    };
    return NextResponse.json(fallback);
  }
}
