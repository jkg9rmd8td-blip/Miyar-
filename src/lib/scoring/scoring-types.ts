import { SimulationResult, SimulationEvidenceState } from '../simulation/simulation-types';

export type ScoreLabel = 'low' | 'medium' | 'high';

export interface ScoreResult {
  value: number;
  label: ScoreLabel;
  explanation: string;
  drivers: string[];
}

export interface AdaptationCostItem {
  item: string;
  cost: number;
  reason: string;
  linkedTaskOrGap: string;
}

export interface AdaptationCost {
  totalCost: number | null;
  items: AdaptationCostItem[];
  operationalImpact: string;
  riskLevel: 'low' | 'medium' | 'high';
  caseUnderstandingImpact: string;
  isDataSufficient: boolean;
  missingDataPoints?: string[];
}

export interface DecisionResult {
  decision: 'Approved' | 'Conditional' | 'Blocked';
  confidence: number;
  topBlocker: string;
  narrative: string;
  nextActions: string[];
  adaptationCost: AdaptationCost;
  scores: {
    roleClarity: ScoreResult;
    taskFit: ScoreResult;
    environmentFit: ScoreResult;
    accommodationFeasibility: ScoreResult;
    evidenceStrength: ScoreResult;
    blockerSeverity: ScoreResult;
    decisionDefensibility: ScoreResult;
    financialImpact: ScoreResult;
  };
}

export interface ScoringInputs {
  candidate: {
    capabilities: string[];
    environmentPrefs: Record<string, string>;
    supportNeeds: string[];
    evidenceCount: number;
    evidenceRecency: number; // months
    evidenceCredibility: number; // 0-100
  };
  employer: {
    roleTitle: string;
    description: string;
    executionContext: string;
    criticalTasks: { id: string; label: string; complexity: number }[];
    adaptableTasks: { id: string; label: string }[];
    risks: { id: string; label: string; severity: 'low' | 'medium' | 'high' }[];
  };
  simulationEvidence?: SimulationEvidenceState;
}
