'use client';

// This page is deprecated. Use /capture instead.
// Kept for backward compatibility.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PulsePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/capture');
  }, [router]);
  return null;
}
