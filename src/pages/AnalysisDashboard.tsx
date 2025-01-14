import React, { useState } from 'react';
import { ArrowLeft, FileText, Users, FileSpreadsheet, FileCheck, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useClient } from '../contexts/ClientContext';
import { AnalysisCard } from '../components/analysis/AnalysisCard';
import { CNISAnalysisContent } from '../components/analysis/CNISAnalysisContent';
import { RuralAnalysisContent } from '../components/analysis/RuralAnalysisContent';
import { PPPAnalysisContent } from '../components/analysis/PPPAnalysisContent';
import { ResultsContent } from '../components/analysis/ResultsContent';
import { ClientHeader } from '../components/ClientHeader';
import { ClientSelector } from '../components/ClientSelector';

export function AnalysisDashboard() {
  const { goToDashboard, goToPetitionEditor } = useNavigate();
  const { selectedClient } = useClient();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader
        title="Análise Consolidada"
        subtitle="Visão geral do processo previdenciário"
        onBack={goToDashboard}
        actions={
          selectedClient && (
            <button
              onClick={goToPetitionEditor}
              className="flex items-center px-4 py-2 bg-blue-800 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Gerar Petição
            </button>
          )
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!selectedClient ? (
          <ClientSelector />
        ) : (
          <div className="space-y-6">
            <AnalysisCard
              id="cnis"
              title="Análise de CNIS"
              icon={Users}
              isExpanded={expandedCard === 'cnis'}
              onToggle={() => toggleCard('cnis')}
            >
              <CNISAnalysisContent />
            </AnalysisCard>

            <AnalysisCard
              id="rural"
              title="Aposentadoria Rural"
              icon={FileSpreadsheet}
              isExpanded={expandedCard === 'rural'}
              onToggle={() => toggleCard('rural')}
            >
              <RuralAnalysisContent />
            </AnalysisCard>

            <AnalysisCard
              id="ppp"
              title="Análise de PPP"
              icon={FileCheck}
              isExpanded={expandedCard === 'ppp'}
              onToggle={() => toggleCard('ppp')}
            >
              <PPPAnalysisContent />
            </AnalysisCard>

            <AnalysisCard
              id="results"
              title="Resultados"
              icon={FileText}
              isExpanded={expandedCard === 'results'}
              onToggle={() => toggleCard('results')}
            >
              <ResultsContent />
            </AnalysisCard>
          </div>
        )}
      </main>
    </div>
  );
}