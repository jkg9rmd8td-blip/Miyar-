import React from 'react';
import { Card, Button, StatusBadge } from '@/src/components/ui/Base';
import { 
  ShieldCheck, 
  AlertCircle, 
  TrendingDown, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Info,
  ChevronLeft,
  Zap,
  Shield,
  FileText,
  Activity,
  DollarSign,
  Clock,
  User,
  Briefcase,
  Settings,
  History,
  Printer,
  Share2,
  FileDown
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ScoreResult } from '@/src/lib/scoring/scoring-types';

// 1. REPORT HEADER
export const ExecutiveReportHeader = ({ 
  candidateName, 
  stage, 
  updatedAt, 
  owner, 
  source 
}: { 
  candidateName: string, 
  stage: string, 
  updatedAt: string, 
  owner: string, 
  source: string 
}) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/30 pb-10">
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-text-muted">
        <FileText className="w-5 h-5" />
        <span className="text-sm font-bold uppercase tracking-widest">وثيقة رسمية</span>
      </div>
      <h1 className="text-4xl font-black text-text-primary tracking-tight">التقرير التنفيذي للجاهزية</h1>
      <p className="text-lg text-text-secondary font-medium max-w-2xl leading-relaxed">
        قراءة تنفيذية موحدة للحالة تدعم المراجعة واتخاذ القرار بناءً على معايير الجاهزية التشغيلية.
      </p>
    </div>
    
    <div className="grid grid-cols-2 gap-6 bg-surface p-6 rounded-2xl border border-border shadow-subtle min-w-[320px]">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">اسم الحالة</span>
        <span className="text-sm font-bold text-text-primary">{candidateName}</span>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">المرحلة</span>
        <span className="text-sm font-bold text-text-primary">{stage}</span>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">آخر تحديث</span>
        <span className="text-sm font-bold text-text-primary">{updatedAt}</span>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">مالك الحالة</span>
        <span className="text-sm font-bold text-text-primary">{owner}</span>
      </div>
    </div>
  </div>
);

// 2. EXECUTIVE SUMMARY STRIP
export const ExecutiveSummaryStrip = ({ 
  decision, 
  confidence, 
  readiness, 
  financialImpact, 
  topBlocker 
}: { 
  decision: string, 
  confidence: number, 
  readiness: number, 
  financialImpact: number, 
  topBlocker: string 
}) => {
  const getDecisionConfig = () => {
    switch (decision) {
      case 'Approved': return { label: 'جاهز', color: 'text-success', bg: 'bg-success/5', border: 'border-success/20' };
      case 'Conditional': return { label: 'مشروط', color: 'text-warning', bg: 'bg-warning/5', border: 'border-warning/20' };
      case 'Blocked': return { label: 'غير مكتمل', color: 'text-danger', bg: 'bg-danger/5', border: 'border-danger/20' };
      default: return { label: 'قيد المراجعة', color: 'text-text-muted', bg: 'bg-surface', border: 'border-border' };
    }
  };
  const config = getDecisionConfig();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <SummaryCard label="القرار الحالي" value={config.label} icon={Target} color={config.color} bg={config.bg} border={config.border} />
      <SummaryCard label="مستوى الثقة" value={`${confidence}%`} icon={ShieldCheck} />
      <SummaryCard label="الجاهزية" value={`${readiness}%`} icon={Activity} />
      <SummaryCard label="الأثر المالي" value={financialImpact > 60 ? 'مرتفع' : 'منخفض'} icon={DollarSign} color={financialImpact > 60 ? 'text-danger' : 'text-success'} />
      <SummaryCard label="المانع الأعلى" value={topBlocker} icon={AlertCircle} color="text-warning" />
    </div>
  );
};

const SummaryCard = ({ label, value, icon: Icon, color = "text-text-primary", bg = "bg-surface", border = "border-border" }: any) => (
  <Card className={cn("p-5 flex flex-col justify-between h-32 shadow-subtle border", bg, border)}>
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</span>
      <Icon className={cn("w-4 h-4", color)} />
    </div>
    <div className={cn("text-xl font-black tracking-tight", color)}>{value}</div>
  </Card>
);

