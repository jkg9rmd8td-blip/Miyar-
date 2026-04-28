import { 
  ScoringInputs, 
  ScoreResult, 
  DecisionResult, 
  ScoreLabel 
} from './scoring-types';
import { 
  mapValueToLabel, 
  mapValueToInvertedLabel, 
  calculateAverage, 
  getArabicLabel 
} from './scoring-utils';
import { AdaptationCost, AdaptationCostItem } from './scoring-types';

// 1. Role Clarity Score
export const calculateRoleClarity = (employer: ScoringInputs['employer']): ScoreResult => {
  const hasTitle = employer.roleTitle.length > 0;
  const hasDescription = employer.description.length > 20;
  const taskCount = employer.criticalTasks.length;
  const adaptableCount = employer.adaptableTasks.length;

  let value = 0;
  if (hasTitle) value += 20;
  if (hasDescription) value += 30;
  value += Math.min(30, taskCount * 10);
  value += Math.min(20, adaptableCount * 5);

  const drivers = [];
  if (hasTitle) drivers.push('مسمى وظيفي محدد');
  if (hasDescription) drivers.push('وصف وظيفي مفصل');
  if (taskCount > 0) drivers.push(`${taskCount} مهام حرجة محددة`);
  if (adaptableCount > 0) drivers.push(`${adaptableCount} مهام قابلة للتكيف`);

  return {
    value,
    label: mapValueToLabel(value),
    explanation: value > 70 
      ? 'الوظيفة معرفة بشكل دقيق وواضح، مما يسهل عملية المطابقة.' 
      : 'هناك حاجة لمزيد من التفاصيل حول المهام والمسؤوليات الوظيفية.',
    drivers
  };
};

// 2. Task Fit Score
export const calculateTaskFit = (candidate: ScoringInputs['candidate'], employer: ScoringInputs['employer']): ScoreResult => {
  if (employer.criticalTasks.length === 0) {
    return { value: 0, label: 'low', explanation: 'لا توجد مهام حرجة محددة للمطابقة.', drivers: [] };
  }

  // Simple match logic: how many critical tasks can the candidate perform based on capabilities
  // In a real app, this would be more complex (e.g. semantic matching)
  // For demo, we'll use a random-ish but deterministic match based on counts
  const matchRatio = Math.min(1, (candidate.capabilities.length * 1.5) / employer.criticalTasks.length);
  const value = Math.round(matchRatio * 100);

  const drivers = [
    `توافق مع ${Math.round(matchRatio * employer.criticalTasks.length)} من أصل ${employer.criticalTasks.length} مهام حرجة`,
    `تنوع القدرات: ${getArabicLabel(mapValueToLabel(candidate.capabilities.length * 20))}`
  ];

  return {
    value,
    label: mapValueToLabel(value),
    explanation: value > 75 
      ? 'قدرات المرشح تتوافق بشكل ممتاز مع المهام الحرجة للوظيفة.' 
      : 'هناك فجوة بين قدرات المرشح الحالية وبعض المهام الجوهرية للوظيفة.',
    drivers
  };
};

// 3. Environment Fit Score
export const calculateEnvironmentFit = (candidate: ScoringInputs['candidate'], employer: ScoringInputs['employer']): ScoreResult => {
  const prefCount = Object.keys(candidate.environmentPrefs).length;
  const value = Math.min(100, prefCount * 25); // Simple demo logic

  const drivers = [
    `تحديد ${prefCount} تفضيلات بيئية`,
    'توافق مع طبيعة بيئة العمل المكتبية'
  ];

  return {
    value,
    label: mapValueToLabel(value),
    explanation: value > 70 
      ? 'بيئة العمل تتناسب بشكل جيد مع تفضيلات واحتياجات المرشح.' 
      : 'قد يحتاج المرشح إلى تعديلات بيئية لضمان الاستقرار التشغيلي.',
    drivers
  };
};

// 4. Accommodation Feasibility Score
export const calculateAccommodationFeasibility = (employer: ScoringInputs['employer']): ScoreResult => {
  const adaptableCount = employer.adaptableTasks.length;
  const value = Math.min(100, adaptableCount * 25);

  const drivers = [
    `${adaptableCount} مهام قابلة للتكيف`,
    'مرونة عالية في إعادة توزيع المهام'
  ];

  return {
    value,
    label: mapValueToLabel(value),
    explanation: value > 60 
      ? 'الوظيفة تظهر مرونة عالية في التكيف مع احتياجات المرشح.' 
      : 'الوظيفة ذات طبيعة صلبة، مما يحد من خيارات التكييف المتاحة.',
    drivers
  };
};

