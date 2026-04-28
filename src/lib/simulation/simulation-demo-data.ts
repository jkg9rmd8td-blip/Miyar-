import { SimulationDefinition } from './simulation-types';

export const SIMULATIONS: SimulationDefinition[] = [
  {
    id: 'time_pressure',
    title: 'العمل تحت ضغط الوقت',
    description: 'اختبار القدرة على اتخاذ قرارات دقيقة وسريعة في بيئة عمل متسارعة.',
    steps: [
      {
        id: 'tp_1',
        context: 'أنت في منتصف معالجة طلبات العملاء المتراكمة.',
        situation: 'وصلك بريد إلكتروني عاجل من المدير يطلب تقريراً فورياً، وفي نفس الوقت يتصل عميل غاضب.',
        prompt: 'ما هو الإجراء الأول الذي ستتخذه؟',
        options: [
          {
            id: 'tp_1_a',
            text: 'الرد على العميل أولاً لتهدئته ثم البدء في التقرير.',
            metadata: { responseQuality: 80, pressureHandling: 70, prioritization: 90, supportNeed: 20 }
          },
          {
            id: 'tp_1_b',
            text: 'تجاهل العميل والبدء في التقرير فوراً لإرضاء المدير.',
            metadata: { responseQuality: 60, pressureHandling: 50, prioritization: 70, supportNeed: 10 }
          },
          {
            id: 'tp_1_c',
            text: 'طلب المساعدة من زميل للتعامل مع العميل بينما تبدأ في التقرير.',
            metadata: { responseQuality: 90, pressureHandling: 90, prioritization: 100, supportNeed: 50 }
          }
        ]
      },
      {
        id: 'tp_2',
        context: 'تبقى 10 دقائق على موعد تسليم التقرير.',
        situation: 'اكتشفت خطأً بسيطاً في الأرقام النهائية قد لا يلاحظه أحد.',
        prompt: 'كيف ستتصرف؟',
        options: [
          {
            id: 'tp_2_a',
            text: 'تصحيح الخطأ فوراً حتى لو تأخر التسليم قليلاً.',
            metadata: { responseQuality: 95, pressureHandling: 80, prioritization: 80, supportNeed: 10 }
          },
          {
            id: 'tp_2_b',
            text: 'إرسال التقرير كما هو لتجنب التأخير.',
            metadata: { responseQuality: 50, pressureHandling: 40, prioritization: 60, supportNeed: 0 }
          },
          {
            id: 'tp_2_c',
            text: 'إرسال التقرير مع ملاحظة تشير إلى وجود تحديث سيصل لاحقاً.',
            metadata: { responseQuality: 75, pressureHandling: 70, prioritization: 85, supportNeed: 20 }
          }
        ]
      },
      {
        id: 'tp_3',
        context: 'بعد تسليم التقرير بنجاح.',
        situation: 'يطلب منك المدير الآن البدء في مهمة جديدة معقدة فوراً.',
        prompt: 'ما هو رد فعلك؟',
        options: [
          {
            id: 'tp_3_a',
            text: 'البدء فوراً دون اعتراض لإثبات الكفاءة.',
            metadata: { responseQuality: 70, pressureHandling: 60, prioritization: 50, supportNeed: 10 }
          },
          {
            id: 'tp_3_b',
            text: 'طلب 5 دقائق لتنظيم المهام السابقة قبل البدء.',
            metadata: { responseQuality: 90, pressureHandling: 95, prioritization: 90, supportNeed: 20 }
          },
          {
            id: 'tp_3_c',
            text: 'السؤال عن الأولوية مقارنة بالمهام الأخرى المتبقية.',
            metadata: { responseQuality: 100, pressureHandling: 100, prioritization: 100, supportNeed: 30 }
          }
        ]
      }
    ]
  },
  {
    id: 'information_density',
    title: 'التعامل مع كثافة المعلومات',
    description: 'قياس القدرة على استخراج المعلومات الجوهرية من كميات كبيرة من البيانات.',
    steps: [
      {
        id: 'id_1',
        context: 'استلمت ملفاً يحتوي على 50 صفحة من البيانات التقنية.',
        situation: 'يجب عليك تلخيص أهم 3 نقاط للمدير في غضون 15 دقيقة.',
        prompt: 'كيف ستبدأ العمل؟',
        options: [
          {
            id: 'id_1_a',
            text: 'قراءة الفهرس والملخص التنفيذي أولاً.',
            metadata: { responseQuality: 95, pressureHandling: 90, prioritization: 100, supportNeed: 10 }
          },
          {
            id: 'id_1_b',
            text: 'البدء بقراءة الصفحات من البداية بتركيز.',
            metadata: { responseQuality: 60, pressureHandling: 40, prioritization: 50, supportNeed: 0 }
          },
          {
            id: 'id_1_c',
            text: 'البحث عن الكلمات المفتاحية المتعلقة بالمشروع الحالي.',
            metadata: { responseQuality: 85, pressureHandling: 80, prioritization: 90, supportNeed: 10 }
          }
        ]
      },
      {
        id: 'id_2',
        context: 'أثناء التلخيص، وجدت معلومات متناقضة في قسمين مختلفين.',
        situation: 'الوقت ينفد ولا يمكنك التأكد من المصدر الأصلي الآن.',
        prompt: 'ماذا ستفعل؟',
        options: [
          {
            id: 'id_2_a',
            text: 'تجاهل التناقض وذكر المعلومة الأكثر تكراراً.',
            metadata: { responseQuality: 50, pressureHandling: 50, prioritization: 60, supportNeed: 0 }
          },
          {
            id: 'id_2_b',
            text: 'الإشارة إلى وجود تناقض في التلخيص وطلب التوضيح.',
            metadata: { responseQuality: 90, pressureHandling: 85, prioritization: 95, supportNeed: 40 }
          },
          {
            id: 'id_2_c',
            text: 'اختيار المعلومة التي تبدو أكثر منطقية بناءً على خبرتك.',
            metadata: { responseQuality: 70, pressureHandling: 70, prioritization: 75, supportNeed: 10 }
          }
        ]
      },
      {
        id: 'id_3',
        context: 'المدير يسألك عن تفصيل دقيق لم تذكره في التلخيص.',
        situation: 'أنت تعرف أنه موجود في الملف الأصلي لكنك لا تتذكر مكانه.',
        prompt: 'كيف ستجيب؟',
        options: [
          {
            id: 'id_3_a',
            text: 'الاعتراف بعدم تذكر التفصيل والوعد بالبحث عنه فوراً.',
            metadata: { responseQuality: 90, pressureHandling: 90, prioritization: 80, supportNeed: 20 }
          },
          {
            id: 'id_3_b',
            text: 'محاولة تخمين الإجابة بناءً على ما قرأته.',
            metadata: { responseQuality: 40, pressureHandling: 30, prioritization: 40, supportNeed: 0 }
          },
          {
            id: 'id_3_c',
            text: 'طلب دقيقة واحدة لفتح الملف والوصول للمعلومة بدقة.',
            metadata: { responseQuality: 100, pressureHandling: 95, prioritization: 90, supportNeed: 10 }
          }
        ]
      }
    ]
  },
  {
    id: 'task_switching',
    title: 'التنقل بين المهام والمقاطعات',
    description: 'اختبار المرونة في تغيير التركيز بين مهام مختلفة دون فقدان الجودة.',
    steps: [
      {
        id: 'ts_1',
        context: 'تعمل على إدخال بيانات حساسة تتطلب تركيزاً عالياً.',
        situation: 'زميل يطلب منك المساعدة في مشكلة تقنية بسيطة في جهازه.',
        prompt: 'كيف ستتصرف؟',
        options: [
          {
            id: 'ts_1_a',
            text: 'التوقف فوراً ومساعدته ثم العودة لعملك.',
            metadata: { responseQuality: 60, pressureHandling: 70, prioritization: 40, supportNeed: 0 }
          },
          {
            id: 'ts_1_b',
            text: 'الاعتذار بلباقة والطلب منه الانتظار حتى تنهي الفقرة الحالية.',
            metadata: { responseQuality: 95, pressureHandling: 90, prioritization: 100, supportNeed: 10 }
          },
          {
            id: 'ts_1_c',
            text: 'توجيهه إلى الدعم الفني أو زميل آخر متاح.',
            metadata: { responseQuality: 85, pressureHandling: 80, prioritization: 90, supportNeed: 20 }
          }
        ]
      },
      {
        id: 'ts_2',
        context: 'عدت لعملك ولكنك فقدت تسلسل الأفكار.',
        situation: 'هناك ضغط لإنهاء المهمة في موعدها.',
        prompt: 'ما هي استراتيجيتك للعودة؟',
        options: [
          {
            id: 'ts_2_a',
            text: 'مراجعة آخر 3 خطوات قمت بها للتأكد من الصحة.',
            metadata: { responseQuality: 100, pressureHandling: 95, prioritization: 90, supportNeed: 10 }
          },
          {
            id: 'ts_2_b',
            text: 'البدء من حيث تعتقد أنك توقفت بسرعة.',
            metadata: { responseQuality: 60, pressureHandling: 50, prioritization: 60, supportNeed: 0 }
          },
          {
            id: 'ts_2_c',
            text: 'أخذ استراحة قصيرة جداً لتصفية الذهن قبل البدء.',
            metadata: { responseQuality: 80, pressureHandling: 85, prioritization: 70, supportNeed: 10 }
          }
        ]
      },
      {
        id: 'ts_3',
        context: 'الآن لديك مهمتان مفتوحتان في نفس الوقت.',
        situation: 'كلاهما يتطلب انتباهاً دورياً.',
        prompt: 'كيف ستدير وقتك؟',
        options: [
          {
            id: 'ts_3_a',
            text: 'تخصيص فترات زمنية محددة (مثلاً 20 دقيقة) لكل مهمة.',
            metadata: { responseQuality: 95, pressureHandling: 90, prioritization: 100, supportNeed: 10 }
          },
          {
            id: 'ts_3_b',
            text: 'التبديل بينهما كلما شعرت بالملل من إحداهما.',
            metadata: { responseQuality: 50, pressureHandling: 40, prioritization: 40, supportNeed: 0 }
          },
          {
            id: 'ts_3_c',
            text: 'إنهاء المهمة الأسهل أولاً للتفرغ للأصعب.',
            metadata: { responseQuality: 85, pressureHandling: 80, prioritization: 90, supportNeed: 10 }
          }
        ]
      }
    ]
  },
  {
    id: 'job_specific',
    title: 'محاكاة مهام الوظيفة (ذكاء اصطناعي)',
    description: 'توليد سيناريوهات واقعية مصممة خصيصاً للمسمى الوظيفي والمهام الحرجة المحددة.',
    steps: []
  }
];
