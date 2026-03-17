import { NextRequest, NextResponse } from 'next/server';

interface OKRBody {
  okrText: string;
}

interface KeyResult {
  title: string;
  categories: string[];
  prompts: string[];
}

interface OKRAIResult {
  keyResults: KeyResult[];
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as OKRBody;

  const prompt = `You are an organizational intelligence AI. Parse this OKR text and map each key result to observation categories and employee prompts.

OKR Text:
${body.okrText}

For each key result, identify:
1. Which observation categories it maps to (from: Risk, Opportunity, Friction, Market Intel, Culture)
2. 3 employee prompt questions to use in a Capture campaign

Return JSON only:
{
  "keyResults": [
    {
      "title": "<key result title>",
      "categories": ["<category1>", "<category2>"],
      "prompts": ["<prompt1>", "<prompt2>", "<prompt3>"]
    }
  ]
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
        max_tokens: 1500,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    const raw = data.choices[0]?.message?.content ?? '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned) as OKRAIResult;

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'OKR synthesis failed' }, { status: 500 });
  }
}
