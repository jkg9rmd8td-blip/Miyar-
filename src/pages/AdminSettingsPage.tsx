import React from 'react';
import { Card, Button, SectionBlock } from '@/src/components/ui/Base';
import { PageHeader } from '@/src/components/layout/AppShell';
import { 
  Users, 
  Shield, 
  Settings, 
  Lock, 
  UserPlus, 
  FileKey, 
  Globe, 
  BellRing 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function AdminSettingsPage() {
  const users = [
    { name: 'أحمد العتيبي', role: 'مدير نظام', email: 'admin@miyar.sa', status: 'نشط' },
    { name: 'سارة الفهد', role: 'محلل وظائف', email: 'sara@miyar.sa', status: 'نشط' },
    { name: 'خالد محمد', role: 'مقيم فني', email: 'khaled@miyar.sa', status: 'غير نشط' },
  ];

  return (
    <div className="max-w-[1000px] mx-auto space-y-12 pb-24">
      <PageHeader 
        title="إدارة النظام والإعدادات" 
        description="إدارة المستخدمين، السياسات، الصلاحيات، وإعدادات المنصة العامة."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Quick Stats / Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <Card level={1} className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-primary m-0">أقسام الإدارة</h3>
            <div className="space-y-2">
              {[
                { label: 'إدارة المستخدمين', icon: Users, active: true },
                { label: 'سياسات الوصول', icon: Shield, active: false },
                { label: 'إعدادات الأمان', icon: Lock, active: false },
                { label: 'التكاملات والربط', icon: Globe, active: false },
                { label: 'التنبيهات والنظام', icon: BellRing, active: false },
              ].map((item, i) => (
                <button 
                  key={i}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all",
                    item.active ? "bg-primary text-white shadow-md" : "text-text-secondary hover:bg-neutral"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </Card>

          <Card level={2} className="p-6 bg-secondary/5 border-secondary/20 space-y-4">
            <div className="flex items-center gap-3 text-secondary">
              <Shield className="w-5 h-5" />
              <h4 className="text-xs font-bold m-0">حالة الأمان</h4>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed m-0 font-medium">
              جميع بروتوكولات التشفير والحماية تعمل بكفاءة عالية. آخر فحص أمان تم منذ 12 ساعة.
            </p>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          <SectionBlock title="إدارة المستخدمين">
            <Card level={1} className="p-0 overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between bg-neutral/30">
                <h4 className="text-xs font-bold text-primary m-0">قائمة أعضاء الفريق</h4>
                <Button variant="primary" size="sm" className="gap-2 text-[10px]">
                  <UserPlus className="w-3.5 h-3.5" />
                  إضافة مستخدم
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-neutral/50 border-b border-border">
                      <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">المستخدم</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">الدور</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">الحالة</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, i) => (
                      <tr key={i} className="border-b border-border hover:bg-neutral/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-primary">{user.name}</span>
                            <span className="text-[10px] text-text-muted">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-text-secondary font-medium">{user.role}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                            user.status === 'نشط' ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-danger/10 text-danger border-danger/20"
                          )}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm" className="p-1.5 text-text-muted hover:text-primary">
                            <Settings className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </SectionBlock>

          <SectionBlock title="سياسات النظام">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card level={2} className="p-6 space-y-4 border-border">
                <div className="flex items-center gap-3">
                  <FileKey className="w-5 h-5 text-primary" />
                  <h4 className="text-xs font-bold text-primary m-0">معايير التقييم</h4>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed m-0 font-medium">
                  تعديل الأوزان النسبية لمعايير التوافق الوظيفي والبيئي المستخدمة في محرك القرار.
                </p>
                <Button variant="ghost" className="w-full text-[10px] font-bold border-t border-border pt-3 rounded-none">تعديل المعايير</Button>
              </Card>

              <Card level={2} className="p-6 space-y-4 border-border">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <h4 className="text-xs font-bold text-primary m-0">إعدادات البوابة</h4>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed m-0 font-medium">
                  التحكم في واجهات الربط مع أنظمة الموارد البشرية الخارجية وبوابات التوظيف.
                </p>
                <Button variant="ghost" className="w-full text-[10px] font-bold border-t border-border pt-3 rounded-none">إدارة الربط</Button>
              </Card>
            </div>
          </SectionBlock>
        </div>
      </div>
    </div>
  );
}
