import { useCallback } from 'react';

export type AppPage = 'dashboard' | 'cnis-analysis' | 'petition-editor' | 'rural-analysis' | 'analysis-dashboard' | 'client-management';

export function useNavigate() {
  const navigate = useCallback((page: AppPage) => {
    window.history.pushState({ page }, '', `/${page}`);
    window.dispatchEvent(new PopStateEvent('popstate', { state: { page } }));
  }, []);

  const goToDashboard = useCallback(() => {
    navigate('dashboard');
  }, [navigate]);

  const goToCnisAnalysis = useCallback(() => {
    navigate('cnis-analysis');
  }, [navigate]);

  const goToPetitionEditor = useCallback(() => {
    navigate('petition-editor');
  }, [navigate]);

  const goToRuralAnalysis = useCallback(() => {
    navigate('rural-analysis');
  }, [navigate]);

  const goToAnalysisDashboard = useCallback(() => {
    navigate('analysis-dashboard');
  }, [navigate]);

  const goToClientManagement = useCallback(() => {
    navigate('client-management');
  }, [navigate]);

  return {
    goToDashboard,
    goToCnisAnalysis,
    goToPetitionEditor,
    goToRuralAnalysis,
    goToAnalysisDashboard,
    goToClientManagement,
  };
}