// 5. Evidence Strength Score
export const calculateEvidenceStrength = (candidate: ScoringInputs['candidate'], simulationEvidence?: ScoringInputs['simulationEvidence']): ScoreResult => {
  const { evidenceCount, evidenceRecency, evidenceCredibility } = candidate;
  
  let value = 0;
  value += Math.min(40, evidenceCount * 15);
  value += Math.max(0, 30 - (evidenceRecency * 2));
  value += (evidenceCredibility / 100) * 30;
  
  // Add simulation bonus
  if (simulationEvidence?.isCompleted && simulationEvidence.result) {
    const sim = simulationEvidence.result;
    // Performance stability and execution accuracy contribute to evidence strength
    const simContribution = (sim.performanceStability * 0.1) + (sim.executionAccuracy * 0.1);
    value += simContribution;
  }
  
  value = Math.round(value);

  const drivers = [
    `${evidenceCount} وثائق/أدلة مرفقة`,
    `حداثة الأدلة: ${evidenceRecency < 6 ? 'حديثة جداً' : 'متوسطة'}`,
    `مستوى الموثوقية: ${evidenceCredibility}%`
  ];

  if (simulationEvidence?.isCompleted) {
    drivers.push('تمت إضافة دليل سلوكي من المحاكاة');
  }

  return {
    value,
    label: mapValueToLabel(value),
    explanation: value > 70 
      ? 'الأدلة المقدمة قوية وحديثة، مما يعزز من ثقة القرار.' 
      : 'هناك حاجة لتعزيز الملف بأدلة أكثر حداثة أو موثوقية.',
    drivers
  };
};

// 6. Blocker Severity Score
export const calculateBlockerSeverity = (employer: ScoringInputs['employer'], simulationEvidence?: ScoringInputs['simulationEvidence']): ScoreResult => {
  const highRisks = employer.risks.filter(r => r.severity === 'high').length;
  const mediumRisks = employer.risks.filter(r => r.severity === 'medium').length;
  
  let value = Math.min(100, (highRisks * 40) + (mediumRisks * 15));

  // Adjust based on simulation results
  if (simulationEvidence?.isCompleted && simulationEvidence.result) {
    const sim = simulationEvidence.result;
    
    // If stress sensitivity is high (> 70), increase blocker severity if there are high risks
    if (sim.stressSensitivity > 70 && highRisks > 0) {
      value += 15;
    }
    
    // If support dependency is low (< 30), reduce blocker severity slightly
    if (sim.supportDependency < 30) {
      value -= 10;
    }
  }

  value = Math.min(100, Math.max(0, value));

  const drivers = [
    `${highRisks} مخاطر عالية الخطورة`,
    `${mediumRisks} مخاطر متوسطة الخطورة`
  ];

  if (simulationEvidence?.isCompleted && simulationEvidence.result) {
    if (simulationEvidence.result.stressSensitivity > 70) {
      drivers.push('رصد حساسية عالية للضغط في المحاكاة');
    }
    if (simulationEvidence.result.supportDependency > 70) {
      drivers.push('اعتمادية عالية على الدعم الخارجي');
    }
  }

  return {
    value,
    label: mapValueToLabel(value), // Here high means high risk, which is bad
    explanation: value > 50 
      ? 'توجد موانع جوهرية قد تعيق نجاح التوظيف في هذه المرحلة.' 
      : 'المخاطر التشغيلية المرصودة تقع ضمن النطاق القابل للإدارة.',
    drivers
  };
};

// 7. Decision Defensibility Score
export const calculateDecisionDefensibility = (
  evidence: ScoreResult, 
  clarity: ScoreResult
): ScoreResult => {
  const value = Math.round((evidence.value * 0.6) + (clarity.value * 0.4));

  const drivers = [
    `قوة الدليل: ${getArabicLabel(evidence.label)}`,
    `وضوح الدور: ${getArabicLabel(clarity.label)}`
  ];

  return {
    value,
    label: mapValueToLabel(value),
    explanation: value > 75 
      ? 'القرار مبني على أسس متينة ويمكن الدفاع عنه مؤسسياً.' 
      : 'القرار يفتقر لبعض الركائز الدفاعية، مما قد يعرضه للمساءلة.',
    drivers
  };
};

// 8. Financial Impact Score
export const calculateFinancialImpact = (
  accommodation: ScoreResult, 
  blockers: ScoreResult
): ScoreResult => {
  // High value here means high impact (cost/risk)
  const value = Math.round((blockers.value * 0.7) + (100 - accommodation.value) * 0.3);

  const drivers = [
    `مستوى المخاطر: ${getArabicLabel(blockers.label)}`,
    `تكلفة التكييف المتوقعة: ${accommodation.value > 70 ? 'منخفضة' : 'متوسطة'}`
  ];

  return {
    value,
    label: mapValueToLabel(value),
    explanation: value > 60 
      ? 'هناك أثر مالي محتمل مرتفع بسبب المخاطر أو احتياجات التكييف.' 
      : 'الأثر المالي المتوقع يقع ضمن الحدود الطبيعية للتوظيف.',
    drivers
  };
};

