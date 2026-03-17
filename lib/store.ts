import type { Observation, Strategy, Pattern, StrategyHealth, Role, SignalCategory, VelocityAlert, DriftScore, Contradiction, OrgQuestion, DecisionMemory, Playbook, CompetitorDossier, StrategySimulation, OrgDNA, BenchmarkData, ExitInterview, BoardPackage } from './types';

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

// ─── Seed Observations ────────────────────────────────────────────────────────
export const observations: Observation[] = [
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
    text: "Consultants are anxious about AI replacing their roles. Morale impact is showing up in our monthly capture scores.",
    category: 'Culture',
    summary: 'AI role anxiety driving morale decline — emerging retention and engagement risk.',
    relatedStrategy: 'strat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: 'sig-009',
    role: 'Senior Analyst',
    text: "I attended a McKinsey briefing last week. Their AI toolkit pricing has dropped 30% — they're trying to undercut us on cost.",
    category: 'Market Intel',
    summary: 'McKinsey cutting AI toolkit pricing 30% to compete on cost.',
    relatedStrategy: 'strat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    competitorTag: 'McKinsey',
    anonymous: true,
  },
  {
    id: 'sig-010',
    role: 'Account Manager',
    text: "Three prospects this month mentioned they already have McKinsey on retainer for AI strategy. We're losing the advisory slot before we even pitch.",
    category: 'Risk',
    summary: 'McKinsey occupying AI advisory retainer position, blocking Apex entry.',
    relatedStrategy: 'strat-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    competitorTag: 'McKinsey',
  },
  {
    id: 'sig-011',
    role: 'Partner',
    text: "Accenture just launched an AI center of excellence in Chicago. Two of our key clients got invitations to a free pilot program.",
    category: 'Risk',
    summary: 'Accenture Chicago AI CoE launching free pilots threatening key client relationships.',
    relatedStrategy: 'strat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    competitorTag: 'Accenture',
    anonymous: true,
  },
  {
    id: 'sig-012',
    role: 'COO',
    text: "Our utilization rate dropped to 71% in February — lowest since Q3 2024. Project delays on the healthcare vertical are the main driver.",
    category: 'Friction',
    summary: 'Utilization at 71%, below target — healthcare vertical delays primary cause.',
    relatedStrategy: 'strat-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'sig-013',
    role: 'Practice Lead',
    text: "Our new junior consultants are struggling with the delivery framework. They need 2 extra weeks of onboarding compared to last year's cohort.",
    category: 'Friction',
    summary: 'Junior consultant framework onboarding taking 2 extra weeks versus prior cohorts.',
    relatedStrategy: 'strat-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: 'sig-014',
    role: 'CEO',
    text: "Board is asking about our AI revenue attribution. We don't have a clean way to show which revenue is driven by AI-enabled delivery.",
    category: 'Risk',
    summary: 'Board requiring AI revenue attribution — no current measurement framework exists.',
    relatedStrategy: 'strat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 'sig-015',
    role: 'Senior Consultant',
    text: "I'm hearing from clients that they want advisory, not just delivery. Our competitors are pitching boardroom access — we should be too.",
    category: 'Opportunity',
    summary: 'Client demand shifting to advisory access and boardroom engagement.',
    relatedStrategy: 'strat-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: 'sig-016',
    role: 'Operations Manager',
    text: "We onboarded two new sub-contractors last quarter but our vendor management process added 3 weeks of delay to their first billable week.",
    category: 'Friction',
    summary: 'Vendor onboarding process adding 3-week delay to first billable engagement.',
    relatedStrategy: 'strat-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: 'sig-017',
    role: 'HR Business Partner',
    text: "Three high-performers mentioned in 1:1s that they've been approached by Google for internal AI strategy roles. Pay gap is real.",
    category: 'Culture',
    summary: 'Google AI role recruiting pulling high-performers — compensation gap emerging.',
    relatedStrategy: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
  },
  {
    id: 'sig-018',
    role: 'Account Manager',
    text: "Won a $400K engagement with a CFO who said our proposal was the only one that tied AI ROI back to board-level KPIs. This positioning is working.",
    category: 'Opportunity',
    summary: 'Board-level AI ROI framing winning $400K engagements versus competitors.',
    relatedStrategy: 'strat-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    id: 'sig-019',
    role: 'Senior Analyst',
    text: "Data quality issues in the client's source systems are delaying two projects. We need a pre-engagement data readiness assessment tool.",
    category: 'Friction',
    summary: 'Client data quality issues delaying projects — pre-engagement assessment needed.',
    relatedStrategy: 'strat-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
  },
  {
    id: 'sig-020',
    role: 'Partner',
    text: "Just had a very frank conversation with a client CHRO. They're not buying AI tools — they're buying AI change management. We're not positioned for that.",
    category: 'Opportunity',
    summary: 'CHROs buying AI change management, not tools — Apex lacks this positioning.',
    relatedStrategy: 'strat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: 'sig-021',
    role: 'Practice Lead',
    text: "Client satisfaction scores on our AI projects are 8.2 vs 7.4 on traditional projects. The work speaks for itself when we actually deliver AI.",
    category: 'Opportunity',
    summary: 'AI project CSAT 8.2 vs 7.4 traditional — quality advantage evident.',
    relatedStrategy: 'strat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
  },
  {
    id: 'sig-022',
    role: 'COO',
    text: "Reviewed our bench utilization — we have 3 senior consultants and 2 analysts unassigned for Q2. Pipeline needs to close faster.",
    category: 'Risk',
    summary: 'Q2 bench has 5 unassigned senior staff — pipeline velocity insufficient.',
    relatedStrategy: 'strat-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17).toISOString(),
  },
  {
    id: 'sig-023',
    role: 'Senior Consultant',
    text: "I'm noticing our clients ask us about Accenture's approach before any other competitor. Their brand pull is stronger than I expected in this segment.",
    category: 'Market Intel',
    summary: 'Accenture brand dominates client competitive comparisons in mid-market segment.',
    relatedStrategy: 'strat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 19).toISOString(),
    competitorTag: 'Accenture',
  },
  {
    id: 'sig-024',
    role: 'HR Business Partner',
    text: "New hybrid work policy feedback is mixed. Older tenured staff want more in-office time; junior staff overwhelmingly prefer remote. Cultural tension building.",
    category: 'Culture',
    summary: 'Hybrid policy creating generational culture divide — tension increasing.',
    relatedStrategy: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
  },
  {
    id: 'sig-025',
    role: 'Account Manager',
    text: "Our proposal win rate on deals over $500K is 38%. Under $500K it's 61%. We're overpriced or under-differentiated at the top end.",
    category: 'Risk',
    summary: 'Win rate at $500K+ drops to 38% vs 61% below — pricing or differentiation gap.',
    relatedStrategy: 'strat-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 23).toISOString(),
  },
  {
    id: 'sig-026',
    role: 'Senior Analyst',
    text: "I've automated 6 hours of weekly reporting using an internal GPT-4o script. No one asked me to — I just did it. We could scale this across the team.",
    category: 'Opportunity',
    summary: 'Analyst self-built AI automation saving 6 hrs/week — scalable across team.',
    relatedStrategy: 'strat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
  {
    id: 'sig-027',
    role: 'CEO',
    text: "I got a call from a PE firm asking if we'd consider a strategic acqui-hire for our AI talent. That's both a compliment and a warning observation.",
    category: 'Risk',
    summary: 'PE acqui-hire inquiry captures both AI talent valuation and retention risk.',
    relatedStrategy: 'strat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 27).toISOString(),
  },
  {
    id: 'sig-028',
    role: 'Operations Manager',
    text: "We're getting better at project kick-offs but project close-outs are broken. Lessons learned sessions aren't happening. Knowledge is walking out the door.",
    category: 'Friction',
    summary: 'Project close-out failure — lessons learned not captured, knowledge leaking.',
    relatedStrategy: 'strat-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
  },
  {
    id: 'sig-029',
    role: 'Partner',
    text: "McKinsey is bundling free AI diagnostic assessments with their existing client retainers. This is a land-and-expand tactic targeting our install base.",
    category: 'Market Intel',
    summary: 'McKinsey bundling free AI diagnostics into retainers to expand into Apex client base.',
    relatedStrategy: 'strat-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 29).toISOString(),
    competitorTag: 'McKinsey',
    anonymous: true,
  },
];

