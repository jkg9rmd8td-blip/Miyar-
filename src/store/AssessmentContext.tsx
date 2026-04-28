import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { computeDecision } from '../lib/scoring/scoring-engine';
import { DecisionResult, ScoringInputs } from '../lib/scoring/scoring-types';

import { SimulationResult, SimulationEvidenceState } from '../lib/simulation/simulation-types';

export type AssessmentStep = 'capabilities' | 'environment' | 'evidence' | 'summary' | 'description' | 'tasks' | 'risks';

interface EmployerData {
  roleTitle: string;
  executionContext: string;
  workflowType: string;
  outputExpectations: string;
  description: string;
  criticalTasks: { id: string; label: string; sensitivity: string; timePressure: string; complexity: number }[];
  adaptableTasks: { id: string; label: string; flexibility: string; modifications: string }[];
  risks: { id: string; type: string; label: string; description: string; severity: 'low' | 'medium' | 'high' }[];
}

interface CandidateData {
  fullName: string;
  capabilities: string[];
  workMode: string;
  environmentPrefs: Record<string, string>;
  supportNeeds: string[];
  evidence: { id: string; type: string; recency: string; strength: number; credibility: number }[];
}

interface AssessmentContextType {
  candidateData: CandidateData;
  employerData: EmployerData;
  simulationEvidence: SimulationEvidenceState;
  currentStep: number;
  decisionResult: DecisionResult;
  setCandidateData: React.Dispatch<React.SetStateAction<CandidateData>>;
  setEmployerData: React.Dispatch<React.SetStateAction<EmployerData>>;
  setSimulationResult: (result: SimulationResult) => void;
  clearSimulationResult: () => void;
  recommendSimulation: (recommended: boolean, reason?: string) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  nextStep: () => void;
  prevStep: () => void;
  updateCandidateField: (field: keyof CandidateData, value: any) => void;
  updateEmployerField: (field: keyof EmployerData, value: any) => void;
  resetCandidateData: () => void;
  resetEmployerData: () => void;
  applyGeneratedCandidate: (data: any) => void;
  applyGeneratedEmployer: (data: any) => void;
  generateDemoCase: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [candidateData, setCandidateData] = useState<CandidateData>({
    fullName: 'أحمد محمد',
    capabilities: ['إدخال بيانات', 'معالجة نصوص', 'تواصل كتابي'],
    workMode: 'Hybrid',
    environmentPrefs: { 'lighting': 'خافتة', 'noise': 'هادئة' },
    supportNeeds: ['قارئ شاشة'],
    evidence: [
      { id: '1', type: 'شهادة عمل', recency: '3', strength: 80, credibility: 90 }
    ],
  });

  const [employerData, setEmployerData] = useState<EmployerData>({
    roleTitle: 'مدخل بيانات متقدم',
    executionContext: 'بيئة مكتبية هادئة',
    workflowType: 'رقمي بالكامل',
    outputExpectations: 'دقة عالية في إدخال البيانات المالية',
    description: 'تتطلب الوظيفة التعامل مع كميات كبيرة من البيانات المالية بدقة وسرعة عالية في بيئة عمل منظمة.',
    criticalTasks: [
      { id: '1', label: 'إدخال البيانات المالية', sensitivity: 'High', timePressure: 'Medium', complexity: 70 },
      { id: '2', label: 'تدقيق التقارير الشهرية', sensitivity: 'Medium', timePressure: 'High', complexity: 60 }
    ],
    adaptableTasks: [
      { id: '1', label: 'تنسيق الملفات', flexibility: 'High', modifications: 'تلقائي' }
    ],
    risks: [
      { id: '1', type: 'Operational', label: 'إجهاد بصري', description: 'العمل المستمر على الشاشات', severity: 'medium' }
    ],
  });

  const [simulationEvidence, setSimulationEvidence] = useState<SimulationEvidenceState>({
    isCompleted: false,
    recommended: false
  });
  const [currentStep, setCurrentStep] = useState(0);

  const updateCandidateField = (field: keyof CandidateData, value: any) => {
    setCandidateData(prev => ({ ...prev, [field]: value }));
  };

  const updateEmployerField = (field: keyof EmployerData, value: any) => {
    setEmployerData(prev => ({ ...prev, [field]: value }));
  };

  const resetCandidateData = () => {
    setCandidateData({
      fullName: '',
      capabilities: [],
      workMode: '',
      environmentPrefs: {},
      supportNeeds: [],
      evidence: [],
    });
  };

  const resetEmployerData = () => {
    setEmployerData({
      roleTitle: '',
      executionContext: '',
      workflowType: '',
      outputExpectations: '',
      description: '',
      criticalTasks: [],
      adaptableTasks: [],
      risks: [],
    });
  };

  const applyGeneratedCandidate = (data: any) => {
    setCandidateData(prev => ({
      ...prev,
      fullName: data.fullName,
      capabilities: data.capabilities,
      workMode: data.workMode,
      environmentPrefs: data.environmentPrefs,
      supportNeeds: data.supportNeeds,
      evidence: []
    }));
  };