// 3. EXECUTIVE NARRATIVE CARD
export const ExecutiveNarrativeCard = ({ narrative }: { narrative: string }) => (
  <Card level={1} className="p-10 space-y-6 bg-surface border-border shadow-subtle relative overflow-hidden">
    <div className="absolute top-0 right-0 w-2 h-full bg-text-primary/10"></div>
    <h3 className="text-lg font-black text-text-primary tracking-tight flex items-center gap-3">
      <FileText className="w-5 h-5 text-text-muted" />
      الخلاصة التنفيذية
    </h3>
    <p className="text-xl text-text-secondary leading-relaxed font-bold tracking-tight italic">
      "{narrative}"
    </p>
  </Card>
);

// 4. DECISION DRIVERS PANEL
export const DecisionDriversPanel = ({ 
  supports, 
  limits, 
  changes 
}: { 
  supports: string[], 
  limits: string[], 
  changes: string[] 
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <DriverCard title="ما يدعم القرار" items={supports} icon={CheckCircle2} color="text-success" bg="bg-success/5" />
    <DriverCard title="ما يحد من القرار" items={limits} icon={AlertCircle} color="text-danger" bg="bg-danger/5" />
    <DriverCard title="ما الذي يغير القرار" items={changes} icon={Zap} color="text-warning" bg="bg-warning/5" />
  </div>
);

const DriverCard = ({ title, items, icon: Icon, color, bg }: any) => (
  <Card className={cn("p-8 space-y-6 shadow-subtle border border-border", bg)}>
    <div className="flex items-center gap-3">
      <Icon className={cn("w-5 h-5", color)} />
      <h4 className="text-sm font-black text-text-primary uppercase tracking-widest">{title}</h4>
    </div>
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm font-bold text-text-secondary leading-snug">
          <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", color.replace('text-', 'bg-'))}></div>
          {item}
        </li>
      ))}
    </ul>
  </Card>
);

// 5. DIMENSION SUMMARY CARD
export const DimensionSummaryCard = ({ 
  label, 
  score 
}: { 
  label: string, 
  score: ScoreResult 
}) => {
  const getStatusColor = (label: string) => {
    switch (label) {
      case 'high': return 'bg-success';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-danger';
      default: return 'bg-text-muted';
    }
  };

  return (
    <Card className="p-6 space-y-4 shadow-subtle border border-border bg-surface">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</span>
        <span className="text-lg font-black text-text-primary tracking-tight">{score.value}%</span>
      </div>
      <div className="h-1.5 w-full bg-surface-soft rounded-full overflow-hidden border border-border/50">
        <div 
          className={cn("h-full transition-all duration-1000", getStatusColor(score.label))} 
          style={{ width: `${score.value}%` }} 
        />
      </div>
      <p className="text-xs text-text-secondary font-bold leading-relaxed">{score.explanation}</p>
    </Card>
  );
};

