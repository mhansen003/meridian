import { NextRequest, NextResponse } from 'next/server';
import { signals, orgQuestions } from '@/lib/store';
import type { OrgQuestion } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ questions: orgQuestions });
}

interface AskBody {
  question: string;
  askedBy: string;
}

interface AskAIResult {
  answer: string;
  citations: string[];
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AskBody;

  const signalContext = signals
    .map((s) => `ID: ${s.id} | Role: ${s.role} | "${s.text}"`)
    .join('\n');

  const prompt = `You are an organizational intelligence AI with access to employee signals from Apex Advisory Group.

Employee signals:
${signalContext}

Question: "${body.question}"

Answer this question using ONLY the signal data above. Return JSON only:
{
  "answer": "<comprehensive answer based on signals>",
  "citations": ["<signal id 1>", "<signal id 2>"]
}

Cite the 2-4 most relevant signal IDs that support your answer.`;

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
        max_tokens: 800,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    const raw = data.choices[0]?.message?.content ?? '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned) as AskAIResult;

    const question: OrgQuestion = {
      id: `q-${Date.now()}`,
      question: body.question,
      answer: result.answer,
      citations: result.citations,
      askedAt: new Date().toISOString(),
      askedBy: body.askedBy,
    };

    orgQuestions.unshift(question);

    return NextResponse.json({ question });
  } catch {
    return NextResponse.json({ error: 'Failed to answer question' }, { status: 500 });
  }
}
