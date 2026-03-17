'use client';

import { useState } from 'react';
import { Zap, X } from 'lucide-react';
import type { VelocityAlert } from '@/lib/types';

interface VelocityAlertBannerProps {
  alert: VelocityAlert;
}

export default function VelocityAlertBanner({ alert }: VelocityAlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full bg-amber-500/15 border border-amber-500/30 rounded-xl px-4 py-3 flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <Zap className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-sm text-amber-300">
          <span className="font-semibold">Fast-moving pattern:</span>{' '}
          <span className="font-medium">{alert.theme}</span>{' '}
          &mdash; {alert.observationIds.length + 1} observations in the last 24 hours
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-amber-400/60 hover:text-amber-300 transition-colors"
        aria-label="Dismiss alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
