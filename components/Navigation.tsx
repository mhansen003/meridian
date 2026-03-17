'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Building2, ChevronDown } from 'lucide-react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/strategy', label: 'Strategy' },
  { href: '/capture', label: 'Capture' },
  { href: '/insights', label: 'Insights' },
];

const toolsMenu = [
  {
    section: 'Intelligence',
    items: [
      { href: '/ask', label: 'Ask the Organization' },
      { href: '/trends', label: 'Observation Trends' },
      { href: '/map', label: 'Intelligence Map' },
      { href: '/dna', label: 'DNA Profile' },
    ],
  },
  {
    section: 'Strategy',
    items: [
      { href: '/simulate', label: 'Simulate' },
      { href: '/okr', label: 'OKR Synthesis' },
      { href: '/decisions', label: 'Decisions' },
      { href: '/playbooks', label: 'Playbooks' },
    ],
  },
  {
    section: 'Organization',
    items: [
      { href: '/brief', label: 'Daily Brief' },
      { href: '/benchmarks', label: 'Benchmarks' },
      { href: '/competitors', label: 'Competitor Intel' },
      { href: '/exit', label: 'Exit Intelligence' },
    ],
  },
  {
    section: 'Platform',
    items: [
      { href: '/integrations', label: 'Integrations' },
      { href: '/board', label: 'Board Package' },
      { href: '/admin', label: 'Admin' },
    ],
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname === '/splash') return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1117]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/25">
            M
          </div>
          <span className="font-semibold text-white tracking-tight">Meridian</span>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
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

          {/* Tools dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                open ? 'bg-blue-500/15 text-blue-400' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Tools
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute top-full right-0 mt-2 w-[640px] rounded-2xl border border-white/10 bg-[#13161f] shadow-2xl shadow-black/50 p-5 z-50">
                <div className="grid grid-cols-4 gap-6">
                  {toolsMenu.map((group) => (
                    <div key={group.section}>
                      <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">
                        {group.section}
                      </p>
                      <div className="space-y-0.5">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-2.5 py-1.5 rounded-lg text-sm transition-all ${
                              pathname === item.href
                                ? 'bg-blue-500/15 text-blue-400'
                                : 'text-white/60 hover:text-white hover:bg-white/8'
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
