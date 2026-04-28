import { SimulationResult, SimulationOption, SimulationType } from './simulation-types';

export const calculateSimulationResults = (
  type: SimulationType,
  answers: SimulationOption[]
): SimulationResult => {
  const count = answers.length;
  if (count === 0) {
    return {
      simulationType: type,
      performanceStability: 0,
      executionAccuracy: 0,
      stressSensitivity: 0,
      supportDependency: 0,
      narrative: 'لم يتم إكمال المحاكاة.',
      impactFlags: [],
      completedAt: new Date().toISOString(),
    };
  }

  const avg = (key: keyof SimulationOption['metadata']) => 
    answers.reduce((acc, curr) => acc + curr.metadata[key], 0) / count;

  const performanceStability = Math.round(avg('responseQuality'));
  const executionAccuracy = Math.round(avg('prioritization'));
  const stressSensitivity = Math.round(avg('pressureHandling'));
  const supportDependency = Math.round(avg('supportNeed'));

  const narrative = generateNarrative(performanceStability, executionAccuracy, stressSensitivity, type);
  const impactFlags = generateImpactFlags(performanceStability, executionAccuracy, stressSensitivity);

  return {
    simulationType: type,
    performanceStability,
    executionAccuracy,
    stressSensitivity,
    supportDependency,
    narrative,
    impactFlags,
    completedAt: new Date().toISOString(),
  };
};

const generateNarrative = (stability: number, accuracy: number, stress: number, type: SimulationType): string => {
  let base = '';
  if (stability > 80) base += 'تشير النتيجة إلى قدرة ممتازة على الحفاظ على تسلسل منطقي في تنفيذ المهام. ';
  else if (stability > 50) base += 'تظهر النتائج استقراراً متوسطاً في الأداء مع بعض التذبذب تحت الضغط. ';
  else base += 'يلاحظ وجود تحديات في الحفاظ على وتيرة أداء ثابتة عند تزايد المتطلبات. ';

  if (stress > 70) base += 'هناك مرونة عالية في التعامل مع الظروف المتغيرة. ';
  else base += 'يتأثر الأداء بشكل ملحوظ عند زيادة الضغط وكثافة المعلومات. ';

  base += 'مما يجعل التكييف البيئي عاملًا داعمًا لاستقرار الأداء في هذا الدور.';
  
  return base;
};

const generateImpactFlags = (stability: number, accuracy: number, stress: number): string[] => {
  const flags: string[] = [];
  if (stability > 70) flags.push('دعم مستوى الثقة');
  if (accuracy > 70) flags.push('إضافة دليل سلوكي إيجابي');
  if (stress < 50) flags.push('توضيح الحاجة إلى تكييف بيئي');
  if (stability < 50) flags.push('تنبيه لمراجعة الموانع');
  return flags;
};

export const getLevelLabel = (value: number): string => {
  if (value > 85) return 'مرتفع جداً';
  if (value > 70) return 'مرتفع';
  if (value > 50) return 'جيد';
  if (value > 30) return 'متوسط';
  return 'يحتاج دعم';
};
