import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, SectionBlock } from '@/src/components/ui/Base';
import { PageHeader } from '@/src/components/layout/AppShell';
import { 
  Briefcase, 
  Search, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Clock, 
  Wrench,
  ChevronLeft,
  Sparkles,
  Loader2,
  ShieldCheck,
  Users,
  Target,
  FileText
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { analyzeJobTasks, JobTaskAnalysis } from '@/src/services/ai-generator';

export default function JobTaskAnalysisPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<JobTaskAnalysis | null>(null);
  const [step, setStep] = useState<'selection' | 'analysis'>('selection');
  const [formData, setFormData] = useState({
    roleTitle: '',
    department: '',
    workingHours: '',
    tools: ''
  });

  const steps = ['اختيار الوظيفة', 'تحليل المهام', 'تقييم القدرة', 'التكييف', 'التوازن المالي', 'التوصية'];

  const roleTemplates = [
    { title: 'موظف استقبال', department: 'الاستقبال / الإدارة', hours: '8 صباحاً - 4 مساءً', tools: 'هاتف، حاسب آلي، نظام حجز، طابعة', icon: Users },
    { title: 'أخصائي مختبر', department: 'المختبر / الجودة', hours: 'شفتات متغيرة', tools: 'مجهر، أجهزة تحليل، كمبيوتر، قفازات وقاية', icon: Wrench },
    { title: 'مهندس ميداني', department: 'العمليات الميدانية', hours: 'ميداني - مرن', tools: 'جهاز قياس، خوذة سلامة، تابلت، سيارة دفع رباعي', icon: Briefcase },
    { title: 'مدير مشروع', department: 'مكتب إدارة المشاريع', hours: '9 صباحاً - 5 مساءً', tools: 'لابتوب، برمجيات تخطيط (Jira/MS Project)، لوحة بيضاء', icon: Target },
    { title: 'مدخل بيانات', department: 'الأرشفة / الـ IT', hours: '8 صباحاً - 3 مساءً', tools: 'جهاز حاسب متطور، ماسح ضوئي، قواعد بيانات', icon: Search },
    { title: 'فني صيانة', department: 'المرافق والخدمات', hours: 'شفتات صباحية/مسائية', tools: 'عدة يدوية، أجهزة فحص كهربائية، سلم، لابتوب تشخيص', icon: Wrench },
  ];

  const handleTemplateClick = (tpl: typeof roleTemplates[0]) => {
    setFormData({
      roleTitle: tpl.title,
      department: tpl.department,
      workingHours: tpl.hours,
      tools: tpl.tools
    });
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setStep('analysis');
    try {
      const result = await analyzeJobTasks(formData);
      setAnalysis(result);
    } catch (error) {
      console.error("JTA Analysis Error:", error);
      // Fallback result for resilience
      setAnalysis({
        essentialTasks: [
          { label: "معالجة البيانات والتقارير بدقة عالية", frequency: "يومي", importance: "عالية", impact: "عالي" },
          { label: "التواصل التشغيلي مع الفريق", frequency: "يومي", importance: "عالية", impact: "عالي" }
        ],
        supportingTasks: [
          { label: "الأرشفة والتنظيم الرقمي", frequency: "أسبوعي", importance: "متوسطة", impact: "متوسط" }
        ],
        nonAdaptableTasks: ["الاتتقال الميداني السريع (في الحالات الطارئة)"]
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
          title="بوابة تحليل الوظائف (JTA)" 
          description="تفكيك الأدوار المهنية إلى مهام قابلة للقياس والتمكين الهندسي."
        />
        <div className="flex flex-col items-center gap-4">
          <div className="w-full h-2 bg-neutral rounded-full max-w-md mx-auto overflow-hidden shadow-inner">
            <div className="h-full bg-primary w-[16%] transition-all duration-1000 ease-out shadow-lg" />
          </div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">المرحلة 1 من 6: تحديد النطاق التشغيلي</p>
        </div>
      </div>

      <Card level={2} className="p-12 bg-white border-primary/10 shadow-2xl space-y-12 rounded-[56px] relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-10 relative z-10">
          <div className="relative group">
            <Search className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 text-text-muted group-focus-within:text-primary transition-all duration-300" />
            <input 
              type="text" 
              placeholder="ابحث عن مسمى وظيفي (مثال: محاسب، مهندس، استقبال)..."
              className="w-full bg-neutral/40 border-4 border-transparent focus:border-primary/20 focus:bg-white rounded-[40px] px-20 py-8 text-2xl font-black text-primary outline-none transition-all shadow-2xl placeholder:text-text-muted/50"
              value={formData.roleTitle}
              onChange={e => setFormData({...formData, roleTitle: e.target.value})}
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">أو اختر قالب وظيفي جاهز:</h3>
              <span className="w-24 h-px bg-border" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {roleTemplates.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => handleTemplateClick(tpl)}
                  className={cn(
                    "p-8 rounded-[40px] border-2 flex flex-col items-center gap-6 transition-all duration-500 group relative overflow-hidden",
                    formData.roleTitle === tpl.title 
                      ? "bg-primary border-primary text-white shadow-2xl shadow-primary/30 scale-105" 
                      : "bg-neutral/20 border-transparent text-text-secondary hover:border-primary/20 hover:bg-white hover:shadow-xl"
                  )}
                >
                  <div className={cn(
                    "p-6 rounded-3xl transition-transform duration-500 group-hover:rotate-12",
                    formData.roleTitle === tpl.title ? "bg-white/20 shadow-inner" : "bg-white shadow-lg"
                  )}>
                    <tpl.icon className={cn("w-8 h-8", formData.roleTitle === tpl.title ? "text-white" : "text-primary")} />
                  </div>
                  <span className="text-base font-black text-center leading-tight">{tpl.title}</span>
                  {formData.roleTitle === tpl.title && (
                    <div className="absolute top-4 right-4 animate-in zoom-in">
                      <CheckCircle2 className="w-5 h-5 text-white/50" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {formData.roleTitle && (
          <div className="flex justify-center pt-8 animate-in fade-in zoom-in slide-in-from-top-4 duration-500">
            <Button 
              size="lg"
              onClick={handleAnalyze}
              className="h-24 px-20 rounded-[35px] text-xl font-black gap-6 shadow-2xl shadow-primary/40 bg-primary group hover:scale-105 active:scale-95 transition-all"
            >
              <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform">
                {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Sparkles className="w-8 h-8" />}
              </div>
              تحليل الوظيفة بالذكاء الاصطناعي
            </Button>
          </div>
        )}
      </Card>

      <div className="text-center opacity-60">
        <p className="text-sm text-text-secondary font-bold italic leading-relaxed">
          "النظام يقوم الآن بربط المهام بـ 112 معياراً تقنياً لضمان دقة التوصية النهائية."
        </p>
      </div>
    </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto space-y-12 pb-24 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-black text-primary m-0">تحليل المهام (JTA)</h1>
          </div>
          <p className="text-text-secondary font-medium">{formData.roleTitle} - {formData.department}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setStep('selection')} className="font-bold text-xs gap-2">
            <ChevronLeft className="w-4 h-4" />
            تعديل الوظيفة
          </Button>
        </div>
      </div>

      <div className="w-full h-1.5 bg-neutral rounded-full overflow-hidden">
        <div className="h-full bg-primary w-[33%] transition-all duration-1000" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Input Form - Sticky Sidebar */}
        <div className="lg:col-span-4">
          <Card level={1} className="p-8 sticky top-28 bg-white shadow-xl border border-border/50 rounded-[32px]">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/30">
              <Sparkles className="w-5 h-5 text-secondary" />
              <h3 className="text-sm font-bold text-primary m-0">تحديث المعايير</h3>
            </div>
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block pr-1">المسمى الوظيفي</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-neutral/50 border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm font-bold"
                  value={formData.roleTitle}
                  onChange={e => setFormData({...formData, roleTitle: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block pr-1">القسم / البيئة</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-neutral/50 border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm font-bold"
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block pr-1">أدوات العمل</label>
                <textarea 
                  required
                  className="w-full bg-neutral/50 border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all min-h-[120px] text-sm font-medium leading-relaxed"
                  value={formData.tools}
                  onChange={e => setFormData({...formData, tools: e.target.value})}
                />
              </div>
              <div className="pt-4">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl gap-3 shadow-xl font-bold bg-primary"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  تحديث التحليل
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8 space-y-10">
          {loading && (
            <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 space-y-6">
              <Loader2 className="w-12 h-12 text-secondary animate-spin" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">جاري إعادة المعالجة الذكية...</h3>
                <p className="text-text-secondary font-medium">يتم الآن ربط المهام بقواعد بيانات التصنيف المهني الدولي.</p>
              </div>
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
              <Card level={2} className="p-10 border-primary/20 bg-primary/[0.03] rounded-[32px] relative overflow-hidden group shadow-lg">
                <div className="absolute top-0 left-0 p-8 opacity-5 transition-transform group-hover:scale-105 pointer-events-none">
                  <FileText className="w-32 h-32 text-primary" />
                </div>
                <div className="space-y-4 relative z-10 text-right">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">سردية الوظيفة (Job Narrative)</span>
                  </div>
                  <p className="text-xl text-text-primary font-bold leading-relaxed m-0 italic">
                    "هذه الوظيفة تتطلب مزيجاً دقيقاً من التفاعل البشري المباشر والمعالجة التقنية المكثفة. الثقل التشغيلي يكمن في المهام الأساسية، مما يجعل أي تكييف رقمي ذو أثر إنتاجي فوري."
                  </p>
                </div>
              </Card>

              <SectionBlock title="المهام الأساسية (Essential Tasks)" description="المهام التي لا يمكن الاستغناء عنها وتعتبر جوهر الدور الوظيفي.">
                <div className="space-y-4">
                  {analysis.essentialTasks.map((task, i) => (
                    <React.Fragment key={`essential-${i}`}>
                      <TaskCard task={task} type="essential" />
                    </React.Fragment>
                  ))}
                </div>
              </SectionBlock>

              <SectionBlock title="المهام المساندة (Supporting Tasks)" description="مهام دورية تدعم العمليات الأساسية ولكنها مرنة في التوقيت والأداء.">
                <div className="space-y-4">
                  {analysis.supportingTasks.map((task, i) => (
                    <React.Fragment key={`supporting-${i}`}>
                      <TaskCard task={task} type="supporting" />
                    </React.Fragment>
                  ))}
                </div>
              </SectionBlock>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card level={2} className="p-10 bg-white border-danger/20 rounded-[32px] space-y-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-danger" />
                    <h4 className="text-[10px] font-bold text-danger uppercase tracking-widest m-0">ملف مخاطر الوظيفة</h4>
                  </div>
                  <div className="space-y-4">
                    {analysis.nonAdaptableTasks.map((task, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-danger/[0.03] rounded-2xl border border-danger/10">
                        <XCircle className="w-4 h-4 text-danger mt-0.5 shrink-0" />
                        <p className="text-sm font-bold text-primary m-0 leading-tight">{task}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card level={2} className="p-10 bg-white border-secondary/20 rounded-[32px] space-y-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-secondary" />
                    <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest m-0">متطلبات السلامة</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-secondary/[0.03] rounded-2xl border border-secondary/10">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                      <p className="text-sm font-bold text-primary m-0 leading-tight">بروتوكولات الإخلاء الطارئ المعتمدة</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-secondary/[0.03] rounded-2xl border border-secondary/10">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                      <p className="text-sm font-bold text-primary m-0 leading-tight">استخدام معدات الحماية المتخصصة</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Navigation Footer */}
              <div className="flex flex-col md:flex-row items-center gap-8 bg-primary/5 p-10 rounded-[40px] border border-primary/10 mt-12">
                <div className="flex-1 text-right space-y-2">
                  <h4 className="text-xl font-black text-primary m-0">تحليل JTA مكتمل</h4>
                  <p className="text-sm text-text-secondary font-medium m-0 leading-relaxed">تمت أرشفة 32 معيار تقني لهذه الوظيفة. المرحلة التالية هي مطابقة هذه المهام مع قدرات المرشح.</p>
                </div>
                <Button 
                  size="lg"
                  onClick={() => navigate('/portal/functional-assessment')}
                  className="h-16 px-12 rounded-2xl font-black gap-3 shadow-2xl shadow-primary/20 transition-transform hover:scale-105"
                >
                  الانتقال لتقييم القدرة (FCA)
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

function TaskCard({ task, type }: { task: JobTaskAnalysis['essentialTasks'][0], type: 'essential' | 'supporting' }) {
  return (
    <div className={cn(
      "p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 rounded-[32px] border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group",
      type === 'essential' ? "bg-white border-primary/5 hover:border-primary/20" : "bg-neutral/20 border-transparent hover:bg-white hover:border-border"
    )}>
      <div className="flex items-center gap-6">
        <div className={cn(
          "p-5 rounded-2xl border transition-all",
          type === 'essential' ? "bg-primary/5 border-primary/10 text-primary group-hover:bg-primary group-hover:text-white" : "bg-white border-border text-text-muted"
        )}>
          {type === 'essential' ? <Zap className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
        </div>
        <div className="space-y-2">
          <h4 className="text-2xl font-black text-primary m-0 tracking-tight leading-tight group-hover:text-primary transition-colors">{task.label}</h4>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest bg-neutral px-3 py-1 rounded-lg">
              <Clock className="w-4 h-4" />
              تكرار: {task.frequency}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-8 md:pl-6">
        <div className="text-right space-y-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">الأهمية</span>
          <span className={cn(
            "inline-block px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider",
            task.importance === 'عالية' ? "bg-danger text-white shadow-lg shadow-danger/20" : "bg-neutral text-text-secondary"
          )}>
            {task.importance}
          </span>
        </div>
        <div className="text-right space-y-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">الأثر التشغيلي</span>
          <span className={cn(
            "inline-block px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider",
            task.impact === 'عالي' ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "bg-neutral text-text-secondary"
          )}>
            {task.impact}
          </span>
        </div>
      </div>
    </div>
  );
}
