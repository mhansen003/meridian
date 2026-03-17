import type { Signal, Strategy, Pattern, StrategyHealth, Role, SignalCategory } from './types';

export const ROLES: Role[] = [
  'CEO',
  'COO',
  'Partner',
  'Practice Lead',
  'Account Manager',
  'Senior Consultant',
  'Senior Analyst',
  'Operations Manager',
];

// ─── Seed Strategies ──────────────────────────────────────────────────────────
export const strategies: Strategy[] = [
  {
    id: 'strat-001',
    objective: 'Accelerate mid-market client acquisition — target 40 new logos in H1 2026',
    authorRole: 'CEO',
    author: 'Sarah Chen',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'strat-002',
    objective: 'Reduce project delivery cycle time by 20% through standardized delivery frameworks',
    authorRole: 'COO',
    author: 'David Park',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'strat-003',
    objective: 'Build AI-native service offerings to defend margin against commoditization',
    authorRole: 'CEO',
    author: 'Sarah Chen',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

// ─── Seed Signals ─────────────────────────────────────────────────────────────
export const signals: Signal[] = [
  {
    id: 'sig-001',
    role: 'Account Manager',
    text: "Prospects keep asking about our AI capabilities before we even get to the demo. This is coming up in 4 out of 5 conversations now.",
    category: 'Market Intel',
    summary: 'AI capability inquiries dominating prospect conversations at 80% rate.',
    relatedStrategy: 'strat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'sig-002',
    role: 'Practice Lead',
    text: "The new delivery framework templates are saving us 2-3 days per project kickoff. Team adoption is faster than expected.",
    category: 'Opportunity',
    summary: 'Framework templates generating 2-3 day savings per kickoff with strong adoption.',
    relatedStrategy: 'strat-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'sig-003',
    role: 'Senior Consultant',
    text: "Three clients this quarter mentioned they're evaluating Accenture specifically because of their AI practice. We need a credible story.",
    category: 'Risk',
    summary: 'Accenture AI practice driving client evaluation decisions — competitive threat escalating.',
    relatedStrategy: 'strat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'sig-004',
    role: 'Operations Manager',
    text: "We're losing 6-8 hours per project to contract redlines on standard engagements. Legal review is the biggest cycle time killer.",
    category: 'Friction',
    summary: 'Legal contract redlines consuming 6-8 hours per project — primary cycle time bottleneck.',
    relatedStrategy: 'strat-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
  {
    id: 'sig-005',
    role: 'Partner',
    text: "Mid-market CFOs are under pressure to show AI ROI to their boards. They're ready to buy — they just need help knowing where to start.",
    category: 'Opportunity',
    summary: 'Mid-market CFOs have AI budget authority and purchase intent — need guidance on starting point.',
    relatedStrategy: 'strat-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    id: 'sig-006',
    role: 'Senior Analyst',
    text: "The standardized framework actually increases initial scoping time because clients expect customization. May need a lite version for smaller deals.",
    category: 'Friction',
    summary: 'Client customization expectations offsetting framework efficiency gains in scoping phase.',
    relatedStrategy: 'strat-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'sig-007',
    role: 'Account Manager',
    text: "Just lost a deal to a boutique that positioned as 'AI-first.' They had half our credentials but a better narrative.",
    category: 'Risk',
    summary: 'Lost deal to AI-first boutique on narrative — credentialing advantage insufficient against positioning.',
    relatedStrategy: 'strat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    id: 'sig-008',
    role: 'HR Business Partner',
    text: "Consultants are anxious about AI replacing their roles. Morale impact is showing up in our monthly pulse scores.",
    category: 'Culture',
    summary: 'AI role anxiety driving morale decline — emerging retention and engagement risk.',
    relatedStrategy: 'strat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
];

// ─── Seed Patterns ────────────────────────────────────────────────────────────
export const patterns: Pattern[] = [
  {
    id: 'pat-001',
    title: 'AI Capability Gap Threatening Pipeline',
    confidence: 'High',
    signalCount: 3,
    executiveAction: 'Prioritize AI narrative development and credential building before next sales cycle. Assign a Partner to own the AI positioning story.',
    relatedStrategy: 'Build AI-native service offerings',
    category: 'Risk',
  },
  {
    id: 'pat-002',
    title: 'Mid-Market CFO Buying Window Is Open',
    confidence: 'High',
    signalCount: 2,
    executiveAction: 'Develop a CFO-specific AI ROI framework and fast-track it to Account Managers. This is a short window.',
    relatedStrategy: 'Accelerate mid-market client acquisition',
    category: 'Opportunity',
  },
  {
    id: 'pat-003',
    title: 'Framework Efficiency Gains Partially Offset by Customization Friction',
    confidence: 'Medium',
    signalCount: 3,
    executiveAction: 'Commission a lite framework variant for sub-$100K engagements. Review scoping process with Practice Leads.',
    relatedStrategy: 'Reduce project delivery cycle time',
    category: 'Friction',
  },
  {
    id: 'pat-004',
    title: 'Internal AI Anxiety Risk to Retention',
    confidence: 'Medium',
    signalCount: 1,
    executiveAction: 'Address AI transformation narrative internally before it compounds. Consultants need to be positioned as AI-enabled, not replaced.',
    relatedStrategy: 'Build AI-native service offerings',
    category: 'Culture',
  },
];

// ─── Strategy Health ───────────────────────────────────────────────────────────
export const strategyHealth: StrategyHealth[] = [
  {
    strategyId: 'strat-001',
    objective: 'Accelerate mid-market client acquisition',
    signalAlignment: 72,
    supportingSignals: 2,
    status: 'On Track',
  },
  {
    strategyId: 'strat-002',
    objective: 'Reduce delivery cycle time by 20%',
    signalAlignment: 58,
    supportingSignals: 3,
    status: 'Needs Attention',
  },
  {
    strategyId: 'strat-003',
    objective: 'Build AI-native service offerings',
    signalAlignment: 45,
    supportingSignals: 4,
    status: 'At Risk',
  },
];

// ─── Category Colors ───────────────────────────────────────────────────────────
export const CATEGORY_COLORS: Record<SignalCategory, string> = {
  Risk: 'bg-red-500/20 text-red-400 border border-red-500/30',
  Opportunity: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  Friction: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  'Market Intel': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  Culture: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
};

export const ROLE_COLORS: Record<string, string> = {
  CEO: 'bg-violet-500/20 text-violet-300',
  COO: 'bg-indigo-500/20 text-indigo-300',
  Partner: 'bg-blue-500/20 text-blue-300',
  'Practice Lead': 'bg-cyan-500/20 text-cyan-300',
  'Account Manager': 'bg-teal-500/20 text-teal-300',
  'Senior Consultant': 'bg-green-500/20 text-green-300',
  'Senior Analyst': 'bg-yellow-500/20 text-yellow-300',
  'Operations Manager': 'bg-orange-500/20 text-orange-300',
  'HR Business Partner': 'bg-pink-500/20 text-pink-300',
};
