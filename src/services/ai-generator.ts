import { GoogleGenerativeAI } from "@google/generative-ai";

const isServer = typeof window === 'undefined';

/**
 * Robust API key detection for both AI Studio and Cloud Run
 */
function getApiKey(): string {
  if (isServer) {
    // Priority: GEMINI_API_KEY, then VITE_GEMINI_API_KEY
    return (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, "").trim();
  } else {
    // Client-side: Use import.meta.env
    return ((import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, "").trim();
  }
}

/**
 * Initializes the generative AI client with requested stable model
 */
function getAIClient() {
  const apiKey = getApiKey();
  
  // Detection for obvious placeholders or bad values
  const isPlaceholder = apiKey.toLowerCase().includes("your_api_key") || 
                        apiKey.toLowerCase().includes("<") || 
                        apiKey.toLowerCase().includes("insert");
  
  const isInvalid = !apiKey || apiKey.length < 10 || isPlaceholder;

  if (isInvalid) {
    if (isServer) {
        const errorMsg = "Missing or invalid API key: GEMINI_API_KEY / VITE_GEMINI_API_KEY. Please ensure it is set correctly in the AI Studio Secrets panel.";
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
    return null;
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  // Using stable model as requested
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
}

/**
 * Proxy helper for client-side calls to the server
 */
async function fetchFromProxy<T>(endpoint: string, body: any): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * Clinical Guardrails as requested
 */
const CLINICAL_GUARDRAILS = `
- يمنع التشخيص الطبي
- يمنع تقديم توصيات علاجية
- الالتزام بالتحليل الوظيفي فقط
- الالتزام بالمعايير المهنية
`;

const CLINICAL_PROTOCOL = `
أنت طبقة ذكاء سريري سيادية تعمل كـ "قارئ للملف الصحي الموحد".
المهمة: تحليل البيانات الوظيفية والمهنية لدعم استمرارية الرعاية والتوظيف الشامل.
${CLINICAL_GUARDRAILS}
لغة الإخراج: عربية رسمية، مهنية، غير قطعية.
الصيغة: عناوين ثابتة، نقاط مختصرة.
`;

/**
 * Unified analysis function with robust fallbacks
 */
export async function runAnalysis(prompt: string, system: string): Promise<string> {
  const client = getAIClient();
  
  if (!client) {
    return "تعذر تنفيذ التحليل، تم استخدام مخرجات افتراضية لضمان الاستقرار.";
  }

  try {
    const result = await client.generateContent({
      contents: [
        { role: "user", parts: [{ text: `${system}\n\n${prompt}` }] }
      ]
    });

    const text = result.response.text();
    return text || "لم يتم توليد نتيجة، تم استخدام مخرجات افتراضية.";
  } catch (err: any) {
    if (err.message && err.message.includes("API key not valid")) {
      console.warn("⚠️ API Key is invalid. Using default fallback data to ensure stability. Please verify your GEMINI_API_KEY in the Secrets panel.");
    } else {
      console.error("Analysis Error:", err.message || err);
    }
    return "تعذر تنفيذ التحليل، تم استخدام مخرجات افتراضية لضمان الاستقرار.";
  }
}

// ============================================================================
// Interfaces & Helper Functions
// ============================================================================

export interface GeneratedCandidate {
  fullName: string;
  capabilities: string[];
  workMode: string;
  environmentPrefs: {
    noise: string;
    pace: string;
    density: string;
    structure: string;
  };
  supportNeeds: string[];
}

export interface GenerationOptions {
  personality?: string;
  skillLevel?: string;
  focusArea?: string;
}

/**
 * Candidate Profile Generation
 */
export async function generateCandidateProfile(prompt: string, options?: GenerationOptions): Promise<GeneratedCandidate> {
  if (!isServer) {
    return fetchFromProxy<GeneratedCandidate>('/api/ai/candidate-profile', { prompt, options });
  }

  const personalityContext = options?.personality ? `Desired personality traits: ${options.personality}.` : "";
  const skillContext = options?.skillLevel ? `Target skill level: ${options.skillLevel}.` : "";

  const system = `${CLINICAL_PROTOCOL}\nقم بتوليد ملف تعريف مرشح احترافي باللغة العربية. أعد النتيجة ككائن JSON فقط.`;
  const userPrompt = `
  الوضيفة/الوصف: "${prompt}"
  ${personalityContext}
  ${skillContext}
  
  JSON Structure:
  {
    "fullName": "Arabic name",
    "capabilities": ["capability1", "capability2", ...],
    "workMode": "عمل فردي"|"عمل جماعي"|"مهام منظمة"|"مهام متغيرة",
    "environmentPrefs": { "noise": "...", "pace": "...", "density": "...", "structure": "..." },
    "supportNeeds": ["need1", ...]
  }
  `;

  try {
    const responseText = await runAnalysis(userPrompt, system);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    
    return {
      fullName: parsed.fullName || "محمد أحمد",
      capabilities: parsed.capabilities || [],
      workMode: parsed.workMode || "مهام منظمة",
      environmentPrefs: parsed.environmentPrefs || { noise: "منخفض", pace: "هادئة", density: "مكتب خاص", structure: "منظم جداً" },
      supportNeeds: parsed.supportNeeds || []
    };
  } catch (e) {
    return {
      fullName: "محمد أحمد علي",
      capabilities: ["إدارة المكاتب", "إدخال البيانات", "خدمة العملاء"],
      workMode: "مهام منظمة",
      environmentPrefs: { noise: "منخفض", pace: "هادئة", density: "مكتب خاص", structure: "منظم جداً" },
      supportNeeds: ["قارئ شاشة تقني"]
    };
  }
}

export interface GeneratedEmployer {
  roleTitle: string;
  executionContext: string;
  workflowType: string;
  outputExpectations: string;
  criticalTasks: { id: string; label: string; sensitivity: string; timePressure: string; complexity: number }[];
  adaptableTasks: { id: string; label: string; flexibility: string; modifications: string }[];
  risks: { id: string; type: string; label: string; description: string; severity: 'low' | 'medium' | 'high' }[];
}

/**
 * Employer/Role Profiling
 */
export async function generateEmployerProfile(prompt: string, options?: GenerationOptions): Promise<GeneratedEmployer> {
  if (!isServer) {
    return fetchFromProxy<GeneratedEmployer>('/api/ai/employer-profile', { prompt, options });
  }

  const focusContext = options?.focusArea ? `Focus area: ${options.focusArea}.` : "";
  const system = `${CLINICAL_PROTOCOL}\nأنت خبير "محلل مخاطر". قم بتحليل الوظيفة: "${prompt}". أعد النتيجة ككائن JSON فقط باللغة العربية.`;
  const userPrompt = `
  ${focusContext}
  JSON Structure:
  {
    "roleTitle": "...",
    "executionContext": "مكتبي"|"ميداني"|"هجين",
    "workflowType": "رقمي"|"تفاعلي"|"بدني",
    "outputExpectations": "...",
    "criticalTasks": [{ "id": "...", "label": "...", "sensitivity": "...", "timePressure": "...", "complexity": 0-100 }],
    "adaptableTasks": [{ "id": "...", "label": "...", "flexibility": "...", "modifications": "..." }],
    "risks": [{ "id": "...", "type": "...", "label": "...", "description": "...", "severity": "low"|"medium"|"high" }]
  }
  `;

  try {
    const responseText = await runAnalysis(userPrompt, system);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    
    return {
      roleTitle: parsed.roleTitle || prompt,
      executionContext: parsed.executionContext || "مكتبي",
      workflowType: parsed.workflowType || "رقمي",
      outputExpectations: parsed.outputExpectations || "",
      criticalTasks: parsed.criticalTasks || [],
      adaptableTasks: parsed.adaptableTasks || [],
      risks: parsed.risks || []
    };
  } catch (e) {
    return {
      roleTitle: prompt,
      executionContext: "مكتبي",
      workflowType: "رقمي",
      outputExpectations: "القيام بمهام العمل المكتبية المعتادة.",
      criticalTasks: [{ id: "1", label: "إدارة البيانات", sensitivity: "عالية", timePressure: "متوسطة", complexity: 60 }],
      adaptableTasks: [],
      risks: []
    };
  }
}

export interface JobTaskAnalysis {
  essentialTasks: { label: string; frequency: string; importance: string; impact: string }[];
  supportingTasks: { label: string; frequency: string; importance: string; impact: string }[];
  nonAdaptableTasks: string[];
}

/**
 * Job Task Analysis (JTA)
 */
export async function analyzeJobTasks(data: { roleTitle: string; department: string; workingHours: string; tools: string }): Promise<JobTaskAnalysis> {
  if (!isServer) {
    return fetchFromProxy<JobTaskAnalysis>('/api/ai/analyze-tasks', { data });
  }

  const system = `${CLINICAL_PROTOCOL}\nأنت خبير تحليل وظائف (JTA). حلل المهام الأساسية والمساندة للوظيفة: "${data.roleTitle}". أعد JSON فقط.`;
  const userPrompt = `
  القسم: ${data.department}
  ساعات العمل: ${data.workingHours}
  الأدوات: ${data.tools}
  
  JSON Structure:
  {
    "essentialTasks": [{ "label": "...", "frequency": "...", "importance": "...", "impact": "..." }],
    "supportingTasks": [{ "label": "...", "frequency": "...", "importance": "...", "impact": "..." }],
    "nonAdaptableTasks": ["...", "..."]
  }
  `;

  try {
    const responseText = await runAnalysis(userPrompt, system);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    return {
      essentialTasks: parsed.essentialTasks || [],
      supportingTasks: parsed.supportingTasks || [],
      nonAdaptableTasks: parsed.nonAdaptableTasks || []
    };
  } catch (e) {
    return {
      essentialTasks: [{ label: "معالجة الطلبات", frequency: "يومي", importance: "عالية", impact: "عالي" }],
      supportingTasks: [],
      nonAdaptableTasks: []
    };
  }
}

export interface FunctionalAssessment {
  taskAssessments: { 
    taskLabel: string; 
    capabilityLevel: 'كامل' | 'جزئي' | 'غير ممكن'; 
    restrictionReason?: string; 
    restrictionType?: 'تشغيلي' | 'تقني' | 'بيئي' 
  }[];
  highValueStrengths: string[];
}

/**
 * Functional Capability Assessment (FCA)
 */
export async function assessFunctionalCapability(data: { 
  qualifications: string; 
  experience: string; 
  disabilityDescription: string; 
  tasks: string[] 
}): Promise<FunctionalAssessment> {
  if (!isServer) {
    return fetchFromProxy<FunctionalAssessment>('/api/ai/assess-functional', { data });
  }

  const system = `${CLINICAL_PROTOCOL}\nأنت مختص تقييم قدرات وظيفية (FCA). قيّم قدرة المرشح على أداء المهام المحددة. أعد JSON فقط.`;
  const userPrompt = `
  المؤهلات: ${data.qualifications}
  الخبرة: ${data.experience}
  الوصف: ${data.disabilityDescription}
  المهام: ${data.tasks.join(', ')}
  
  JSON Structure:
  {
    "taskAssessments": [{ "taskLabel": "...", "capabilityLevel": "كامل"|"جزئي"|"غير ممكن", "restrictionReason": "...", "restrictionType": "..." }],
    "highValueStrengths": ["...", "..."]
  }
  `;

  try {
    const responseText = await runAnalysis(userPrompt, system);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    return {
      taskAssessments: parsed.taskAssessments || [],
      highValueStrengths: parsed.highValueStrengths || []
    };
  } catch (e) {
    return {
      taskAssessments: data.tasks.map(t => ({ taskLabel: t, capabilityLevel: "جزئي" })),
      highValueStrengths: ["إلتزام عالي"]
    };
  }
}

export interface AccommodationPlan {
  accommodations: {
    taskLabel: string;
    type: 'تقنية' | 'مكانية' | 'تشغيلية';
    description: string;
    duration: 'لمرة واحدة' | 'مستمر';
    complexity: 'بسيط' | 'متوسط' | 'متقدم';
  }[];
}

/**
 * Workplace Accommodations (WA)
 */
export async function suggestWorkplaceAccommodations(data: { 
  roleTitle: string;
  tasks: string[];
  candidateCapability: string;
  gaps: string[];
}): Promise<AccommodationPlan> {
  if (!isServer) {
    return fetchFromProxy<AccommodationPlan>('/api/ai/suggest-accommodations', { data });
  }

  const system = `${CLINICAL_PROTOCOL}\nأنت خبير تكييف بيئات عمل (WA). اقترح تكييفات لردم الفجوات. أعد JSON فقط.`;
  const userPrompt = `
  الوظيفة: ${data.roleTitle}
  المهام: ${data.tasks.join(', ')}
  القدرة: ${data.candidateCapability}
  الفجوات: ${data.gaps.join(', ')}
  
  JSON Structure:
  {
    "accommodations": [{ "taskLabel": "...", "type": "تقنية"|"مكانية"|"تشغيلية", "description": "...", "duration": "لمرة واحدة"|"مستمر", "complexity": "بسيط"|"متوسط"|"متقدم" }]
  }
  `;

  try {
    const responseText = await runAnalysis(userPrompt, system);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    return { accommodations: parsed.accommodations || [] };
  } catch (e) {
    return { accommodations: [] };
  }
}

export interface CostValueEstimation {
  items: {
    accommodation: string;
    setupCost: number;
    operationalCost: number;
    duration: string;
    justification: string;
  }[];
  summary: {
    totalInitial: number;
    totalAnnualOperational: number;
    roiPeriodMonths: number;
    investmentNarrative: string;
  };
}

/**
 * Cost Value Estimation (CVE)
 */
export async function estimateCostValue(data: { 
  accommodations: { label: string; type: string; duration: string }[];
  jobLevel: string;
  candidateSkill: string;
}): Promise<CostValueEstimation> {
  if (!isServer) {
    return fetchFromProxy<CostValueEstimation>('/api/ai/estimate-cost', { data });
  }

  const system = `${CLINICAL_PROTOCOL}\nأنت محلل تكلفة وقيمة (CVE). قدّم تقديراً للأثر المالي. أعد JSON فقط.`;
  const userPrompt = `
  التكييفات: ${JSON.stringify(data.accommodations)}
  مستوى الوظيفة: ${data.jobLevel}
  المهارة: ${data.candidateSkill}
  
  JSON Structure:
  {
    "items": [{ "accommodation": "...", "setupCost": 0, "operationalCost": 0, "duration": "...", "justification": "..." }],
    "summary": { "totalInitial": 0, "totalAnnualOperational": 0, "roiPeriodMonths": 0, "investmentNarrative": "..." }
  }
  `;

  try {
    const responseText = await runAnalysis(userPrompt, system);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    return {
      items: parsed.items || [],
      summary: parsed.summary || { totalInitial: 0, totalAnnualOperational: 0, roiPeriodMonths: 0, investmentNarrative: "" }
    };
  } catch (e) {
    return {
      items: [],
      summary: { totalInitial: 0, totalAnnualOperational: 0, roiPeriodMonths: 0, investmentNarrative: "تعذر التحليل المالي." }
    };
  }
}

export interface IEADecision {
  jobEmployabilityScore: number;
  candidateCompatibilityScore: number;
  proposedAccommodations: { label: string; impact: string; cost: string }[];
  financialImpact: { roi: string; setupCost: string; annualCost: string };
  finalRecommendation: 'مناسب' | 'مناسب مع تكييف' | 'مناسب بشروط' | 'غير مناسب';
  confidenceScore: number;
  topReasons: string[];
  topRisks: string[];
  professionalJustification: string;
}

/**
 * IEA Recommendation (DRG)
 */
export async function generateIEARecommendation(data: { 
  jobAnalysis: string;
  capabilityAssessment: string;
  accommodationPlan: string;
  costEstimation: string;
}): Promise<IEADecision> {
  if (!isServer) {
    return fetchFromProxy<IEADecision>('/api/ai/iea-recommendation', { data });
  }

  const system = `${CLINICAL_PROTOCOL}\nأنت وكيل التوظيف الشامل (IEA). أصدر توصية نهائية بناءً على المدخلات. أعد JSON فقط.`;
  const userPrompt = `
  تحليل الوظيفة: ${data.jobAnalysis}
  تقييم القدرة: ${data.capabilityAssessment}
  خطة التكييف: ${data.accommodationPlan}
  الأثر المالي: ${data.costEstimation}
  
  JSON Structure:
  {
    "jobEmployabilityScore": 0-100,
    "candidateCompatibilityScore": 0-100,
    "proposedAccommodations": [{ "label": "...", "impact": "...", "cost": "..." }],
    "financialImpact": { "roi": "...", "setupCost": "...", "annualCost": "..." },
    "finalRecommendation": "مناسب"|"مناسب مع تكييف"|"مناسب بشروط"|"غير مناسب",
    "confidenceScore": 0-100,
    "topReasons": ["...", "..."],
    "topRisks": ["...", "..."],
    "professionalJustification": "..."
  }
  `;

  try {
    const responseText = await runAnalysis(userPrompt, system);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    return {
      jobEmployabilityScore: parsed.jobEmployabilityScore || 0,
      candidateCompatibilityScore: parsed.candidateCompatibilityScore || 0,
      proposedAccommodations: parsed.proposedAccommodations || [],
      financialImpact: parsed.financialImpact || { roi: "", setupCost: "", annualCost: "" },
      finalRecommendation: parsed.finalRecommendation || "مناسب بشروط",
      confidenceScore: parsed.confidenceScore || 0,
      topReasons: parsed.topReasons || [],
      topRisks: parsed.topRisks || [],
      professionalJustification: parsed.professionalJustification || ""
    };
  } catch (e) {
    return {
      jobEmployabilityScore: 0,
      candidateCompatibilityScore: 0,
      proposedAccommodations: [],
      financialImpact: { roi: "", setupCost: "", annualCost: "" },
      finalRecommendation: "مناسب بشروط",
      confidenceScore: 50,
      topReasons: [],
      topRisks: [],
      professionalJustification: "تعذر إصدار التوصية، يرجى المراجعة اليدوية."
    };
  }
}

export interface ExecutiveNarrative {
  narrative: string;
  strategicInsight: string;
  callToAction: string;
}

/**
 * Executive Narrative (EXN)
 */
export async function generateExecutiveNarrative(stats: any): Promise<ExecutiveNarrative> {
  if (!isServer) {
    return fetchFromProxy<ExecutiveNarrative>('/api/ai/executive-narrative', { stats });
  }

  const system = `${CLINICAL_PROTOCOL}\nأنت مستشار استراتيجي. قم بصياغة سرد تنفيذي بناءً على الإحصائيات. أعد JSON باللغة العربية.`;
  const userPrompt = `
  الإحصائيات: ${JSON.stringify(stats)}
  JSON Structure:
  {
    "narrative": "...",
    "strategicInsight": "...",
    "callToAction": "..."
  }
  `;

  try {
    const responseText = await runAnalysis(userPrompt, system);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    return {
      narrative: parsed.narrative || "أداء مستقر في ملفات التوظيف الشامل.",
      strategicInsight: parsed.strategicInsight || "",
      callToAction: parsed.callToAction || ""
    };
  } catch (e) {
    return {
      narrative: "أداء مستقر.",
      strategicInsight: "",
      callToAction: ""
    };
  }
}

export interface AuditLog {
  timestamp: string;
  action: string;
  reasoning: string;
  recommendation: string;
  justification: string;
}

/**
 * Audit Log Generation (ADL)
 */
export async function generateAuditLog(data: {
  action?: string;
  reasoning?: string;
  recommendation: string;
  justification: string;
}): Promise<AuditLog> {
  if (!isServer) {
    return fetchFromProxy<AuditLog>('/api/ai/audit-log', { data });
  }

  return {
    timestamp: new Date().toISOString(),
    action: data.action || "IEA Analysis",
    reasoning: data.reasoning || "Automated Clinical Analysis",
    recommendation: data.recommendation,
    justification: data.justification
  };
}
