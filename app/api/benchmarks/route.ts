import { NextResponse } from 'next/server';
import { benchmarkData } from '@/lib/store';

export async function GET() {
  return NextResponse.json({ benchmarks: benchmarkData });
}
