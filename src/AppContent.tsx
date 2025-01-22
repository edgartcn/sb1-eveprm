import React, { useEffect, useState } from 'react';
import { useAuthStore } from './lib/store';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CnisAnalysis } from './pages/CnisAnalysis';
import { PetitionEditor } from './pages/PetitionEditor';
import { RuralAnalysis } from './pages/RuralAnalysis';
import { AnalysisDashboard } from './pages/AnalysisDashboard';
import { ClientManagement } from './pages/ClientManagement';
import { AppPage } from './hooks/useNavigate';

export function AppContent() {
  const { isAuthenticated } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');

  useEffect(() => {
    const handleNavigation = (event: PopStateEvent) => {
      const page = event.state?.page || 'dashboard';
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  if (!isAuthenticated) {
    return <Login />;
  }

  switch (currentPage) {
    case 'cnis-analysis':
      return <CnisAnalysis />;
    case 'petition-editor':
      return <PetitionEditor />;
    case 'rural-analysis':
      return <RuralAnalysis />;
    case 'analysis-dashboard':
      return <AnalysisDashboard />;
    case 'client-management':
      return <ClientManagement />;
    default:
      return <Dashboard />;
  }
}