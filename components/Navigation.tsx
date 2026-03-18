'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/strategy', label: 'Strategy' },
  { href: '/capture', label: 'Capture' },
  { href: '/insights', label: 'Insights' },
  { href: '/tools', label: 'Tools' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1117]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/splash" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="Meridian" className="w-8 h-8 object-contain" />
          <span className="font-semibold text-white tracking-tight">Meridian</span>
        </Link>

        {/* Center Nav — desktop only */}
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Org Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-white/70 font-medium">Apex Advisory Group</span>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/5 transition-all text-white/70 hover:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/8 bg-[#0f1117]/98">
          <div className="px-4 py-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/tools' && pathname.startsWith('/tools'));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center w-full py-4 px-3 rounded-lg text-base font-medium transition-all ${
                    isActive
                      ? 'text-blue-400 bg-blue-500/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {/* Org pill inside mobile menu */}
            <div className="flex items-center gap-2 px-3 py-3 mt-1 border-t border-white/8">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs text-white/50 font-medium">Apex Advisory Group</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
