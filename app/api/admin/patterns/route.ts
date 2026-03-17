import { NextResponse } from 'next/server';
import { patterns } from '@/lib/store';

export async function GET() {
  // Return patterns with signal counts only — no author names
  const anonymized = patterns.map((p) => ({
    id: p.id,
    title: p.title,
    confidence: p.confidence,
    signalCount: p.signalCount,
    category: p.category,
    relatedStrategy: p.relatedStrategy,
  }));
  return NextResponse.json({ patterns: anonymized });
}
