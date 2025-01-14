import React from 'react';
import { FileText, Users, FileSpreadsheet, FileCheck, BarChart2, UserPlus } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { useAuth } from '../contexts/AuthContext';
import { useClient } from '../contexts/ClientContext';
import { useNavigate } from '../hooks/useNavigate';
import { ClientSwitcher } from '../components/ClientSwitcher';

export function Dashboard() {
  const { user, logout } = useAuth();
  const { goToCnisAnalysis, goToPetitionEditor, goToRuralAnalysis, goToAnalysisDashboard, goToClientManagement } = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">ePREV</h1>
              <p className="text-blue-200">Bem-vindo(a), {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <ClientSwitcher />
              <button
                onClick={goToAnalysisDashboard}
                className="flex items-center px-4 py-2 bg-blue-800 rounded-md hover:bg-blue-700 transition-colors"
              >
                <BarChart2 className="w-4 h-4 mr-2" />
                Análise Consolidada
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-blue-800 rounded-md hover:bg-blue-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Gerenciar Clientes"
            description="Cadastre e gerencie seus clientes"
            icon={UserPlus}
            onClick={goToClientManagement}
          />
          <DashboardCard
            title="Análise de CNIS"
            description="Análise detalhada do Cadastro Nacional de Informações Sociais"
            icon={Users}
            onClick={goToCnisAnalysis}
          />
          <DashboardCard
            title="Aposentadoria Rural"
            description="Avaliação de requisitos para aposentadoria rural"
            icon={FileSpreadsheet}
            onClick={goToRuralAnalysis}
          />
          <DashboardCard
            title="Gerador de Petições"
            description="Criação automatizada de petições previdenciárias"
            icon={FileText}
            onClick={goToPetitionEditor}
          />
        </div>
      </main>
    </div>
  );
}