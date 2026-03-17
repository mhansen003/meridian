import { NextRequest, NextResponse } from 'next/server';
import { exitInterviews, observations } from '@/lib/store';
import type { ExitInterview, Observation } from '@/lib/types';

export async function GET() {
  // Anonymized — no role shown
  const anonymized = exitInterviews.map(({ role: _role, ...rest }) => rest);
  return NextResponse.json({ interviews: anonymized });
}

interface ExitBody {
  role: string;
  department: string;
  tenureYears: number;
  responses: { question: string; answer: string }[];
}

interface ExitAIResult {
  knowledgeExtract: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ExitBody;

  const responseContext = body.responses
    .map((r) => `Q: ${r.question}\nA: ${r.answer}`)
    .join('\n\n');

  const prompt = `You are an organizational intelligence AI. Extract the key institutional knowledge from this exit interview.

Role: ${body.role}
Department: ${body.department}
Tenure: ${body.tenureYears} years

Interview Responses:
${responseContext}

Return JSON only:
{
  "knowledgeExtract": "<3-4 sentence synthesis of the most valuable knowledge, lessons, and warnings this person is leaving behind — written for the organization>"
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
        max_tokens: 500,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    const raw = data.choices[0]?.message?.content ?? '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned) as ExitAIResult;

    const interview: ExitInterview = {
      id: `exit-${Date.now()}`,
      role: body.role,
      department: body.department,
      tenureYears: body.tenureYears,
      responses: body.responses,
      knowledgeExtract: result.knowledgeExtract,
      submittedAt: new Date().toISOString(),
    };

    exitInterviews.unshift(interview);

    // Also push as an observation
    const observation: Observation = {
      id: `sig-exit-${Date.now()}`,
      role: body.role as Observation['role'],
      text: result.knowledgeExtract,
      category: 'Culture',
      summary: `Exit interview knowledge extract — ${body.tenureYears}yr ${body.department} ${body.role}`,
      relatedStrategy: null,
      timestamp: new Date().toISOString(),
      isExitInterview: true,
    };
    observations.push(observation);

    return NextResponse.json({ interview }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Exit interview processing failed' }, { status: 500 });
  }
}
