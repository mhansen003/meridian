import { NextResponse } from 'next/server';
import { velocityAlerts } from '@/lib/store';

export async function GET() {
  return NextResponse.json({ alerts: velocityAlerts });
}
