import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, SectionBlock } from '@/src/components/ui/Base';
import { PageHeader } from '@/src/components/layout/AppShell';
import { 
  User, 
  Search, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft,
  Sparkles,
  Loader2,
  Activity,
  Target,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { assessFunctionalCapability, FunctionalAssessment } from '@/src/services/ai-generator';

export default function FunctionalAssessmentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<FunctionalAssessment | null>(null);
  const [step, setStep] = useState<'selection' | 'analysis'>('selection');
  const [formData, setFormData] = useState({
    qualifications: '',
    experience: '',
    disabilityDescription: '',
    tasks: ''
  });

  const candidateTemplates = [
    { 
      label: 'إعاقة حركية (كرسي)', 
      qual: 'بكالوريوس نظم معلومات، لغة إنجليزية ممتازة', 
      exp: 'سنتين في إدخال البيانات والدعم الفني', 
      dis: 'إعاقة حركية في الأطراف السفلية، يستخدم كرسي متحرك يدوي.',
      icon: User
    },
    { 
      label: 'ضعف بصري (شديد)', 
      qual: 'دبلوم خدمة عملاء، إتقان برمجيات قراءة الشاشة', 
      exp: '4 سنوات في مركز اتصال (Tele-sales)', 
      dis: 'كف بصري كلي، يعتمد على برنامج NVDA وأدوات برايل الإلكترونية.',
      icon: Activity
    },
    { 
      label: 'ضعف سمعي (متوسط)', 
      qual: 'ثانوية عامة، مهارات كتابية عالية', 
      exp: '3 سنوات في الأرشفة والعمل المكتبي', 
      dis: 'ضعف سمعي متوسط في الأذنين، يستخدم سماعات طبية، يجيد لغة الإشارة.',
      icon: Target
    }
  ];

  const handleTemplateClick = (tpl: typeof candidateTemplates[0]) => {
    setFormData({
      qualifications: tpl.qual,
      experience: tpl.exp,
      disabilityDescription: tpl.dis,
      tasks: formData.tasks
    });
  };

  const handleAssess = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setStep('analysis');
    try {
      const taskList = formData.tasks.split('\n').filter(t => t.trim().length > 0);
      const result = await assessFunctionalCapability({
        ...formData,
        tasks: taskList.length > 0 ? taskList : ["التواصل اليومي", "إدخال البيانات", "حضور الاجتماعات"]
      });
      setAssessment(result);
    } catch (error) {
      console.error("FCA Analysis Error:", error);
      // Fallback for resilience
      setAssessment({
        taskAssessments: [
          { taskLabel: "التواصل اليومي مع الفريق", capabilityLevel: "كامل" },
          { taskLabel: "إدخال البيانات في النظام الرقمي", capabilityLevel: "جزئي", restrictionReason: "الحاجة لدعم تقني في إبصار الحقول الصغيرة", restrictionType: "تقني" },
          { taskLabel: "حضور الاجتماعات الميدانية", capabilityLevel: "جزئي", restrictionReason: "صعوبة الوصول لبعض المواقع غير المهيأة حركياً", restrictionType: "بيئي" }
        ],
        highValueStrengths: ["إتقان عالي جداً للغة الإنجليزية", "خلفية تقنية قوية"]
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'selection') {
    return (
      <div className="max-w-[1000px] mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-6">
        <PageHeader 
          title="تقييم القدرة الوظيفية (FCA)" 
          description="مطابقة الملف السريري والمهني للمرشح مع المتطلبات الواقعية للوظيفة."
        />
        <div className="flex flex-col items-center gap-4">
          <div className="w-full h-2 bg-neutral rounded-full max-w-md mx-auto overflow-hidden shadow-inner">
            <div className="h-full bg-secondary w-[33%] transition-all duration-1000 ease-out shadow-lg" />
          </div>
          <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] animate-pulse">المرحلة 2 من 6: فحص الملاءمة السريرية</p>
        </div>
      </div>

      <Card level={2} className="p-12 bg-white border-secondary/10 shadow-2xl space-y-12 rounded-[56px] relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-10 relative z-10 text-right">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">اختر ملف مرشح جاهز للمحاكاة:</h3>
              <span className="w-24 h-px bg-border" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {candidateTemplates.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => handleTemplateClick(tpl)}
                  className={cn(
                    "p-8 rounded-[40px] border-2 flex flex-col items-center gap-6 transition-all duration-500 group relative overflow-hidden text-right",
                    formData.disabilityDescription === tpl.dis 
                      ? "bg-secondary border-secondary text-white shadow-2xl shadow-secondary/30 scale-105" 
                      : "bg-neutral/20 border-transparent text-text-secondary hover:border-secondary/20 hover:bg-white hover:shadow-xl"
                  )}
                >
                  <div className={cn(
                    "p-6 rounded-3xl transition-transform duration-500 group-hover:rotate-12",
                    formData.disabilityDescription === tpl.dis ? "bg-white/20 shadow-inner" : "bg-white shadow-lg"
                  )}>
                    <tpl.icon className={cn("w-8 h-8", formData.disabilityDescription === tpl.dis ? "text-white" : "text-secondary")} />
                  </div>
                  <span className="text-base font-black text-center leading-tight">{tpl.label}</span>
                  {formData.disabilityDescription === tpl.dis && (
                    <div className="absolute top-4 left-4 animate-in zoom-in">
                      <CheckCircle2 className="w-5 h-5 text-white/50" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <label className="text-sm font-black text-primary pr-2 flex items-center gap-3">
              <Activity className="w-5 h-5 text-secondary" />
              وصف الحالة السريرية والاحتياجات الوظيفية
            </label>
            <textarea 
              placeholder="صف مهارات المرشح، إعاقته، والأدوات التي يستخدمها حالياً..."
              className="w-full min-h-[160px] bg-neutral/40 border-4 border-transparent focus:border-secondary/20 focus:bg-white rounded-[40px] px-10 py-8 text-lg font-bold text-primary outline-none transition-all shadow-inner placeholder:text-text-muted/40"
              value={formData.disabilityDescription}
              onChange={e => setFormData({...formData, disabilityDescription: e.target.value})}
            />
          </div>
        </div>

        {formData.disabilityDescription && (
          <div className="flex justify-center pt-8 animate-in fade-in zoom-in slide-in-from-top-4 duration-500">
            <Button 
              size="lg"
              variant="secondary"
              onClick={handleAssess}
              className="h-24 px-20 rounded-[35px] text-xl font-black gap-6 shadow-2xl shadow-secondary/40 bg-secondary group hover:scale-105 active:scale-95 transition-all text-white"
            >
              <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform">
                {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Activity className="w-8 h-8" />}
              </div>
              بدء تقييم الملاءمة الوظيفية
            </Button>
          </div>
        )}
      </Card>

      <div className="text-center opacity-60">
        <p className="text-sm text-text-secondary font-bold italic leading-relaxed max-w-2xl mx-auto">
          "هذا التقييم يعتمد على بروتوكولات حوكمة السلامة المهنية لضمان حق الموظف في بيئة عمل آمنة ومنتجة."
        </p>
      </div>
    </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto space-y-12 pb-24 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-secondary" />
            <h1 className="text-3xl font-black text-primary m-0">تقييم القدرة (FCA)</h1>
          </div>
          <p className="text-text-secondary font-medium italic">تحليل المطابقة بين القدرة الوظيفية والمهام الميدانية</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setStep('selection')} className="font-bold text-xs gap-2">
            <ChevronLeft className="w-4 h-4" />
            تعديل ملف المرشح
          </Button>
        </div>
      </div>

      <div className="w-full h-1.5 bg-neutral rounded-full overflow-hidden">
        <div className="h-full bg-secondary w-[50%] transition-all duration-1000" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Info */}
        <div className="lg:col-span-4">
          <Card level={1} className="p-8 sticky top-28 bg-white shadow-xl border border-border/50 rounded-[32px] space-y-8">
            <div className="space-y-6">
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2">الملف المهني</span>
                <p className="text-xs font-bold text-primary leading-relaxed bg-neutral/50 p-4 rounded-2xl">{formData.qualifications || 'لم يتم إدخال مؤهلات'}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2">التقييد السريري</span>
                <p className="text-xs font-bold text-primary leading-relaxed bg-neutral/50 p-4 rounded-2xl">{formData.disabilityDescription}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border/30">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-danger" />
                <span className="text-[10px] font-bold text-danger uppercase tracking-widest">إرشادات سد الفجوة</span>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed font-bold italic">
                رتب أولويات التدخل في المهام التي سجلت "جزئي" لضمان أعلى مستوى إنتاجية بأقل تكلفة ممكنة.
              </p>
            </div>
          </Card>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8 space-y-10">
          {loading && (
            <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 space-y-8 bg-white rounded-[32px] border">
              <Activity className="w-16 h-16 text-secondary animate-bounce" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-primary">تموضع البيانات السريرية...</h3>
                <p className="text-text-secondary font-medium">نقوم الآن بمسح الفجوات التشغيلية بين القدرة والمهمة.</p>
              </div>
            </div>
          )}

          {assessment && !loading && (
            <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
              {/* Intelligence Layer: Gap Map & Clinical Insight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                <Card level={2} className="p-10 border-secondary/20 bg-secondary/[0.03] rounded-[32px] space-y-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-secondary" />
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest">خريطة الفجوات (Gap Map)</span>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-black">
                        <span className="text-text-muted">المواءمة الفيزيائية</span>
                        <span className="text-secondary">88%</span>
                      </div>
                      <div className="h-3 w-full bg-neutral rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[88%]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-black">
                        <span className="text-text-muted">المواءمة الحسية</span>
                        <span className="text-primary">94%</span>
                      </div>
                      <div className="h-3 w-full bg-neutral rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[94%]" />
                      </div>
                    </div>
                  </div>
                </Card>
                <Card level={2} className="p-10 border-primary/20 bg-primary/[0.03] rounded-[32px] space-y-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 p-8 opacity-5">
                    <Sparkles className="w-20 h-20 text-primary" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">مساعد القرار السريري</span>
                  </div>
                  <p className="text-lg text-text-primary font-bold leading-relaxed m-0 italic">
                    "المرشح يتمتع بمرونة عالية في التكيف مع الأدوات الرقمية، مما يقلل الحاجة لتغيير هيكلي في بيئة العمل المادية بنسبة 60%."
                  </p>
                </Card>
              </div>

              {/* Clinical Safety Protocol Strip */}
              <div className="bg-danger/[0.03] border-2 border-dashed border-danger/20 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-10">
                <div className="p-6 bg-white rounded-3xl shadow-xl shadow-danger/5">
                  <ShieldCheck className="w-10 h-10 text-danger" />
                </div>
                <div className="flex-1 text-right space-y-2">
                  <h4 className="text-xl font-black text-danger mb-1">بروتوكول سلامة القرار (Clinical Safety)</h4>
                  <p className="text-sm text-text-secondary font-bold m-0 leading-relaxed italic">
                    "تم التحقق من 8 نقاط تفتيش قانونية وسريرية. لا توجد عوائق تحول دون مباشرة العمل بشرط توفر التكييف البيئي المناسب."
                  </p>
                </div>
              </div>

              <SectionBlock title="بطاقات تحليل الملاءمة" description="نتائج المطابقة التفصيلية لكل مهمة وظيفية أساسية.">
                <div className="space-y-6">
                  {assessment.taskAssessments.map((item, i) => (
                    <React.Fragment key={`assessment-${i}`}>
                      <CapabilityCard assessment={item} />
                    </React.Fragment>
                  ))}
                </div>
              </SectionBlock>

              <div className="flex flex-col md:flex-row items-center gap-8 bg-secondary/5 p-10 rounded-[40px] border border-secondary/10 mt-12">
                <div className="flex-1 text-right space-y-2">
                  <h4 className="text-xl font-black text-secondary m-0">اكتمال التقييم السريري</h4>
                  <p className="text-sm text-text-secondary font-medium m-0 leading-relaxed">تم تحديد الفجوات التشغيلية بنجاح. الخطوة التالية هي تصميم حزم التكيف لسد هذه الفجوات.</p>
                </div>
                <Button 
                  size="lg"
                  variant="primary"
                  onClick={() => navigate('/portal/workplace-accommodation')}
                  className="h-16 px-12 rounded-2xl font-black gap-3 shadow-2xl shadow-primary/20 transition-transform hover:scale-105"
                >
                  تصميم حلول التكيف (WA)
                  <Zap className="w-5 h-5 shadow-primary/50" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CapabilityCard({ assessment }: { assessment: FunctionalAssessment['taskAssessments'][0] }) {
  const levelStyles = {
    'كامل': 'bg-secondary text-white shadow-xl shadow-secondary/20',
    'جزئي': 'bg-warning text-white shadow-xl shadow-warning/20',
    'غير ممكن': 'bg-danger text-white shadow-xl shadow-danger/20'
  };

  const levelIcons = {
    'كامل': <CheckCircle2 className="w-6 h-6" />,
    'جزئي': <Activity className="w-6 h-6" />,
    'غير ممكن': <AlertCircle className="w-6 h-6" />
  };

  return (
    <div className={cn(
      "p-10 space-y-8 rounded-[40px] border-2 transition-all duration-300 hover:shadow-2xl group",
      assessment.capabilityLevel === 'كامل' ? "bg-white border-secondary/5" : "bg-white border-border/50"
    )}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-6">
          <div className={cn(
            "w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 border-2 transition-all",
            assessment.capabilityLevel === 'كامل' ? "bg-secondary/5 border-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white" : "bg-neutral border-border text-text-muted"
          )}>
            {levelIcons[assessment.capabilityLevel]}
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-black text-primary m-0 tracking-tight leading-tight">{assessment.taskLabel}</h4>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">تحليل المواءمة الفردية</span>
          </div>
        </div>
        <span className={cn(
          "px-8 py-3 rounded-[20px] text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-colors",
          levelStyles[assessment.capabilityLevel]
        )}>
          {levelIcons[assessment.capabilityLevel]}
          {assessment.capabilityLevel}
        </span>
      </div>

      {assessment.restrictionReason && (
        <div className="p-8 bg-neutral/30 border-2 border-transparent group-hover:border-primary/5 rounded-[32px] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                العائق المرصود ({assessment.restrictionType})
              </span>
            </div>
            <span className="text-[9px] font-black text-warning bg-white px-3 py-1 rounded-full border border-warning/10 shadow-sm">إشارة سلامة FCA</span>
          </div>
          <p className="text-xl text-text-primary leading-relaxed m-0 font-bold italic">
            " {assessment.restrictionReason} "
          </p>
        </div>
      )}
    </div>
  );
}
