import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AssessmentProvider } from './store/AssessmentContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import DecisionCenter from './pages/DecisionCenter';
import AdminSettingsPage from './pages/AdminSettingsPage';
import ReadinessReportPage from './pages/ReadinessReportPage';
import JobTaskAnalysisPage from './pages/JobTaskAnalysisPage';
import FunctionalAssessmentPage from './pages/FunctionalAssessmentPage';
import WorkplaceAccommodationPage from './pages/WorkplaceAccommodationPage';
import CostValueEstimationPage from './pages/CostValueEstimationPage';
import DecisionRecommendationPage from './pages/DecisionRecommendationPage';

export default function App() {
  return (
    <AssessmentProvider>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<DecisionCenter />} />
            <Route path="/admin" element={<AdminSettingsPage />} />
            <Route path="/readiness-report" element={<ReadinessReportPage />} />
            <Route path="/portal/job-task-analysis" element={<JobTaskAnalysisPage />} />
            <Route path="/portal/functional-assessment" element={<FunctionalAssessmentPage />} />
            <Route path="/portal/workplace-accommodation" element={<WorkplaceAccommodationPage />} />
            <Route path="/portal/cost-value-estimation" element={<CostValueEstimationPage />} />
            <Route path="/portal/decision-recommendation" element={<DecisionRecommendationPage />} />
          </Routes>
        </AppShell>
      </Router>
    </AssessmentProvider>
  );
}
