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

export interface Signal {
  id: string;
  role: Role;
  text: string;
  category: SignalCategory;
  summary: string;
  relatedStrategy: string | null;
  timestamp: string;
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
  signalCount: number;
  executiveAction: string;
  relatedStrategy: string;
  category: SignalCategory;
}

export interface StrategyHealth {
  strategyId: string;
  objective: string;
  signalAlignment: number;
  supportingSignals: number;
  status: 'On Track' | 'At Risk' | 'Needs Attention';
}
