import { NextResponse } from 'next/server';
import { observations, orgDNA, setOrgDNA } from '@/lib/store';
import type { OrgDNA } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ dna: orgDNA });
}

interface DNAAIResult {
  profile: string;
  traits: string[];
}

export async function POST() {
  if (observations.length < 10) {
    return NextResponse.json(
      { error: `Not enough observations. Need at least 10, have ${observations.length}.` },
      { status: 400 }
    );
  }

  const observationCorpus = observations
    .map((s) => `[${s.role}] (${s.category}): ${s.text}`)
    .join('\n');

  const prompt = `You are an organizational intelligence AI. Based on these employee observations from Apex Advisory Group, synthesize an organizational DNA profile.

Observations:
${observationCorpus}

Return JSON only:
{
  "profile": "<3-4 sentence narrative describing the organization's character, values, tensions, and operating style as revealed by observation patterns>",
  "traits": ["<trait 1>", "<trait 2>", "<trait 3>", "<trait 4>", "<trait 5>", "<trait 6>"]
}

Traits should be short (2-4 words each), like "Execution-Oriented", "Risk-Aware", "AI-Curious", etc.`;

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
        temperature: 0.6,
        max_tokens: 800,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    const raw = data.choices[0]?.message?.content ?? '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned) as DNAAIResult;

    const dna: OrgDNA = {
      generatedAt: new Date().toISOString(),
      profile: result.profile,
      traits: result.traits,
      observationCount: observations.length,
    };

    setOrgDNA(dna);

    return NextResponse.json({ dna });
  } catch {
    return NextResponse.json({ error: 'DNA generation failed' }, { status: 500 });
  }
}
