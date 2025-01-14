import React, { useState } from 'react';
import { Upload, FileText, Download } from 'lucide-react';
import { Timeline } from '../components/cnis/Timeline';
import { ContributionsTable } from '../components/cnis/ContributionsTable';
import { AnalysisResults } from '../components/cnis/AnalysisResults';
import { FileUploader } from '../components/cnis/FileUploader';
import { useNavigate } from '../hooks/useNavigate';
import { ClientHeader } from '../components/ClientHeader';

export function CnisAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { goToDashboard } = useNavigate();

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => setIsAnalyzing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader
        title="Análise de CNIS"
        subtitle="Análise detalhada do histórico contributivo"
        onBack={goToDashboard}
        actions={
          <button
            disabled={!file || isAnalyzing}
            className="flex items-center px-4 py-2 bg-blue-800 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!file ? (
          <FileUploader onFileUpload={handleFileUpload} />
        ) : (
          <div className="space-y-8">
            <Timeline isLoading={isAnalyzing} />
            <ContributionsTable isLoading={isAnalyzing} />
            <AnalysisResults isLoading={isAnalyzing} />
          </div>
        )}
      </main>
    </div>
  );
}