export const getSimulationImpactExplanation = (simulationEvidence?: ScoringInputs['simulationEvidence']): string => {
  if (!simulationEvidence?.isCompleted || !simulationEvidence.result) return '';
  
  const sim = simulationEvidence.result;
  if (sim.performanceStability > 70 && sim.executionAccuracy > 70) {
    return "رفعت المحاكاة قوة الدليل لأنها أضافت سلوكًا ملاحظًا مرتبطًا بالمهمة الحرجة.";
  }
  if (sim.stressSensitivity > 70) {
    return "أظهرت المحاكاة حساسية أعلى للضغط، مما أبقى القرار في الحالة المشروطة.";
  }
  return "أضافت المحاكاة قراءة سلوكية إضافية تدعم ملف القرار.";
};

export const getSimulationEvidenceContribution = (simulationEvidence?: ScoringInputs['simulationEvidence']): string => {
  if (!simulationEvidence?.isCompleted || !simulationEvidence.result) return 'لا يوجد دليل سلوكي إضافي';
  
  const sim = simulationEvidence.result;
  if (sim.supportDependency > 70) {
    return "كشفت المحاكاة عن حاجة أعلى للتكييف البيئي والدعم التشغيلي.";
  }
  return "أكدت المحاكاة القدرة على التنفيذ المستقل للمهام.";
};

// Main Decision Computation
export const computeDecision = (inputs: ScoringInputs): DecisionResult => {
  const roleClarity = calculateRoleClarity(inputs.employer);
  const taskFit = calculateTaskFit(inputs.candidate, inputs.employer);
  const environmentFit = calculateEnvironmentFit(inputs.candidate, inputs.employer);
  const accommodationFeasibility = calculateAccommodationFeasibility(inputs.employer);
  const evidenceStrength = calculateEvidenceStrength(inputs.candidate, inputs.simulationEvidence);
  const blockerSeverity = calculateBlockerSeverity(inputs.employer, inputs.simulationEvidence);
  const decisionDefensibility = calculateDecisionDefensibility(evidenceStrength, roleClarity);
  const financialImpact = calculateFinancialImpact(accommodationFeasibility, blockerSeverity);

  let decision: 'Approved' | 'Conditional' | 'Blocked' = 'Conditional';
  
  if (blockerSeverity.value > 70 || taskFit.value < 40) {
    decision = 'Blocked';
  } else if (taskFit.value > 75 && environmentFit.value > 70 && evidenceStrength.value > 60 && blockerSeverity.value < 30) {
    decision = 'Approved';
  }

  const confidence = calculateAverage([
    evidenceStrength.value,
    roleClarity.value,
    decisionDefensibility.value
  ]);

  const topBlocker = blockerSeverity.value > 0 
    ? inputs.employer.risks[0]?.label || 'نقص في البيانات' 
    : 'لا يوجد';

  const narrative = generateNarrative(decision, taskFit, evidenceStrength, accommodationFeasibility);
  
  const nextActions = generateNextActions(decision, evidenceStrength, roleClarity, blockerSeverity);

  const adaptationCost = calculateAdaptationCost(inputs);

  return {
    decision,
    confidence,
    topBlocker,
    narrative,
    nextActions,
    adaptationCost,
    scores: {
      roleClarity,
      taskFit,
      environmentFit,
      accommodationFeasibility,
      evidenceStrength,
      blockerSeverity,
      decisionDefensibility,
      financialImpact
    }
  };
};

const generateNarrative = (
  decision: string, 
  taskFit: ScoreResult, 
  evidence: ScoreResult, 
  accommodation: ScoreResult
): string => {
  if (decision === 'Approved') {
    return `تشير المعطيات إلى توافق ممتاز بنسبة ${taskFit.value}% في المهام الأساسية، مع وجود أدلة قوية تدعم القرار بشكل دفاعي كامل.`;
  }
  if (decision === 'Blocked') {
    return `تم رصد عوائق جوهرية في التوافق التشغيلي أو مخاطر عالية تمنع المضي في هذا المسار حالياً.`;
  }
  
  let reason = '';
  if (evidence.value < 50) reason = 'بسبب ضعف الأدلة المتاحة';
  else if (accommodation.value < 50) reason = 'بسبب الحاجة لتكييفات جوهرية غير متوفرة حالياً';
  else reason = 'بسبب الحاجة لمزيد من التدقيق في بعض الجوانب البيئية';

  return `تشير المعطيات إلى توافق جيد في المهام الأساسية، إلا أن القرار لا يزال مشروطاً ${reason}.`;
};