  const applyGeneratedEmployer = (data: any) => {
    setEmployerData(prev => ({
      ...prev,
      roleTitle: data.roleTitle,
      executionContext: data.executionContext,
      workflowType: data.workflowType,
      outputExpectations: data.outputExpectations,
      criticalTasks: data.criticalTasks,
      adaptableTasks: data.adaptableTasks,
      risks: data.risks
    }));
  };

  const generateDemoCase = () => {
    setCandidateData({
      fullName: 'سارة خالد',
      capabilities: ['تحليل البيانات', 'إدارة المشاريع', 'التواصل الفعال'],
      workMode: 'عمل جماعي',
      environmentPrefs: { 'noise': 'منخفض', 'pace': 'متغيرة', 'density': 'مكتب خاص', 'structure': 'منظم جداً' },
      supportNeeds: ['بيئة هادئة'],
      evidence: [
        { id: '1', type: 'شهادة إنجاز', recency: '2', strength: 90, credibility: 95 }
      ],
    });

    setEmployerData({
      roleTitle: 'محلل أعمال أول',
      executionContext: 'مكتبي',
      workflowType: 'رقمي',
      outputExpectations: 'تحويل المتطلبات التشغيلية إلى حلول تقنية دقيقة.',
      description: 'يتطلب الدور قدرة عالية على التحليل والتواصل مع الفرق المختلفة.',
      criticalTasks: [
        { id: '1', label: 'تحليل المتطلبات', sensitivity: 'عالية', timePressure: 'متوسطة', complexity: 85 },
        { id: '2', label: 'إعداد التقارير الفنية', sensitivity: 'متوسطة', timePressure: 'عالية', complexity: 75 }
      ],
      adaptableTasks: [
        { id: '1', label: 'حضور الاجتماعات', flexibility: 'عالية', modifications: 'عن بعد' }
      ],
      risks: [
        { id: '1', type: 'workflow', label: 'ضغط العمل', description: 'مواعيد تسليم ضيقة', severity: 'medium' }
      ],
    });

    setSimulationEvidence({
      isCompleted: true,
      recommended: true,
      result: {
        simulationType: 'time_pressure',
        completedAt: new Date().toISOString(),
        performanceStability: 92,
        executionAccuracy: 95,
        stressSensitivity: 10,
        supportDependency: 5,
        narrative: 'أظهر المرشح قدرة استثنائية على الحفاظ على دقة العمل تحت ضغط الوقت المرتفع، مع اتخاذ قرارات سريعة وصحيحة في المواقف الحرجة.',
        impactFlags: ['دقة عالية جداً', 'استقرار انفعالي متميز', 'تركيز تشغيلي مستمر']
      }
    });
  };

  const setSimulationResult = (result: SimulationResult) => {
    setSimulationEvidence(prev => ({
      ...prev,
      isCompleted: true,
      result
    }));
  };

  const clearSimulationResult = () => {
    setSimulationEvidence(prev => ({
      ...prev,
      isCompleted: false,
      result: undefined
    }));
  };

  const recommendSimulation = (recommended: boolean, reason?: string) => {
    setSimulationEvidence(prev => ({
      ...prev,
      recommended,
      recommendationReason: reason
    }));
  };

  // Compute Decision Result using the new engine
  const decisionResult = useMemo(() => {
    const inputs: ScoringInputs = {
      candidate: {
        capabilities: candidateData.capabilities,
        environmentPrefs: candidateData.environmentPrefs,
        supportNeeds: candidateData.supportNeeds,
        evidenceCount: candidateData.evidence.length,
        evidenceRecency: parseInt(candidateData.evidence[0]?.recency || '0'),
        evidenceCredibility: candidateData.evidence[0]?.credibility || 50
      },
      employer: {
        roleTitle: employerData.roleTitle,
        description: employerData.description,
        executionContext: employerData.executionContext,
        criticalTasks: employerData.criticalTasks.map(t => ({ id: t.id, label: t.label, complexity: t.complexity })),
        adaptableTasks: employerData.adaptableTasks.map(t => ({ id: t.id, label: t.label })),
        risks: employerData.risks.map(r => ({ id: r.id, label: r.label, severity: r.severity }))
      },
      simulationEvidence
    };

    return computeDecision(inputs);
  }, [candidateData, employerData, simulationEvidence]);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  return (
    <AssessmentContext.Provider
      value={{
        candidateData,
        employerData,
        simulationEvidence,
        currentStep,
        decisionResult,
        setCandidateData,
        setEmployerData,
        setSimulationResult,
        clearSimulationResult,
        recommendSimulation,
        setCurrentStep,
        nextStep,
        prevStep,
        updateCandidateField,
        updateEmployerField,
        resetCandidateData,
        resetEmployerData,
        applyGeneratedCandidate,
        applyGeneratedEmployer,
        generateDemoCase
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