// ─── Seed Patterns ────────────────────────────────────────────────────────────
export const patterns: Pattern[] = [
  {
    id: 'pat-001',
    title: 'AI Capability Gap Threatening Pipeline',
    confidence: 'High',
    observationCount: 3,
    executiveAction: 'Prioritize AI narrative development and credential building before next sales cycle. Assign a Partner to own the AI positioning story.',
    relatedStrategy: 'Build AI-native service offerings',
    category: 'Risk',
  },
  {
    id: 'pat-002',
    title: 'Mid-Market CFO Buying Window Is Open',
    confidence: 'High',
    observationCount: 2,
    executiveAction: 'Develop a CFO-specific AI ROI framework and fast-track it to Account Managers. This is a short window.',
    relatedStrategy: 'Accelerate mid-market client acquisition',
    category: 'Opportunity',
  },
  {
    id: 'pat-003',
    title: 'Framework Efficiency Gains Partially Offset by Customization Friction',
    confidence: 'Medium',
    observationCount: 3,
    executiveAction: 'Commission a lite framework variant for sub-$100K engagements. Review scoping process with Practice Leads.',
    relatedStrategy: 'Reduce project delivery cycle time',
    category: 'Friction',
  },
  {
    id: 'pat-004',
    title: 'Internal AI Anxiety Risk to Retention',
    confidence: 'Medium',
    observationCount: 1,
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
    observationAlignment: 72,
    supportingObservations: 2,
    status: 'On Track',
  },
  {
    strategyId: 'strat-002',
    objective: 'Reduce delivery cycle time by 20%',
    observationAlignment: 58,
    supportingObservations: 3,
    status: 'Needs Attention',
  },
  {
    strategyId: 'strat-003',
    objective: 'Build AI-native service offerings',
    observationAlignment: 45,
    supportingObservations: 4,
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

// ─── New Feature Stores ────────────────────────────────────────────────────────
export const velocityAlerts: VelocityAlert[] = [];
export const driftScores: DriftScore[] = [];
export const contradictions: Contradiction[] = [];
export const orgQuestions: OrgQuestion[] = [];
export const decisionMemories: DecisionMemory[] = [];
export const playbooks: Playbook[] = [];
export const competitorDossiers: CompetitorDossier[] = [];
export const strategySimulations: StrategySimulation[] = [];
export let orgDNA: OrgDNA | null = null;
export const exitInterviews: ExitInterview[] = [];
export const boardPackages: BoardPackage[] = [];
export const webhookEvents: { id: string; source: string; text: string; receivedAt: string }[] = [];

export const benchmarkData: BenchmarkData[] = [
  { category: 'Observation Capture Rate', orgScore: 43, percentile: 43, industryMedian: 58 },
  { category: 'Strategy Alignment', orgScore: 67, percentile: 61, industryMedian: 55 },
  { category: 'Pattern Detection Velocity', orgScore: 78, percentile: 72, industryMedian: 60 },
  { category: 'Cross-Role Coverage', orgScore: 88, percentile: 81, industryMedian: 70 },
  { category: 'Decision Memory Rate', orgScore: 31, percentile: 28, industryMedian: 45 },
];

export const briefCache: Record<string, { bullets: string[] }> = {};

export function setOrgDNA(dna: OrgDNA) {
  orgDNA = dna;
}
