export type SignalCategory = 'Risk' | 'Opportunity' | 'Friction' | 'Market Intel' | 'Culture';

export type Role =
  | 'CEO'
  | 'COO'
  | 'Partner'
  | 'Practice Lead'
  | 'Account Manager'
  | 'Senior Consultant'
  | 'Senior Analyst'
  | 'Operations Manager'
  | 'HR Business Partner';

export interface Observation {
  id: string;
  role: Role;
  text: string;
  category: SignalCategory;
  summary: string;
  relatedStrategy: string | null;
  timestamp: string;
  anonymous?: boolean;
  competitorTag?: string;
  isExitInterview?: boolean;
  theme?: string;
}

export interface Strategy {
  id: string;
  objective: string;
  authorRole: string;
  author: string;
  timestamp: string;
  translations?: RoleTranslation[];
}

export interface RoleTranslation {
  role: Role;
  context: string;
  focus: string[];
  watchFor: string[];
}

export interface Pattern {
  id: string;
  title: string;
  confidence: 'High' | 'Medium' | 'Low';
  observationCount: number;
  executiveAction: string;
  relatedStrategy: string;
  category: SignalCategory;
}

export interface StrategyHealth {
  strategyId: string;
  objective: string;
  observationAlignment: number;
  supportingObservations: number;
  status: 'On Track' | 'At Risk' | 'Needs Attention';
}

export interface VelocityAlert {
  id: string;
  theme: string;
  observationIds: string[];
  detectedAt: string;
  summary: string;
}

export interface DriftScore {
  strategyId: string;
  score: number;
  alignedObservations: number;
  misalignedObservations: number;
  flaggedAt: string;
  reasoning: string;
}

export interface Contradiction {
  id: string;
  observationIdA: string;
  observationIdB: string;
  roleA: string;
  roleB: string;
  summary: string;
  detectedAt: string;
}

export interface OrgQuestion {
  id: string;
  question: string;
  answer: string;
  citations: string[];
  askedAt: string;
  askedBy: string;
}

export interface DecisionMemory {
  id: string;
  title: string;
  rationale: string;
  observationContext: string[];
  strategyId: string | null;
  madeAt: string;
  resurface90: string;
}

export interface Playbook {
  id: string;
  triggeredByPattern: string;
  title: string;
  steps: string[];
  owner: string;
  createdAt: string;
}

export interface CompetitorDossier {
  competitor: string;
  observationIds: string[];
  summary: string;
  lastUpdated: string;
}

export interface StrategySimulation {
  id: string;
  strategyText: string;
  authorRole: string;
  predictedReaction: string;
  alignmentScore: number;
  risks: string[];
  opportunities: string[];
  simulatedAt: string;
}

export interface OrgDNA {
  generatedAt: string;
  profile: string;
  traits: string[];
  observationCount: number;
}

export interface BenchmarkData {
  category: string;
  orgScore: number;
  percentile: number;
  industryMedian: number;
}

export interface ExitInterview {
  id: string;
  role: string;
  department: string;
  tenureYears: number;
  responses: { question: string; answer: string }[];
  knowledgeExtract: string;
  submittedAt: string;
}

export interface BoardPackage {
  id: string;
  generatedAt: string;
  period: string;
  executiveSummary: string;
  topPatterns: string[];
  strategyHealth: string;
  keyRisks: string[];
  keyOpportunities: string[];
  rawMarkdown: string;
}