// 6. SIMULATION EVIDENCE CARD
export const SimulationEvidenceCard = ({ 
  type, 
  narrative, 
  signals, 
  impacts 
}: { 
  type: string, 
  narrative: string, 
  signals: string[], 
  impacts: string[] 
}) => (
  <Card level={2} className="p-8 space-y-8 rounded-2xl shadow-subtle bg-surface border border-border">
    <div className="flex items-center justify-between border-b border-border/30 pb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-bg rounded-xl border border-border shadow-subtle">
          <Zap className="w-6 h-6 text-warning fill-warning/20" />
        </div>
        <div className="space-y-1">
          <span className="text-base font-bold text-text-primary tracking-tight">{type}</span>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">دليل سلوكي إضافي</span>
        </div>
      </div>
      <StatusBadge status="success" label="مكتمل" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="space-y-6">
        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">الملخص التفسيري</h4>
        <p className="text-base text-text-secondary leading-relaxed font-bold tracking-tight italic">"{narrative}"</p>
        <div className="flex flex-wrap gap-3">
          {signals.map((signal, idx) => (
            <span key={idx} className="text-[10px] font-bold px-4 py-1.5 bg-bg border border-border rounded-full text-text-muted uppercase tracking-widest shadow-subtle">
              {signal}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">الأثر على القرار</h4>
        <ul className="space-y-3">
          {impacts.map((impact, i) => (
            <li key={i} className="flex items-center gap-3 text-sm font-bold text-text-primary">
              <CheckCircle2 className="w-4 h-4 text-success" />
              {impact}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Card>
);

// 7. FINANCIAL IMPACT CARD
export const FinancialImpactCard = ({ 
  accommodationEffect, 
  delayCost, 
  mismatchRisk, 
  benefit 
}: { 
  accommodationEffect: string, 
  delayCost: string, 
  mismatchRisk: string, 
  benefit: string 
}) => (
  <Card level={2} className="p-8 space-y-8 rounded-2xl shadow-subtle bg-surface border border-border">
    <div className="flex items-center gap-4 border-b border-border/30 pb-6">
      <DollarSign className="w-6 h-6 text-text-primary" />
      <h3 className="text-[10px] font-bold text-text-primary uppercase tracking-widest">الأثر التشغيلي والمالي</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ImpactItem label="أثر التكييف المتوقع" value={accommodationEffect} icon={Settings} />
      <ImpactItem label="تكلفة التأخير" value={delayCost} icon={Clock} />
      <ImpactItem label="أثر عدم التوافق" value={mismatchRisk} icon={AlertCircle} />
      <ImpactItem label="المنفعة المحتملة" value={benefit} icon={TrendingDown} />
    </div>
  </Card>
);

const ImpactItem = ({ label, value, icon: Icon }: any) => (
  <div className="space-y-3 p-4 bg-bg rounded-xl border border-border shadow-subtle">
    <div className="flex items-center gap-2 text-text-muted">
      <Icon className="w-3.5 h-3.5" />
      <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-sm font-bold text-text-primary tracking-tight">{value}</div>
  </div>
);

// 8. EXECUTIVE ACTION LIST
export const ExecutiveActionList = ({ actions }: { actions: { label: string, priority: 'high' | 'medium' | 'low', rationale: string }[] }) => (
  <div className="space-y-4">
    {actions.map((action, i) => (
      <Card key={i} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-subtle border border-border bg-surface hover:border-text-primary/20 transition-all">
        <div className="flex items-center gap-5">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-bg font-black text-xl shadow-subtle",
            action.priority === 'high' ? 'bg-danger' : action.priority === 'medium' ? 'bg-warning' : 'bg-success'
          )}>
            {i + 1}
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-text-primary tracking-tight">{action.label}</h4>
            <p className="text-xs text-text-muted font-medium">{action.rationale}</p>
          </div>
        </div>
        <StatusBadge 
          status={action.priority === 'high' ? 'error' : action.priority === 'medium' ? 'warning' : 'success'} 
          label={action.priority === 'high' ? 'أولوية قصوى' : action.priority === 'medium' ? 'أولوية متوسطة' : 'أولوية عادية'} 
        />
      </Card>
    ))}
  </div>
);

// 9. GOVERNANCE TRACE CARD
export const GovernanceTraceCard = ({ summary }: { summary: string }) => (
  <Card level={3} className="p-8 space-y-6 bg-surface-soft/30 border-dashed border-2 border-border/50 rounded-2xl">
    <div className="flex items-center gap-3">
      <Shield className="w-5 h-5 text-text-muted" />
      <h4 className="text-sm font-black text-text-primary uppercase tracking-widest">قابلية التتبع والمراجعة</h4>
    </div>
    <p className="text-sm text-text-secondary leading-relaxed font-bold tracking-tight">
      {summary}
    </p>
    <div className="flex items-center gap-6 pt-4 border-t border-border/30">
      <TraceBadge label="بيانات معتمدة" />
      <TraceBadge label="خوارزمية شفافة" />
      <TraceBadge label="دفاعية مؤسسية" />
    </div>
  </Card>
);

const TraceBadge = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2">
    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</span>
  </div>
);

// 10. REPORT ACTIONS BAR
export const ReportActionsBar = ({ onBack, onPrint }: { onBack: () => void, onPrint: () => void }) => (
  <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-border/30">
    <Button variant="secondary" onClick={onBack} className="px-6 py-3 text-base font-bold rounded-xl border shadow-subtle transition-transform hover:scale-105 active:scale-95">
      <ArrowRight className="w-4 h-4 rtl-flip" />
      العودة لمركز القرار
    </Button>
    
    <div className="flex items-center gap-4">
      <Button variant="ghost" className="text-text-secondary hover:bg-surface-soft px-4 py-3 text-base font-bold rounded-xl transition-all flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        مشاركة
      </Button>
      <Button variant="ghost" className="text-text-secondary hover:bg-surface-soft px-4 py-3 text-base font-bold rounded-xl transition-all flex items-center gap-2">
        <FileDown className="w-4 h-4" />
        تصدير
      </Button>
      <Button onClick={onPrint} className="px-10 py-4 text-lg font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-3">
        <Printer className="w-5 h-5" />
        طباعة التقرير
      </Button>
    </div>
  </div>
);
