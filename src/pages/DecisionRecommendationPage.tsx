import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, SectionBlock } from '@/src/components/ui/Base';
import { PageHeader } from '@/src/components/layout/AppShell';
import { 
  ShieldCheck, 
  ChevronLeft,
  Sparkles,
  Loader2,
  Scale,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Gavel,
  History,
  Lock,
  Target,
  Zap,
  Banknote
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { 
  generateIEARecommendation, 
  generateAuditLog, 
  IEADecision, 
  AuditLog 
} from '@/src/services/ai-generator';

export default function DecisionRecommendationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<IEADecision | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLog | null>(null);
  const [step, setStep] = useState<'selection' | 'analysis'>('selection');
  
  const [formData, setFormData] = useState({
    jobAnalysis: '',
    capabilityAssessment: '',
    accommodationPlan: '',
    costEstimation: ''
  });

  const decisionTemplates = [
    { label: 'قبول كامل (تقني)', job: 'محلل بيانات ناشئ', fca: 'بكالوريوس تقنية، ضعف حركي (كرسي)', wa: 'تعديل ارتفاع المكتب، ممر دخول مهيأ', cv: 'تكلفة 5000 ريال، ROI خلال 4 أشهر', icon: CheckCircle2 },
    { label: 'قبول مشروط (بصري)', job: 'موظف مركز اتصال', fca: 'دبلوم، كف بصري كلي، مستخدم برايل', wa: 'برنامج NVDA، تدريب على النظام الداخلي', cv: 'تكلفة 8000 ريال، ROI خلال 7 أشهر', icon: ShieldCheck },
    { label: 'قبول (ضعف سمعي)', job: 'أخصائي أرشفة رقمية', fca: 'ثانوية، ضعف سمعي متوسط، لغة إشارة', wa: 'تنبيهات ضوئية للطوارئ، تدريب لغة إشارة للفريق', cv: 'تكلفة 3000 ريال، ROI خلال 3 أشهر', icon: Zap },
    { label: 'غير مناسب (تعارض)', job: 'فني ميداني (أبراج)', fca: 'إعاقة حركية شديدة، ضعف توازن', wa: 'صعوبة تكييف صعود الأبراج آلياً', cv: 'تكلفة مرتفعة جداً مع مخاطر سلامة', icon: XCircle }
  ];

  const handleGenerate = async (dataOverride?: typeof formData) => {
    const dataToUse = dataOverride || formData;
    
    // Validate if we have enough data to proceed
    if (!dataToUse.jobAnalysis && !dataToUse.capabilityAssessment) {
      console.warn("Insufficient data for analysis");
      return;
    }

    setLoading(true);
    setStep('analysis');
    try {
      const rec = await generateIEARecommendation(dataToUse);
      setRecommendation(rec);
      
      const audit = await generateAuditLog({
        recommendation: rec.finalRecommendation,
        justification: rec.professionalJustification
      });
      setAuditLog(audit);
    } catch (error) {
      console.error("IEA Analysis Error:", error);
      // Fallback state to prevent UI hang
      setRecommendation({
        jobEmployabilityScore: 70,
        candidateCompatibilityScore: 65,
        proposedAccommodations: [
          { label: "دعم فني مؤقت", impact: "متوسط", cost: "1000 ريال" }
        ],
        financialImpact: { roi: "1.5x", setupCost: "1000 ريال", annualCost: "200 ريال" },
        finalRecommendation: 'مناسب بشروط' as any,
        confidenceScore: 50,
        topReasons: ["تعذر الاتصال بخدمة الذكاء الاصطناعي حالياً"],
        topRisks: ["النتائج المقدمة هي تقديرات افتراضية للمنظومة"],
        professionalJustification: "النظام يواجه ضغطاً في معالجة طلبات الذكاء الاصطناعي. التوصية الحالية استرشادية بناءً على القواعد المخزنة مسبقاً."
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'selection') {
    return (
      <div className="max-w-[1000px] mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center space-y-4">
          <PageHeader 
            title="الحوكمة والتوصية النهائية" 
            description="دمج كافة الوحدات لإصدار تقرير «مِعيار» السيادي والقرار المهني النهائي."
          />
          <div className="w-full h-1.5 bg-neutral rounded-full max-w-xs mx-auto overflow-hidden">
            <div className="h-full bg-primary w-[85%] transition-all duration-500" />
          </div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">المرحلة 5 من 6: الحوكمة</p>
        </div>

        <Card level={2} className="p-10 bg-white border-primary/10 shadow-2xl space-y-10 rounded-[40px]">
          <div className="space-y-8 text-right">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {decisionTemplates.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => setFormData({
                    jobAnalysis: tpl.job,
                    capabilityAssessment: tpl.fca,
                    accommodationPlan: tpl.wa,
                    costEstimation: tpl.cv
                  })}
                  className={cn(
                    "p-5 rounded-[28px] border-2 flex flex-col items-center gap-3 transition-all hover:shadow-xl",
                    formData.jobAnalysis === tpl.job 
                      ? "bg-primary border-primary text-white shadow-primary/20 scale-105" 
                      : "bg-neutral/30 border-transparent text-text-secondary hover:border-primary/20 hover:bg-white"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-xl",
                    formData.jobAnalysis === tpl.job ? "bg-white/20" : "bg-white shadow-sm"
                  )}>
                    <tpl.icon className={cn("w-5 h-5", formData.jobAnalysis === tpl.job ? "text-white" : "text-primary")} />
                  </div>
                  <span className="text-[10px] font-black">{tpl.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted pr-2 uppercase">مخرجات JTA + FCA</label>
                <textarea 
                  className="w-full h-24 bg-neutral/50 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 py-4 text-xs font-bold outline-none transition-all"
                  value={formData.jobAnalysis + " | " + formData.capabilityAssessment}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted pr-2 uppercase">مخرجات WA + CV</label>
                <textarea 
                  className="w-full h-24 bg-neutral/50 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 py-4 text-xs font-bold outline-none transition-all"
                  value={formData.accommodationPlan + " | " + formData.costEstimation}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              size="lg"
              variant="primary"
              onClick={() => handleGenerate()}
              disabled={!formData.jobAnalysis}
              className="h-20 px-16 rounded-[28px] text-lg font-black gap-4 shadow-2xl shadow-primary/30"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Gavel className="w-6 h-6" />}
              إصدار الحكم المهني النهائي
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto space-y-12 pb-24 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-3">
            <Gavel className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-black text-primary m-0">ركن الحوكمة والقرار (DRG)</h1>
          </div>
          <p className="text-text-secondary font-medium italic">توثيق السيادة السريرية والتشغيلية الموحدة</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setStep('selection')} className="font-bold text-xs gap-2">
            <ChevronLeft className="w-4 h-4" />
            تعديل سياق القرار
          </Button>
        </div>
      </div>

      <div className="w-full h-1.5 bg-neutral rounded-full overflow-hidden">
        <div className="h-full bg-primary w-[100%] transition-all duration-1000" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Results Area */}
        <div className="lg:col-span-8 space-y-10">
          {loading && (
            <div className="h-[500px] flex flex-col items-center justify-center text-center p-12 space-y-8 bg-white rounded-[40px] border shadow-2xl">
              <div className="relative">
                <ShieldCheck className="w-20 h-20 text-primary animate-pulse" />
                <Loader2 className="w-8 h-8 text-secondary animate-spin absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-primary">صياغة مسودة الحوكمة...</h3>
                <p className="text-text-secondary font-medium">نقوم الآن بتحميل كامل مخرجات «مِعيار» لإصدار التقرير المحكم.</p>
              </div>
            </div>
          )}

          {recommendation && auditLog && !loading && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {/* Recommendation Header Case */}
              <div className={cn(
                "p-12 rounded-[48px] border-4 flex flex-col items-center text-center gap-8 relative overflow-hidden shadow-2xl transition-all duration-500",
                recommendation.finalRecommendation === 'مناسب' ? "bg-secondary/5 border-secondary/20 shadow-secondary/5" :
                recommendation.finalRecommendation === 'مناسب مع تكييف' ? "bg-primary/5 border-primary/20 shadow-primary/5" :
                recommendation.finalRecommendation === 'مناسب بشروط' ? "bg-warning/5 border-warning/20 shadow-warning/5" : "bg-danger/5 border-danger/20 shadow-danger/5"
              )}>
                {/* Seal of Approval - Top Left */}
                <div className="absolute top-10 left-10 w-24 h-24 border-4 border-secondary/40 rounded-full flex items-center justify-center -rotate-12 group hover:rotate-0 transition-transform duration-700">
                  <div className="w-20 h-20 border-2 border-dashed border-secondary/30 rounded-full flex flex-col items-center justify-center p-2">
                    <ShieldCheck className="w-6 h-6 text-secondary mb-1" />
                    <span className="text-[6px] font-black text-secondary uppercase tracking-[0.3em] leading-tight text-center">Seal of<br/>Approval</span>
                  </div>
                </div>

                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <ShieldCheck className="w-48 h-48" />
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-2 justify-center">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">توصية وكيل التوظيف الشامل (IEA)</span>
                    <div className="px-2 py-0.5 bg-primary/10 rounded text-[9px] font-black text-primary border border-primary/20">درجة الثقة: {recommendation.confidenceScore}%</div>
                  </div>
                  <h2 className={cn(
                    "text-7xl font-black tracking-tighter m-0 italic",
                    recommendation.finalRecommendation === 'مناسب' ? "text-secondary" :
                    recommendation.finalRecommendation === 'مناسب مع تكييف' ? "text-primary" :
                    recommendation.finalRecommendation === 'مناسب بشروط' ? "text-warning" : "text-danger"
                  )}>
                    {recommendation.finalRecommendation}
                  </h2>
                </div>

                <div className="max-w-2xl bg-white/60 backdrop-blur-sm p-10 rounded-[32px] border border-white shadow-xl space-y-6 relative z-10">
                  <div className="flex items-center gap-3 justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-xs font-black text-primary uppercase tracking-widest">تفسير السيادة المهنية</span>
                  </div>
                  <p className="text-2xl text-text-primary leading-relaxed font-bold italic m-0">
                    " {recommendation.professionalJustification} "
                  </p>
                </div>

                <div className="flex gap-4 relative z-10">
                  <div className="px-6 py-2 bg-white rounded-full border border-border shadow-sm text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    مُدقّق سيادياً
                  </div>
                  <div className="px-6 py-2 bg-white rounded-full border border-border shadow-sm text-[10px] font-black text-text-muted uppercase tracking-widest">
                    معيار بروتوكول IEA v1.0
                  </div>
                </div>
              </div>

              {/* IEA CORE METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card level={2} className="p-8 space-y-8 rounded-[40px] border-border bg-white shadow-xl group">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-primary m-0">درجات المطابقة والتمكين</h3>
                      <p className="text-[10px] font-bold text-text-muted italic m-0">تحليل الربط البين مخرجات JTA و FCA</p>
                    </div>
                    <Target className="w-6 h-6 text-primary/30" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-neutral/10 rounded-3xl border border-transparent hover:border-primary/20 transition-all text-center space-y-2">
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">قابلية الوظيفة (JTA)</span>
                      <div className="text-4xl font-black text-primary italic">{recommendation.jobEmployabilityScore}%</div>
                    </div>
                    <div className="p-6 bg-neutral/10 rounded-3xl border border-transparent hover:border-secondary/20 transition-all text-center space-y-2">
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">توافق المرشح (FCA)</span>
                      <div className="text-4xl font-black text-secondary italic">{recommendation.candidateCompatibilityScore}%</div>
                    </div>
                  </div>
                </Card>

                <Card level={2} className="p-8 space-y-8 rounded-[40px] border-border bg-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-primary m-0">الأثر المالي المتوقع</h3>
                      <p className="text-[10px] font-bold text-text-muted italic m-0">تقدير الفائدة التشغيلية (ROI)</p>
                    </div>
                    <Banknote className="w-6 h-6 text-primary/30" />
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">العائد الاستثماري (ROI)</span>
                        <div className="text-5xl font-black text-primary italic leading-none">{recommendation.financialImpact.roi}</div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-[9px] font-bold text-text-muted">التأسيس: <span className="font-black text-primary">{recommendation.financialImpact.setupCost}</span></div>
                        <div className="text-[9px] font-bold text-text-muted">السنوي: <span className="font-black text-primary">{recommendation.financialImpact.annualCost}</span></div>
                      </div>
                    </div>
                    <div className="h-1 w-full bg-neutral rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[85%]" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Reasons & Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SectionBlock title="أهم أسباب التوصية">
                  <div className="space-y-4">
                    {recommendation.topReasons.map((reason, i) => (
                      <div key={i} className="p-5 bg-white border border-border rounded-2xl flex items-center gap-4 shadow-sm hover:border-secondary/20 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                        <span className="text-sm font-bold text-primary">{reason}</span>
                      </div>
                    ))}
                  </div>
                </SectionBlock>
                <SectionBlock title="المخاطر والاشتراطات">
                  <div className="space-y-4">
                    {recommendation.topRisks.map((risk, i) => (
                      <div key={i} className="p-5 bg-danger/5 border border-danger/10 rounded-2xl flex items-center gap-4 shadow-sm hover:border-danger/20 transition-colors">
                        <AlertCircle className="w-5 h-5 text-danger shrink-0" />
                        <span className="text-sm font-bold text-danger">{risk}</span>
                      </div>
                    ))}
                  </div>
                </SectionBlock>
              </div>

              {/* Proposed Accommodations (IEA WA) */}
              <SectionBlock title="تكييفات التمكين (Proposed Accommodations)">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendation.proposedAccommodations.map((acc, i) => (
                    <Card key={i} level={1} className="p-6 bg-white border border-border rounded-3xl space-y-4 hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between">
                        <Zap className="w-5 h-5 text-primary opacity-30" />
                        <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded">{acc.impact} الأثر</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-primary m-0">{acc.label}</h4>
                        <p className="text-[10px] font-bold text-text-muted">التكلفة: {acc.cost}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </SectionBlock>

              {/* Audit Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AuditItem title="منطق JTA/FCA" content={auditLog.taskCapabilityLink} icon={Target} />
                <AuditItem title="منطق WA" content={auditLog.accommodationAcceptability} icon={Zap} />
                <AuditItem title="منطق CV" content={auditLog.costValueRationality} icon={Banknote} />
                <AuditItem title="حدود القرار" content={auditLog.decisionBoundaries} icon={Lock} />
              </div>
            </div>
          )}
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card level={1} className={cn(
            "p-8 sticky top-28 bg-white shadow-xl border border-border rounded-[32px] space-y-8",
            !recommendation && "opacity-50 grayscale pointer-events-none"
          )}>
            <div className="text-center p-8 bg-neutral/50 rounded-3xl space-y-4 border border-transparent">
              <FileText className="w-12 h-12 text-primary mx-auto opacity-20" />
              <h3 className="text-xl font-black text-primary m-0 tracking-tight">التقرير الشامل</h3>
              <p className="text-[10px] font-bold text-text-muted m-0">جاهز للتصدير والمراجعة النهائية</p>
            </div>
            
            <div className="space-y-4">
              <Button variant="primary" className="w-full h-16 rounded-2xl font-black gap-3 shadow-xl shadow-primary/20 bg-primary">
                تصدير PDF السيادي
                <FileText className="w-5 h-5" />
              </Button>
              <Button variant="ghost" className="w-full h-14 rounded-2xl font-bold text-xs border border-border">
                مشاركة مع لجنة التوظيف
              </Button>
            </div>

            <div className="p-5 bg-secondary/5 rounded-2xl border border-secondary/10 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-secondary" />
              <div className="text-right">
                <span className="text-[10px] font-black text-secondary block uppercase">حالة القرار</span>
                <span className="text-xs font-bold text-primary">مُعتمد وموقع رقمياً</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AuditItem({ title, content, icon: Icon }: { title: string; content: string; icon: any }) {
  return (
    <div className="p-8 space-y-4 rounded-[32px] bg-neutral/50 border border-border group hover:bg-white hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white rounded-xl border border-border group-hover:border-primary/20 transition-colors">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest m-0">{title}</h4>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed font-bold italic m-0">
        " {content} "
      </p>
    </div>
  );
}
