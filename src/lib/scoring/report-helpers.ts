import { DecisionResult, ScoringInputs } from './scoring-types';
import { getSimulationImpactExplanation, getSimulationEvidenceContribution } from './scoring-engine';

/**
 * Generates a high-quality Arabic executive summary for the report.
 */
export const generateExecutiveSummary = (decisionResult: DecisionResult): string => {
  const { decision, scores } = decisionResult;
  const taskFit = scores.taskFit.value;
  const accommodation = scores.accommodationFeasibility.value;
  const evidence = scores.evidenceStrength.value;

  if (decision === 'Approved') {
    return `تشير المعطيات الحالية إلى أن الحالة جاهزة تماماً للتوظيف، حيث يوجد توافق استثنائي بنسبة ${taskFit}% في المهام الأساسية مع قابلية تكييف عالية. القرار مدعوم بأدلة قوية وموثوقة، مما يجعل المسار التشغيلي واضحاً ومستقراً.`;
  }

  if (decision === 'Blocked') {
    return `تم رصد عوائق جوهرية تمنع المضي في هذا المسار حالياً. الفجوة في توافق المهام أو شدة المخاطر التشغيلية المرصودة تجعل القرار غير قابل للدفاع مؤسسياً في الوقت الراهن، وتوصى اللجنة بالبحث عن بدائل وظيفية أخرى.`;
  }

  // Conditional
  let reason = '';
  if (evidence < 50) {
    reason = 'بسبب محدودية الدليل المتاح وحاجة الملف لتعزيز دفاعيته';
  } else if (accommodation < 50) {
    reason = 'بسبب تعقيد متطلبات التكييف البيئي والحاجة لاعتمادات إضافية';
  } else {
    reason = 'بسبب وجود مخاطر تشغيلية متوسطة تتطلب خطة إدارة واضحة';
  }

  return `تشير المعطيات الحالية إلى أن الحالة واعدة من حيث توافق المهام وقابلية التكييف بنسبة ${accommodation}%، إلا أن القرار لا يزال مشروطاً ${reason}. وتوصى الجهة بالتركيز على استكمال المتطلبات التشغيلية قبل الإغلاق النهائي.`;
};

/**
 * Returns factors that support the current decision.
 */
export const getDecisionSupportFactors = (decisionResult: DecisionResult, inputs: ScoringInputs): string[] => {
  const factors: string[] = [];
  const { scores } = decisionResult;

  if (scores.taskFit.value > 70) factors.push('توافق قوي في المهام الأساسية');
  if (scores.roleClarity.value > 70) factors.push('وضوح عالٍ في الوظيفة والمسؤوليات');
  if (scores.accommodationFeasibility.value > 60) factors.push('قابلية تكييف مناسبة ومرنة');
  if (inputs.simulationEvidence?.isCompleted) factors.push('نتائج محاكاة سلوكية داعمة');
  if (scores.evidenceStrength.value > 60) factors.push('أدلة موثوقة وحديثة تدعم القرار');

  return factors.length > 0 ? factors : ['لا توجد عوامل دعم جوهرية مرصودة'];
};

/**
 * Returns factors that limit or block the decision.
 */
export const getDecisionLimitingFactors = (decisionResult: DecisionResult): string[] => {
  const factors: string[] = [];
  const { scores } = decisionResult;

  if (scores.evidenceStrength.value < 50) factors.push('ضعف في الأدلة الموثقة');
  if (scores.blockerSeverity.value > 50) factors.push('مخاطر تشغيلية مرتفعة');
  if (scores.taskFit.value < 50) factors.push('فجوة في المهارات الأساسية');
  if (scores.accommodationFeasibility.value < 40) factors.push('صعوبة في التكييف البيئي');
  if (scores.financialImpact.value > 70) factors.push('أثر مالي مرتفع للمخاطر');

  return factors.length > 0 ? factors : ['لا توجد محددات حرجة حالياً'];
};

/**
 * Returns actions that could change the decision status.
 */
export const getDecisionChangeActions = (decisionResult: DecisionResult): string[] => {
  const actions: string[] = [];
  const { scores, decision } = decisionResult;

  if (scores.evidenceStrength.value < 60) actions.push('إضافة دليل حديث يغطي المهمة الحرجة');
  if (scores.roleClarity.value < 60) actions.push('توضيح المهام الحساسة بشكل أدق');
  if (decision === 'Conditional') actions.push('اعتماد خطة تكييف بيئي محددة');
  if (scores.blockerSeverity.value > 40) actions.push('مراجعة وتقليل المخاطر التشغيلية');

  return actions.length > 0 ? actions : ['الحالة مكتملة ولا تتطلب إجراءات إضافية'];
};

/**
 * Returns executive-level impact of simulation results.
 */
export const getSimulationExecutiveImpact = (inputs: ScoringInputs): string[] => {
  const impacts: string[] = [];
  if (!inputs.simulationEvidence?.isCompleted || !inputs.simulationEvidence.result) return [];

  const sim = inputs.simulationEvidence.result;
  
  if (sim.performanceStability > 70) impacts.push('أكدت استقرار الأداء تحت الضغط');
  if (sim.executionAccuracy > 70) impacts.push('رفعت قوة الدليل السلوكي');
  if (sim.stressSensitivity > 70) impacts.push('أظهرت حساسية أعلى للضغط والسرعة');
  if (sim.supportDependency > 70) impacts.push('أكدت الحاجة لتكييف ودعم تشغيلي');
  else impacts.push('خففت من مستوى عدم اليقين السلوكي');

  return impacts;
};

/**
 * Returns a summary of governance and traceability.
 */
export const getGovernanceTraceSummary = (decisionResult: DecisionResult, inputs: ScoringInputs): string => {
  const { scores } = decisionResult;
  const hasSim = inputs.simulationEvidence?.isCompleted;
  const evidenceLevel = scores.evidenceStrength.label === 'high' ? 'مكتمل' : 'يحتاج تدقيق';
  
  return `تم بناء هذا التقرير بناءً على ${inputs.candidate.capabilities.length} قدرات مرصودة، و${inputs.employer.criticalTasks.length} مهام وظيفية حرجة. القرار حالياً ${scores.decisionDefensibility.value > 70 ? 'قابل للدفاع' : 'يحتاج تعزيز'} مؤسسياً، مع ${hasSim ? 'وجود' : 'غياب'} دليل سلوكي من المحاكاة.`;
};
