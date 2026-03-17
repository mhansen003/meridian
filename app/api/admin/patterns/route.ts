import { NextResponse } from 'next/server';
import { patterns } from '@/lib/store';

export async function GET() {
  // Return patterns with observation counts only — no author names
  const anonymized = patterns.map((p) => ({
    id: p.id,
    title: p.title,
    confidence: p.confidence,
    observationCount: p.observationCount,
    category: p.category,
    relatedStrategy: p.relatedStrategy,
  }));
  return NextResponse.json({ patterns: anonymized });
}
