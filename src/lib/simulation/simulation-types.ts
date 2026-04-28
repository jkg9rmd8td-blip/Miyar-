export type SimulationType = 'time_pressure' | 'information_density' | 'task_switching' | 'job_specific';

export type SimulationStage = 'intro' | 'scenario' | 'result';

export interface SimulationOption {
  id: string;
  text: string;
  metadata: {
    responseQuality: number; // 0-100
    pressureHandling: number; // 0-100
    prioritization: number; // 0-100
    supportNeed: number; // 0-100 (lower is better usually, or higher means they asked for help)
  };
}

export interface SimulationStep {
  id: string;
  context: string;
  situation: string;
  prompt: string;
  options: SimulationOption[];
}

export interface SimulationDefinition {
  id: SimulationType;
  title: string;
  description: string;
  steps: SimulationStep[];
}

export interface SimulationResult {
  simulationType: SimulationType;
  performanceStability: number;
  executionAccuracy: number;
  stressSensitivity: number;
  supportDependency: number;
  narrative: string;
  impactFlags: string[];
  completedAt: string;
}

export interface ObservedSignals {
  responseTime: 'fast' | 'normal' | 'slow';
  decisionAccuracy: number;
  prioritization: number;
  supportNeed: number;
}

export interface SimulationEvidenceState {
  isCompleted: boolean;
  result?: SimulationResult;
  recommended: boolean;
  recommendationReason?: string;
}