const generateNextActions = (
  decision: string, 
  evidence: ScoreResult, 
  clarity: ScoreResult, 
  blockers: ScoreResult
): string[] => {
  const actions = [];
  if (evidence.value < 60) actions.push('إضافة دليل حديث (فيديو أو وثيقة)');
  if (clarity.value < 60) actions.push('توضيح المهام الحرجة للوظيفة بشكل أدق');
  if (blockers.value > 40) actions.push('مراجعة وتقليل المخاطر التشغيلية المرصودة');
  if (decision === 'Conditional') actions.push('اعتماد خطة تكييف بيئي محددة');
  
  if (actions.length === 0) actions.push('اعتماد القرار النهائي والبدء في إجراءات التوظيف');
  
  return actions;
};

// 9. Adaptation Cost Estimation
export const calculateAdaptationCost = (inputs: ScoringInputs): AdaptationCost => {
  const { candidate, employer, simulationEvidence } = inputs;
  const items: AdaptationCostItem[] = [];
  
  const isDataSufficient = employer.criticalTasks.length > 0 && candidate.supportNeeds.length > 0;
  const missingDataPoints = [];
  if (employer.criticalTasks.length === 0) missingDataPoints.push('المهام الأساسية للدور');
  if (candidate.supportNeeds.length === 0) missingDataPoints.push('نقاط الدعم المطلوبة للمرشح');

  if (!isDataSufficient) {
    return {
      totalCost: null,
      items: [],
      operationalImpact: 'لا يمكن تحديد الأثر التشغيلي لعدم اكتمال البيانات الأساسية.',
      riskLevel: 'medium',
      caseUnderstandingImpact: 'البيانات الحالية غير كافية لبناء تقدير مالي دقيق.',
      isDataSufficient: false,
      missingDataPoints
    };
  }

  // 1. الأدوات والتجهيزات
  candidate.supportNeeds.forEach(need => {
    let cost = 500; // Default
    if (need.includes('قارئ') || need.includes('تقني')) cost = 1500;
    if (need.includes('بيئة هادئة')) cost = 300;
    
    items.push({
      item: `توفير ${need}`,
      cost,
      reason: `دعم قدرة المرشح على تنفيذ المهام بشكل مستقل.`,
      linkedTaskOrGap: employer.criticalTasks[0]?.label || 'المهام العامة'
    });
  });

  // 2. تعديل بيئة العمل
  if (employer.executionContext === 'مكتبي' && candidate.environmentPrefs['noise'] === 'منخفض') {
    items.push({
      item: 'تعديلات صوتية للمكتب',
      cost: 800,
      reason: 'تقليل الضوضاء ليتناسب مع تفضيلات المرشح وضمان التركيز.',
      linkedTaskOrGap: 'بيئة العمل المكتبية'
    });
  }

  // 3. التدريب والتهيئة
  const complexityAvg = calculateAverage(employer.criticalTasks.map(t => t.complexity));
  if (complexityAvg > 70) {
    items.push({
      item: 'برنامج تدريب مكثف',
      cost: 2000,
      reason: 'رفع كفاءة المرشح في التعامل مع المهام ذات التعقيد العالي.',
      linkedTaskOrGap: 'المهام عالية التعقيد'
    });
  }

  // 4. الدعم التقني والمتابعة
  if (simulationEvidence?.isCompleted && simulationEvidence.result && simulationEvidence.result.supportDependency > 60) {
    items.push({
      item: 'دعم تقني مخصص (أول 3 أشهر)',
      cost: 1200,
      reason: 'رصد حاجة عالية للدعم في المحاكاة السلوكية.',
      linkedTaskOrGap: 'الاستقرار التشغيلي الأولي'
    });
  }

  const totalCost = items.reduce((sum, item) => sum + item.cost, 0);
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (totalCost > 3000) riskLevel = 'medium';
  if (totalCost > 6000) riskLevel = 'high';

  return {
    totalCost,
    items,
    operationalImpact: totalCost > 4000 
      ? 'يتطلب التكييف استثماراً أولياً مرتفعاً لضمان استدامة الأداء.' 
      : 'الأثر التشغيلي للتكييف محدود ويسهل إدارته ضمن الميزانيات الاعتيادية.',
    riskLevel,
    caseUnderstandingImpact: `ساعد هذا التقدير في تحديد الفجوات المالية والتشغيلية، مما يجعل القرار أكثر واقعية وقابلية للتنفيذ.`,
    isDataSufficient: true
  };
};
