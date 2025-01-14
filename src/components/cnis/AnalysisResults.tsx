import React from 'react';
import { Loader, CheckCircle, AlertCircle, Calendar, Clock } from 'lucide-react';
import { useCnis } from '../../hooks/useCnis';
import { useClient } from '../../contexts/ClientContext';

interface AnalysisResultsProps {
  isLoading: boolean;
}

export function AnalysisResults({ isLoading }: AnalysisResultsProps) {
  const { selectedClient } = useClient();
  const { cnisData } = useCnis();
  
  const analysisData = selectedClient ? cnisData[selectedClient.id] : null;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-48">
          <Loader className="w-8 h-8 text-blue-900 animate-spin" />
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          Nenhuma análise disponível
        </div>
      </div>
    );
  }

  const { summary } = analysisData;
  const carenciaAtingida = summary.regularMonths >= 180;
  const tempoContribuicaoTotal = Math.floor(summary.totalMonths / 12);
  const mesesRestantes = summary.totalMonths % 12;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Resultados da Análise</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-700 mr-2" />
            <h3 className="font-medium text-green-700">Tempo de Contribuição</h3>
          </div>
          <p className="mt-2 text-green-600">
            {tempoContribuicaoTotal} anos{mesesRestantes > 0 ? `, ${mesesRestantes} meses` : ''}
          </p>
        </div>
        
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-700 mr-2" />
            <h3 className="font-medium text-yellow-700">Períodos Irregulares</h3>
          </div>
          <p className="mt-2 text-yellow-600">
            {summary.pendingMonths} competências com pendências
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-blue-700 mr-2" />
            <h3 className="font-medium text-blue-700">Carência</h3>
          </div>
          <p className="mt-2 text-blue-600">
            {summary.regularMonths} contribuições mensais
            {carenciaAtingida && " (Carência atingida)"}
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-purple-700 mr-2" />
            <h3 className="font-medium text-purple-700">Média Salarial</h3>
          </div>
          <p className="mt-2 text-purple-600">
            R$ {summary.averageContribution.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}