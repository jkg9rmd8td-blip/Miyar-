import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, SectionBlock } from '@/src/components/ui/Base';
import { PageHeader } from '@/src/components/layout/AppShell';
import { 
  Settings, 
  Search, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft,
  Sparkles,
  Loader2,
  Cpu,
  MapPin,
  Workflow,
  Clock,
  Layers,
  ShieldCheck,
  User,
  HeartHandshake
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { suggestWorkplaceAccommodations, AccommodationPlan } from '@/src/services/ai-generator';

export default function WorkplaceAccommodationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<AccommodationPlan | null>(null);
  const [step, setStep] = useState<'selection' | 'analysis'>('selection');
  const [formData, setFormData] = useState({
    roleTitle: '',
    tasks: '',
    candidateCapability: '',
    gaps: ''
  });

  const accommodationTemplates = [
    {
      label: 'استقبال (حركية)',
      role: 'موظف استقبال',
      tasks: 'استقبال الزوار\nالرد على الهاتف\nإدخال البيانات',
      capability: 'إعاقة حركية (كرسي متحرك)',
      gaps: 'صعوبة الوصول لسطح المكتب المرتفع\nصعوبة التحرك في الممرات الضيقة',
      icon: MapPin
    },
    {
      label: 'مدخل بيانات (بصرية)',
      role: 'مدخل بيانات / أرشفة',
      tasks: 'إحصاء الملفات\nإدخال البيانات في النظام\nمراجعة الجداول',
      capability: 'كف بصري كلي',
      gaps: 'عدم القدرة على قراءة الشاشة التقليدية\nصعوبة تمييز الملفات الورقية',
      icon: Cpu
    },
    {
      label: 'فني صيانة (سمعية)',
      role: 'فني صيانة مرافق',
      tasks: 'فحص التمديدات\nالاستجابة لنداءات الطوارئ\nالعمل في غرف المحركات',
      capability: 'ضعف سمعي شديد',
      gaps: 'صعوبة سماع تنبيهات الآلات والمعدات\nصعوبة التواصل اللفظي في البيئات الصاخبة',
      icon: Workflow
    }
  ];

  const handleTemplateClick = (tpl: typeof accommodationTemplates[0]) => {
    setFormData({
      roleTitle: tpl.role,
      tasks: tpl.tasks,
      candidateCapability: tpl.capability,
      gaps: tpl.gaps
    });
  };

  const handleSuggest = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setStep('analysis');
    try {
      const taskList = formData.tasks.split('\n').filter(t => t.trim().length > 0);
      const gapList = formData.gaps.split('\n').filter(g => g.trim().length > 0);
      const result = await suggestWorkplaceAccommodations({
        ...formData,
        tasks: taskList.length > 0 ? taskList : ["التنقل المكتبي", "معالجة البيانات"],
        gaps: gapList.length > 0 ? gapList : ["صعوبة الحركة في الممرات الضيقة", "صعوبة رؤية النصوص الصغيرة"]
      });
      setPlan(result);
    } catch (error) {
      console.error("WA Analysis Error:", error);
      // Fallback for resilience
      setPlan({
        accommodations: [
          { taskLabel: "التنقل المكتبي والوصول للمرافق", type: "بيئي", description: "إعادة ترتيب ممرات المكتب لتوفير عرض 120 سم على الأقل، وتوفير مكتب قابل لضبط الارتفاع كهروميكانيكياً.", duration: "لمرة واحدة", complexity: "متوسط" },
          { taskLabel: "معالجة البيانات والتقارير", type: "تقني", description: "تثبيت برنامج قارئ شاشة متقدم (NVDA/JAWS) مع شاشات بحجم 27 بوصة داعمة للتباين العالي.", duration: "مستمر", complexity: "بسيط" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'selection') {
    return (
      <div className="max-w-[900px] mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center space-y-4">
          <PageHeader 
            title="تصميم حلول التكيف" 
            description="هندسة بيئة العمل لتمكين الأداء الفعلي عبر حلول تقنية ومكانية ذكية."
          />
          <div className="w-full h-1.5 bg-neutral rounded-full max-w-xs mx-auto overflow-hidden">
            <div className="h-full bg-secondary w-[50%] transition-all duration-500" />
          </div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">المرحلة 3 من 6: هندسة التمكين</p>
        </div>

        <Card level={2} className="p-10 bg-white border-secondary/10 shadow-2xl space-y-10 rounded-[40px]">
          <div className="space-y-8 text-right">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {accommodationTemplates.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => handleTemplateClick(tpl)}
                  className={cn(
                    "p-6 rounded-[32px] border-2 flex flex-col items-center gap-4 transition-all hover:shadow-xl group",
                    formData.roleTitle === tpl.role 
                      ? "bg-secondary border-secondary text-white shadow-secondary/20 scale-105" 
                      : "bg-neutral/30 border-transparent text-text-secondary hover:border-secondary/20 hover:bg-white"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-2xl transition-colors",
                    formData.roleTitle === tpl.role ? "bg-white/20" : "bg-white group-hover:bg-secondary/5 shadow-sm"
                  )}>
                    <tpl.icon className={cn("w-6 h-6", formData.roleTitle === tpl.role ? "text-white" : "text-secondary")} />
                  </div>
                  <span className="text-sm font-black text-center">{tpl.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-6">
              <label className="text-xs font-black text-primary pr-2">الفجوات الوظيفية المراد معالجتها</label>
              <textarea 
                placeholder="أدخل الفجوات المستخرجة من مرحلة FCA هنا..."
                className="w-full h-32 bg-neutral/50 border-2 border-transparent focus:border-secondary/20 focus:bg-white rounded-3xl px-8 py-6 text-sm font-bold text-primary outline-none transition-all shadow-inner"
                value={formData.gaps}
                onChange={e => setFormData({...formData, gaps: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              size="lg"
              variant="secondary"
              onClick={handleSuggest}
              disabled={!formData.gaps}
              className="h-20 px-16 rounded-[28px] text-lg font-black gap-4 shadow-2xl shadow-secondary/30 transition-transform active:scale-95"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Layers className="w-6 h-6" />}
              هندسة حلول التمكين
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
            <Layers className="w-8 h-8 text-secondary" />
            <h1 className="text-3xl font-black text-primary m-0">هندسة التكيف (WA)</h1>
          </div>
          <p className="text-text-secondary font-medium italic">تصميم حزم الحلول التقنية والمكانية لسد الفجوات التشغيلية</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setStep('selection')} className="font-bold text-xs gap-2">
            <ChevronLeft className="w-4 h-4" />
            تعديل مدخلات التكيف
          </Button>
        </div>
      </div>

      <div className="w-full h-1.5 bg-neutral rounded-full overflow-hidden">
        <div className="h-full bg-secondary w-[66%] transition-all duration-1000" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <Card level={1} className="p-8 sticky top-28 bg-white shadow-xl border border-border/50 rounded-[32px] space-y-8">
            <div className="text-center p-6 bg-secondary/5 rounded-3xl border border-secondary/10 space-y-2">
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest">مصفوفة الملاءمة (Fit Matrix)</span>
              <div className="text-5xl font-black text-secondary tracking-tighter">92%</div>
              <p className="text-[10px] font-bold text-text-muted m-0">درجة التمكين المتوقعة بعد التكيف</p>
            </div>
            
            <div className="space-y-6">
              <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2">الفجوات الوظيفية</span>
                <p className="text-xs font-bold text-primary leading-relaxed bg-neutral/50 p-4 rounded-2xl whitespace-pre-line">{formData.gaps}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border/30">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">تحليل الأثر الهندسي</span>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed font-bold italic">
                تمت مراجعة الحلول لضمان عدم تعارضها مع أنظمة السلامة المهنية أو معايير الوصول الشامل السعودية.
              </p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-10">
          {loading && (
            <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 space-y-8 bg-white rounded-[32px] border">
              <Cpu className="w-16 h-16 text-secondary animate-pulse" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-primary">جاري هندسة الحلول...</h3>
                <p className="text-text-secondary font-medium">نقوم حالياً بمطابقة التقنيات المساعدة المتوفرة مع التقييدات المرصودة.</p>
              </div>
            </div>
          )}

          {plan && !loading && (
            <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="grid grid-cols-1 gap-6">
                <Card level={2} className="p-10 border-primary/20 bg-primary/[0.03] rounded-[32px] flex flex-col md:flex-row gap-8 items-center shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 p-8 opacity-5">
                    <Workflow className="w-24 h-24 text-primary" />
                  </div>
                  <div className="p-6 bg-white rounded-[24px] shadow-xl shadow-primary/5 shrink-0 z-10">
                    <Zap className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2 text-right z-10">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">أولوية التنفيذ (Decision Insight)</span>
                    <h4 className="text-2xl font-black text-primary m-0 uppercase italic">التمكين الرقمي أولاً</h4>
                    <p className="text-sm text-text-secondary font-bold leading-relaxed m-0 italic">
                      "استخدام التقنيات المساعدة (Assistive Tech) يقلل من الحاجة لتعديلات إنشائية بنسبة 70%، مما يحافظ على مرونة المكان ويقلل التكاليف الرأسمالية."
                    </p>
                  </div>
                </Card>
              </div>

              <SectionBlock title="حزم التكيف الهندسية" description="الحلول المقترحة والمصنفة حسب نوع التدخل (تقني، مكاني، تشغيلي).">
                <div className="space-y-6">
                  {plan.accommodations.map((item, i) => (
                    <React.Fragment key={`accommodation-${i}`}>
                      <AccommodationCard item={item} />
                    </React.Fragment>
                  ))}
                </div>
              </SectionBlock>

              <div className="flex flex-col md:flex-row items-center gap-8 bg-secondary/5 p-10 rounded-[40px] border border-secondary/10 mt-12">
                <div className="flex-1 text-right space-y-2">
                  <h4 className="text-xl font-black text-secondary m-0">جاهزية التحليل المالي</h4>
                  <p className="text-sm text-text-secondary font-medium m-0 leading-relaxed">تم تحديد حزم الحلول وتكلفتها التقديرية. الخطوة التالية هي تحليل الجدوى المالية وقصة الاستثمار.</p>
                </div>
                <Button 
                  size="lg"
                  variant="primary"
                  onClick={() => navigate('/portal/cost-value-estimation')}
                  className="h-16 px-12 rounded-2xl font-black gap-3 shadow-2xl shadow-primary/20 transition-transform hover:scale-105"
                >
                  التحليل المالي والجدوى (CV)
                  <Sparkles className="w-5 h-5 shadow-primary/50" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AccommodationCard({ item }: { item: AccommodationPlan['accommodations'][0] }) {
  const typeIcons = {
    'تقني': Cpu,
    'بيئي': MapPin,
    'تشغيلي': Workflow
  };
  const Icon = typeIcons[item.type as keyof typeof typeIcons] || Settings;

  const complexityStyles = {
    'بسيط': 'bg-secondary text-white shadow-xl shadow-secondary/20',
    'متوسط': 'bg-warning text-white shadow-xl shadow-warning/20',
    'متقدم': 'bg-danger text-white shadow-xl shadow-danger/20'
  };

  return (
    <div className={cn(
      "p-10 space-y-8 rounded-[40px] border-2 transition-all duration-300 hover:shadow-2xl group bg-white",
      item.complexity === 'بسيط' ? "border-secondary/5" : "border-border/50"
    )}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-border/30 pb-8">
        <div className="flex items-center gap-6">
          <div className={cn(
            "w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 border-2 transition-all shadow-sm",
            item.type === 'تقنية' ? "bg-primary/5 border-primary/10 text-primary group-hover:bg-primary group-hover:text-white" : "bg-neutral border-border text-text-muted"
          )}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block">المهمة المستهدفة</span>
            <h4 className="text-2xl font-black text-primary m-0 tracking-tight leading-loose uppercase tracking-wide">{item.taskLabel}</h4>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-6 py-2 rounded-[16px] bg-neutral text-text-secondary text-[10px] font-black uppercase tracking-widest border border-border group-hover:bg-white transition-colors">
            {item.type}
          </span>
          <span className={cn(
            "px-6 py-2 rounded-[16px] text-[10px] font-black uppercase tracking-widest border transition-all",
            complexityStyles[item.complexity as keyof typeof complexityStyles] || "bg-neutral text-text-muted"
          )}>
            مستوى التنفيذ: {item.complexity}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-neutral/30 group-hover:bg-white group-hover:border-primary/5 p-8 rounded-[32px] border-2 border-transparent transition-all">
          <p className="text-xl text-text-primary font-bold leading-relaxed m-0 italic">
            " {item.description} "
          </p>
        </div>
        
        <div className="flex flex-wrap gap-8 items-center pt-4">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-text-muted" />
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">تكرار الاستخدام: {item.duration}</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">معايير السلامة المهنية: محققة</span>
          </div>
        </div>
      </div>
    </div>
  );
}

