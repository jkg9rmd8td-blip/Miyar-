import React, { useState, useEffect } from 'react';
import { useAssessment } from '@/src/store/AssessmentContext';
import { Card, Button, SectionBlock } from '@/src/components/ui/Base';
import { 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  Search,
  Filter,
  Calendar,
  Bell,
  Zap,
  Activity,
  ShieldAlert,
  Coins,
  FileText,
  BarChart3,
  Clock,
  LayoutGrid,
  Info,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';
import { generateExecutiveNarrative, ExecutiveNarrative } from '@/src/services/ai-generator';

export default function DecisionCenter() {
  const navigate = useNavigate();
  const [narrative, setNarrative] = useState<ExecutiveNarrative | null>(null);
  const [loadingNarrative, setLoadingNarrative] = useState(false);

  // Core KPIs reflecting Quality & Performance
  const coreKpis = [
    { label: 'التقييمات المكتملة', value: '412', change: '+15%', icon: CheckCircle2, status: 'success' },
    { rate: '78%', label: 'نسبة الجاهزية (Readiness)', change: '+3%', icon: TrendingUp, status: 'success' },
    { label: 'حالات تطلب تكييف هندسي', value: '64%', change: '+5%', icon: Zap, status: 'info' },
    { label: 'متوسط تكلفة التمكين', value: '4,280 ريال', change: '+2%', icon: Coins, status: 'info' },
    { label: 'إنذارات السلامة FCA', value: '4 حذرة', change: '-12%', icon: ShieldAlert, status: 'danger' },
    { label: 'وقت المعالجة (E2E)', value: '2.4 يوم', change: '-8%', icon: Clock, status: 'warning' },
  ];

  useEffect(() => {
    async function loadNarrative() {
      setLoadingNarrative(true);
      try {
        const res = await generateExecutiveNarrative(coreKpis);
        setNarrative(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingNarrative(false);
      }
    }
    loadNarrative();
  }, []);

  return (
    <div className="max-w-[1500px] mx-auto space-y-12 pb-24 animate-in fade-in">
      {/* 1. Header & AI Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4 text-right">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-black text-primary m-0 tracking-tighter italic uppercase">{narrative?.title || 'لوحة القيادة التنفيذية (E-BOARD)'}</h1>
          </div>
          <div className="min-h-[3rem] flex items-center">
            {loadingNarrative ? (
              <div className="flex items-center gap-3 text-primary animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-bold italic">جاري توليد الرؤية التنفيذية (IEA)...</span>
              </div>
            ) : (
              <p className="text-xl text-text-secondary font-medium m-0 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-right-4">
                "{narrative?.summary || 'نبض المنظومة: استقرار ملحوظ في دقة FCA مع الحاجة لتحسين تدفق WA المهنية لتقليل زمن الانتظار.'}"
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="h-16 px-10 rounded-2xl border-2 border-border font-black text-xs gap-3">
            <Bell className="w-5 h-5 text-warning" />
            تنبيهات النظام (4)
          </Button>
          <Button variant="primary" className="h-16 px-10 rounded-2xl font-black text-xs gap-3 shadow-2xl shadow-primary/20 bg-primary">
            تصدير تقرير الربع الثاني
            <FileText className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="w-full h-1 bg-neutral/50 rounded-full overflow-hidden">
        <div className="h-full bg-primary w-[73%] transition-all duration-1000" />
      </div>

      {/* 2. Journey Narrative Path (Horizontal Flow) */}
      <SectionBlock title="المسار التشغيلي المدمج (Journey Flow)" description="تتبع تدفق الحالات عبر وحدات «مِعيار» الخمسة.">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {[
            { id: 'JTA', label: 'تحليل الوظيفة', count: 120, rate: '100%', color: 'from-primary/20' },
            { id: 'FCA', label: 'تقييم القدرة', count: 85, rate: '71%', color: 'from-secondary/20' },
            { id: 'WA', label: 'التكيف الهندسي', count: 64, rate: '75%', color: 'from-warning/20' },
            { id: 'CV', label: 'التوازن المالي', count: 58, rate: '91%', color: 'from-info/20' },
            { id: 'DRG', label: 'التوصية النهائية', count: 58, rate: '100%', color: 'from-primary/20' }
          ].map((step, i) => (
            <div key={i} className="relative group">
              <Card level={2} className={cn(
                "p-8 space-y-6 rounded-[32px] border-2 border-transparent bg-gradient-to-br transition-all hover:shadow-2xl hover:scale-105 cursor-pointer",
                step.color, "to-white hover:border-primary/20"
              )}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{step.id}</span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    {i === 4 ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <ArrowRight className="w-4 h-4 text-text-muted" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-primary m-0 truncate">{step.label}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-primary leading-none italic">{step.count}</span>
                    <span className="text-[10px] font-bold text-text-muted uppercase">حالة</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-black/5 flex justify-between text-[10px] font-bold">
                  <span className="text-text-muted">نسبة العبور</span>
                  <span className="text-secondary">{step.rate}</span>
                </div>
              </Card>
              {i < 4 && (
                <div className="hidden lg:block absolute -left-4 top-1/2 -translate-y-1/2 z-20">
                  <div className="w-8 h-8 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* 3. Core Quality KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {coreKpis.map((kpi, i) => (
          <Card key={i} level={1} className="p-8 space-y-6 rounded-[32px] border-border bg-white transition-all hover:shadow-xl group">
            <div className="flex items-center justify-between">
              <div className={cn(
                "p-3 rounded-2xl border",
                kpi.status === 'success' ? "bg-secondary/5 border-secondary/10 text-secondary" :
                kpi.status === 'danger' ? "bg-danger/5 border-danger/10 text-danger animate-pulse" : "bg-primary/5 border-primary/10 text-primary"
              )}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded-lg border",
                kpi.change?.startsWith('+') ? "text-secondary border-secondary/20" : "text-danger border-danger/20"
              )}>
                {kpi.change}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{kpi.label}</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-black text-primary tracking-tighter truncate">{kpi.value || kpi.rate}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 4. Deep Intelligence Layer (Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Insights Card */}
        <Card level={2} className="lg:col-span-8 p-12 bg-white border-primary/10 shadow-2xl rounded-[48px] space-y-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <BarChart3 className="w-96 h-96 text-primary" />
          </div>
          <div className="flex items-center justify-between z-10 relative">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary rounded-2xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-primary m-0">تحليل الطبقة التفسيرية (Narrative Insight)</h3>
              </div>
              <p className="text-sm text-text-muted font-bold italic pr-12">"ماذا تقول لنا الأرقام عن كفاءة المنظومة اليوم؟"</p>
            </div>
            <Button variant="ghost" className="text-xs font-black text-text-muted border border-border px-8 rounded-full">استعراض المصادر</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 z-10 relative">
            <div className="space-y-8 bg-neutral/30 p-10 rounded-[40px] border border-transparent hover:border-primary/10 transition-all">
              <h4 className="text-xl font-black text-primary m-0 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-secondary" />
                أثر التكييف الاستباقي
              </h4>
              <p className="text-lg text-text-primary leading-relaxed font-bold italic">
                - دقة FCA تمنع 42% من مخاطر التعارض المهني.<br />
                - وحدة WA الهندسي توفر 1.2M ريال سنوياً عبر تحسين الاختيار الرقمي للأجهزة.<br />
                - زمن المعالجة تحسن بنسبة 14.2% بعد دمج بروتوكول CV الجديد.
              </p>
            </div>
            <div className="space-y-8 bg-danger/[0.02] p-10 rounded-[40px] border border-danger/10 group/item hover:bg-danger/5 transition-all">
              <h4 className="text-xl font-black text-danger m-0 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5" />
                إنذارات الأداء الحرجة
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'تأخر استجابة FCA', val: '4 حالات حرجة', color: 'text-danger' },
                  { label: 'تجاوز ميزانية CV', val: '6.2% في القطاع ج', color: 'text-warning' },
                  { label: 'وقت انتظار WA', val: '1.8 يوم إضافي', color: 'text-info' }
                ].map((risk, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-danger/5 pb-4">
                    <span className="text-sm font-bold text-text-muted">{risk.label}</span>
                    <span className={cn("text-xs font-black", risk.color)}>{risk.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Small Analytics Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card level={1} className="p-10 bg-primary shadow-2xl shadow-primary/20 rounded-[48px] text-white space-y-10">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">معدل العائد الاستثماري (ROI)</span>
              <div className="text-6xl font-black tracking-tighter italic leading-none">{narrative?.roi || '2.8x'}</div>
              <p className="text-sm font-bold text-white/70 italic m-0">"كل ريال يُستثمر في التمكين يعيد {narrative?.roi || '2.8 ريال'} من القيمة الإنتاجية خلال 12 شهر."</p>
            </div>
            <div className="space-y-4">
              <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[85%]" />
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/50">
                <span>المعدل الحالي</span>
                <span>المستهدف (3.1x)</span>
              </div>
            </div>
          </Card>

          <Card level={1} className="p-10 bg-white border border-border shadow-xl rounded-[40px] space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <h4 className="text-sm font-black text-primary m-0 uppercase tracking-wide">جودة البيانات (DQ Score)</h4>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-black text-primary italic">{narrative?.dataQualityScore || '94.8'}%</div>
              <p className="text-xs text-text-muted font-bold leading-relaxed m-0 italic">
                دقة عالية جداً في مطابقة بيانات JTA/FCA. (تحسن بنسبة 4% عن الشهر الماضي).
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
