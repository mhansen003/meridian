'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2 } from 'lucide-react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/strategy', label: 'Strategy' },
  { href: '/capture', label: 'Capture' },
  { href: '/insights', label: 'Insights' },
  { href: '/tools', label: 'Tools' },
];

export default function Navigation() {
  const pathname = usePathname();

  if (pathname === '/splash') return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1117]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/splash" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="Meridian" className="w-8 h-8 object-contain" />
          <span className="font-semibold text-white tracking-tight">Meridian</span>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === '/tools' && pathname.startsWith('/tools'));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-500/15 text-blue-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Org Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5">
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs text-white/70 font-medium">Apex Advisory Group</span>
        </div>
      </div>
    </nav>
  );
}
