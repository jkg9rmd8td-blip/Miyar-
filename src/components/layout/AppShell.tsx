import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCircle, 
  ClipboardCheck, 
  Shield, 
  FileText, 
  Wrench, 
  DollarSign,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAssessment } from '@/src/store/AssessmentContext';
import { Button } from '../ui/Base';
import { MiyarLogo } from '../ui/Logo';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('miyar_sidebar_collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('miyar_sidebar_collapsed', String(isCollapsed));
  }, [isCollapsed]);

  const navItems: { label: string; path: string; icon: any; subItems?: { label: string; path: string }[] }[] = [
    { label: 'لوحة التحكم التنفيذية', path: '/home', icon: LayoutDashboard },
    { 
      label: 'تحليل الوظائف (JTA)', 
      path: '/portal/job-task-analysis', 
      icon: ClipboardCheck,
      subItems: [
        { label: 'تحليل المهام الفعلية', path: '/portal/job-task-analysis' },
        { label: 'سجل المخاطر التشغيلية', path: '/portal/job-task-analysis/risks' },
      ]
    },
    { 
      label: 'تقييم القدرة الوظيفية (FCA)', 
      path: '/portal/functional-assessment', 
      icon: UserCircle,
      subItems: [
        { label: 'التقييم المهني للمرشح', path: '/portal/functional-assessment' },
        { label: 'مصفوفة القدرات', path: '/portal/functional-assessment/matrix' },
      ]
    },
    { label: 'التكييف البيئي (WA)', path: '/portal/workplace-accommodation', icon: Wrench },
    { label: 'التحليل المالي (CVE)', path: '/portal/cost-value-estimation', icon: DollarSign },
    { label: 'التوصية والحوكمة', path: '/portal/decision-recommendation', icon: Shield },
    { label: 'الالتقارير النهائية', path: '/readiness-report', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex bg-bg text-text-primary font-sans" dir="rtl">
      {/* Sidebar - Right Side */}
      <aside 
        className={cn(
          "border-l border-border bg-white flex flex-col sticky top-0 h-screen z-50 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn(
          "p-6 border-b border-border flex flex-col items-center gap-4 relative",
          isCollapsed ? "px-2" : "px-6"
        )}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-neutral transition-colors z-10"
            title={isCollapsed ? "فتح القائمة" : "طي القائمة"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-primary" /> : <ChevronLeft className="w-4 h-4 text-primary" />}
          </button>

          <MiyarLogo className={cn("transition-all duration-300", isCollapsed ? "w-10 h-10" : "w-14 h-14")} />
          {!isCollapsed && (
            <div className="text-center">
              <span className="text-xl font-bold text-primary tracking-tighter block">معيار</span>
              <span className="text-[8px] text-text-muted font-bold uppercase tracking-[0.2em]">MIYAR PLATFORM</span>
            </div>
          )}
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.subItems?.some(sub => location.pathname === sub.path));
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isHovered = hoveredItem === item.path;

            return (
              <div 
                key={item.path} 
                className="space-y-1"
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link 
                  to={item.path}
                  title={isCollapsed ? item.label : ""}
                  className={cn(
                    "flex items-center gap-4 px-3 py-3 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-all relative group",
                    isActive 
                      ? "bg-primary text-white shadow-md" 
                      : "text-text-secondary hover:bg-neutral hover:text-primary",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-text-muted group-hover:text-primary")} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  
                  {isCollapsed && (
                    <div className="absolute right-full mr-2 px-2 py-1 bg-primary text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </Link>

                {hasSubItems && !isCollapsed && (isActive || isHovered) && (
                  <div className="mr-9 space-y-1 mt-1 animate-in slide-in-from-top-1 duration-200">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className={cn(
                          "block px-3 py-2 rounded-md text-[10px] font-bold transition-all",
                          location.pathname === sub.path
                            ? "text-secondary bg-secondary/5"
                            : "text-text-muted hover:text-primary hover:bg-neutral"
                        )}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="text-center">
            {!isCollapsed && <p className="text-[8px] text-text-muted font-bold uppercase tracking-widest m-0 mb-1">نظام دعم القرار المؤسسي</p>}
            <p className="text-[8px] text-text-muted m-0">© {new Date().getFullYear()} MIYAR</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-white sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-xs font-bold text-primary m-0">منصة معيار</h2>
              <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">نظام دعم القرار المؤسسي</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">المستخدم الحالي</span>
              <span className="text-xs font-bold text-primary">مدير النظام</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-neutral border border-border flex items-center justify-center cursor-pointer hover:bg-surface-soft transition-colors">
              <UserCircle className="w-5 h-5 text-text-secondary" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1440px] mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const PageHeader = ({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 border-b border-border pb-8">
    <div className="space-y-2 text-right">
      <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight m-0">{title}</h1>
      {description && <p className="text-sm text-text-secondary max-w-2xl font-medium m-0 leading-relaxed">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);
