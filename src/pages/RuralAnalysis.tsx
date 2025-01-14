import React, { useState } from 'react';
import { ArrowLeft, Upload, Users, FileCheck } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useClient } from '../contexts/ClientContext';
import { WorkPeriodForm } from '../components/rural/WorkPeriodForm';
import { DocumentUpload } from '../components/rural/DocumentUpload';
import { WitnessForm } from '../components/rural/WitnessForm';
import { RequirementsCard } from '../components/rural/RequirementsCard';
import { ClientSelector } from '../components/ClientSelector';
import { ClientHeader } from '../components/ClientHeader';

export function RuralAnalysis() {
  const { goToDashboard } = useNavigate();
  const { selectedClient } = useClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => setIsAnalyzing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader
        title="Aposentadoria Rural"
        subtitle="Análise de requisitos para aposentadoria rural"
        onBack={goToDashboard}
        actions={
          selectedClient && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center px-4 py-2 bg-blue-800 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analisando...' : 'Analisar Requisitos'}
            </button>
          )
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!selectedClient ? (
          <ClientSelector />
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <WorkPeriodForm />
              <DocumentUpload />
              <WitnessForm />
            </div>
            <div className="col-span-1">
              <RequirementsCard isLoading={isAnalyzing} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}