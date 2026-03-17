import { NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';
import { ROLES } from '@/lib/store';
import type { RoleTranslation } from '@/lib/types';

interface TranslateBody {
  strategy: string;
  authorRole: string;
}

interface TranslateResult {
  translations: RoleTranslation[];
}

export async function POST(request: Request) {
  const body = (await request.json()) as TranslateBody;

  const systemPrompt = `You are an organizational intelligence AI that translates executive strategy into role-specific operational guidance for a management consulting firm called Apex Advisory Group (~800 employees). Be concrete, specific, and practical. Avoid corporate jargon. Think about what each role actually does day-to-day.`;

  const rolesStr = ROLES.join(', ');

  const userMessage = `A ${body.authorRole} has set this strategic priority:

"${body.strategy}"

Translate this into role-specific guidance for each of these roles: ${rolesStr}

Return valid JSON only in exactly this format (array of role translations):
{
  "translations": [
    {
      "role": "<role name>",
      "context": "<2-3 sentences explaining what this strategy means specifically for someone in this role>",
      "focus": ["<specific action item 1>", "<specific action item 2>", "<specific action item 3>"],
      "watchFor": ["<risk or watch item 1>", "<risk or watch item 2>"]
    }
  ]
}

Include all ${ROLES.length} roles. Make guidance specific to what that role does, not generic.`;

  try {
    const raw = await callOpenRouter(
      [{ role: 'user', content: userMessage }],
      systemPrompt
    );

    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned) as TranslateResult;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed. Please check your API key and try again.' },
      { status: 500 }
    );
  }
}
