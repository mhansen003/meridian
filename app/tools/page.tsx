'use client';

import Link from 'next/link';
import {
  MessageSquare, TrendingUp, Map, Dna,
  FlaskConical, LayoutList, Clock, BookOpen,
  Newspaper, BarChart2, Shield, DoorOpen,
  Plug, FileText, Lock,
} from 'lucide-react';

const toolGroups = [
  {
    section: 'Intelligence',
    color: 'blue',
    accent: 'bg-blue-500/15 text-blue-400 group-hover:bg-blue-500/25',
    ring: 'ring-blue-500/20',
    tools: [
      {
        href: '/ask',
        icon: MessageSquare,
        label: 'Ask the Organization',
        description: 'Query your entire signal corpus in natural language. Get synthesized answers with citations.',
      },
      {
        href: '/trends',
        icon: TrendingUp,
        label: 'Observation Trends',
        description: 'Time-series view of observation categories. Spot emerging patterns before they become problems.',
      },
      {
        href: '/map',
        icon: Map,
        label: 'Intelligence Map',
        description: 'Org chart overlaid with observation heat. See which roles are generating signal — and which are silent.',
      },
      {
        href: '/dna',
        icon: Dna,
        label: 'DNA Profile',
        description: 'AI-generated portrait of how your organization actually works, based on accumulated observations.',
      },
    ],
  },
  {
    section: 'Strategy',
    color: 'violet',
    accent: 'bg-violet-500/15 text-violet-400 group-hover:bg-violet-500/25',
    ring: 'ring-violet-500/20',
    tools: [
      {
        href: '/simulate',
        icon: FlaskConical,
        label: 'Strategy Simulation',
        description: 'Test a strategy against your signal corpus before publishing. Predict org reaction and alignment score.',
      },
      {
        href: '/okr',
        icon: LayoutList,
        label: 'OKR Synthesis',
        description: 'Paste your OKRs and get a signal taxonomy aligned to each key result with employee prompt suggestions.',
      },
      {
        href: '/decisions',
        icon: Clock,
        label: 'Decision Memory',
        description: 'Record decisions with signal context. Get resurface alerts at 90 days to check what changed.',
      },
      {
        href: '/playbooks',
        icon: BookOpen,
        label: 'Playbooks',
        description: 'AI-generated executable playbooks from recurring patterns. Turn institutional knowledge into repeatable process.',
      },
    ],
  },
  {
    section: 'Organization',
    color: 'cyan',
    accent: 'bg-cyan-500/15 text-cyan-400 group-hover:bg-cyan-500/25',
    ring: 'ring-cyan-500/20',
    tools: [
      {
        href: '/brief',
        icon: Newspaper,
        label: 'Daily Brief',
        description: 'Personalized 3-bullet intelligence digest by role. What matters most to your people today.',
      },
      {
        href: '/benchmarks',
        icon: BarChart2,
        label: 'Benchmarks',
        description: 'Compare your intelligence metrics against professional services industry medians.',
      },
      {
        href: '/competitors',
        icon: Shield,
        label: 'Competitor Intel',
        description: 'Aggregate frontline competitive observations into AI-synthesized dossiers per competitor.',
      },
      {
        href: '/exit',
        icon: DoorOpen,
        label: 'Exit Intelligence',
        description: 'Structured exit captures that preserve institutional knowledge before it walks out the door.',
      },
    ],
  },
  {
    section: 'Platform',
    color: 'emerald',
    accent: 'bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/25',
    ring: 'ring-emerald-500/20',
    tools: [
      {
        href: '/integrations',
        icon: Plug,
        label: 'Integrations',
        description: 'Connect Slack, Microsoft Teams, and CRM tools to capture observations without behavior change.',
      },
      {
        href: '/board',
        icon: FileText,
        label: 'Board Package',
        description: 'One-click board-ready intelligence summary. Strategies, patterns, risks, and opportunities in one doc.',
      },
      {
        href: '/admin',
        icon: Lock,
        label: 'Design Partner Admin',
        description: 'Anonymized cross-org pattern data for design partners. Export and compare intelligence profiles.',
      },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Intelligence Tools</h1>
        <p className="text-white/40 text-sm max-w-xl">
          The full Meridian surface — every tool for capturing, translating, and acting on organizational intelligence.
        </p>
      </div>

      {/* Tool groups */}
      <div className="space-y-12">
        {toolGroups.map((group) => (
          <div key={group.section}>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-4">
              {group.section}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {group.tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`group p-5 rounded-2xl bg-[#13161f] hover:bg-[#161a24] transition-all ring-1 ${group.ring} hover:ring-2`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${group.accent} flex items-center justify-center mb-4 transition-colors`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1.5">{tool.label}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{tool.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
