import React from 'react';
import { useAssessment } from '@/src/store/AssessmentContext';
import { SectionBlock } from '@/src/components/ui/Base';
import { 
  ExecutiveReportHeader, 
  ExecutiveSummaryStrip, 
  ExecutiveNarrativeCard, 
  DecisionDriversPanel, 
  DimensionSummaryCard, 
  SimulationEvidenceCard, 
  FinancialImpactCard, 
  ExecutiveActionList, 
  GovernanceTraceCard, 
  ReportActionsBar 
} from '@/src/components/report/ExecutiveReportComponents';
import { 
  generateExecutiveSummary, 
  getDecisionSupportFactors, 
  getDecisionLimitingFactors, 
  getDecisionChangeActions, 
  getSimulationExecutiveImpact, 
  getGovernanceTraceSummary 
} from '@/src/lib/scoring/report-helpers';
import { useNavigate } from 'react-router-dom';

export default function ReadinessReportPage() {
  const { candidateData, employerData, decisionResult, simulationEvidence } = useAssessment();
  const { scores, decision, confidence, topBlocker } = decisionResult;
  const navigate = useNavigate();

  const executiveNarrative = generateExecutiveSummary(decisionResult);
  const supports = getDecisionSupportFactors(decisionResult, { candidate: candidateData, employer: employerData, simulationEvidence });
  const limits = getDecisionLimitingFactors(decisionResult);
  const changes = getDecisionChangeActions(decisionResult);
  const simImpacts = getSimulationExecutiveImpact({ candidate: candidateData, employer: employerData, simulationEvidence });
  const governanceSummary = getGovernanceTraceSummary(decisionResult, { candidate: candidateData, employer: employerData, simulationEvidence });

  const executiveActions = decisionResult.nextActions.map((action, i) => ({
    label: action,
    priority: i === 0 ? 'high' as const : i === 1 ? 'medium' as const : 'low' as const,
    rationale: i === 0 ? 'خطوة حرجة لضمان دفاعية القرار.' : 'إجراء تكميلي لرفع جودة التوافق.'
  }));

  const handleBack = () => {
    navigate('/external/decision-center');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-content mx-auto space-y-12 pb-20 pt-10 print:p-0 print:space-y-8">
      {/* 1. REPORT HEADER */}
      <ExecutiveReportHeader 
        candidateName={candidateData.name || 'مرشح تجريبي'} 
        stage="المراجعة النهائية" 
        updatedAt={new Date().toLocaleDateString('ar-SA')} 
        owner="لجنة التقييم" 
        source="نظام معيار" 
      />

      {/* 2. EXECUTIVE SUMMARY STRIP */}
      <ExecutiveSummaryStrip 
        decision={decision} 
        confidence={confidence} 
        readiness={scores.taskFit.value} 
        financialImpact={scores.financialImpact.value} 
        topBlocker={topBlocker} 
      />

      {/* 3. EXECUTIVE NARRATIVE */}
      <ExecutiveNarrativeCard narrative={executiveNarrative} />

      {/* 4. DECISION DRIVERS */}
      <SectionBlock title="العوامل المؤثرة في القرار">
        <DecisionDriversPanel 
          supports={supports} 
          limits={limits} 
          changes={changes} 
        />
      </SectionBlock>

      {/* 5. DIMENSION SUMMARY */}
      <SectionBlock title="ملخص الأبعاد">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DimensionSummaryCard label="توافق المهام" score={scores.taskFit} />
          <DimensionSummaryCard label="توافق البيئة" score={scores.environmentFit} />
          <DimensionSummaryCard label="قوة الدليل" score={scores.evidenceStrength} />
          <DimensionSummaryCard label="قابلية التكييف" score={scores.accommodationFeasibility} />
          <DimensionSummaryCard label="شدة المانع" score={scores.blockerSeverity} />
          <DimensionSummaryCard label="دفاعية القرار" score={scores.decisionDefensibility} />
        </div>
      </SectionBlock>

      {/* 6. SIMULATION EVIDENCE (CONDITIONAL) */}
      {simulationEvidence.isCompleted && simulationEvidence.result && (
        <SectionBlock title="الدليل السلوكي الإضافي">
          <SimulationEvidenceCard 
            type={simulationEvidence.result.simulationType === 'time_pressure' ? 'ضغط الوقت' : simulationEvidence.result.simulationType === 'information_density' ? 'كثافة المعلومات' : 'التنقل بين المهام'} 
            narrative={simulationEvidence.result.narrative} 
            signals={simulationEvidence.result.impactFlags} 
            impacts={simImpacts} 
          />
        </SectionBlock>
      )}

      {/* 7. FINANCIAL & OPERATIONAL IMPACT */}
      <SectionBlock title="الأثر التشغيلي والمالي">
        <FinancialImpactCard 
          accommodationEffect={scores.accommodationFeasibility.value > 70 ? 'منخفض' : 'متوسط'} 
          delayCost="2,500 ر.س / أسبوع" 
          mismatchRisk={scores.blockerSeverity.value > 60 ? 'مرتفع' : 'منخفض'} 
          benefit="تحسين استقرار بنسبة 15%" 
        />
      </SectionBlock>

      {/* 8. CASE READINESS ACTIONS */}
      <SectionBlock title="التوصيات التنفيذية">
        <ExecutiveActionList actions={executiveActions} />
      </SectionBlock>

      {/* 9. GOVERNANCE / TRACEABILITY BLOCK */}
      <SectionBlock title="قابلية التتبع والمراجعة">
        <GovernanceTraceCard summary={governanceSummary} />
      </SectionBlock>

      {/* 10. REPORT ACTIONS */}
      <div className="print:hidden">
        <ReportActionsBar onBack={handleBack} onPrint={handlePrint} />
      </div>
    </div>
  );
}
