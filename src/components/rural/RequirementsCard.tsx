import React from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useRuralAnalysis } from '../../hooks/useRuralAnalysis';

interface RequirementsCardProps {
  isLoading: boolean;
}

export function RequirementsCard({ isLoading }: RequirementsCardProps) {
  const { analysisData } = useRuralAnalysis();

  const getProgress = (current: number, required: number) => {
    return Math.min((current / required) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-48">
          <Loader className="w-8 h-8 text-blue-900 animate-spin" />
        </div>
      </div>
    );
  }

  if (!analysisData?.requirements) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          Carregando requisitos...
        </div>
      </div>
    );
  }

  const { requirements } = analysisData;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-lg font-semibold mb-6">Requisitos para Aposentadoria</h2>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Idade Mínima</span>
            <span className="text-sm font-medium text-gray-900">
              {requirements.age.current}/{requirements.age.required} anos
            </span>
          </div>
          <div className="relative w-full h-2 bg-gray-200 rounded">
            <div
              className="absolute h-full bg-blue-900 rounded"
              style={{ width: `${getProgress(requirements.age.current, requirements.age.required)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Trabalho Rural</span>
            <span className="text-sm font-medium text-gray-900">
              {requirements.ruralWork.current}/{requirements.ruralWork.required} meses
            </span>
          </div>
          <div className="relative w-full h-2 bg-gray-200 rounded">
            <div
              className="absolute h-full bg-blue-900 rounded"
              style={{
                width: `${getProgress(
                  requirements.ruralWork.current,
                  requirements.ruralWork.required
                )}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Documentos</span>
            <span className="text-sm font-medium text-gray-900">
              {requirements.documents.current}/{requirements.documents.required}
            </span>
          </div>
          <div className="relative w-full h-2 bg-gray-200 rounded">
            <div
              className="absolute h-full bg-blue-900 rounded"
              style={{
                width: `${getProgress(
                  requirements.documents.current,
                  requirements.documents.required
                )}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Testemunhas</span>
            <span className="text-sm font-medium text-gray-900">
              {requirements.witnesses.current}/{requirements.witnesses.required}
            </span>
          </div>
          <div className="relative w-full h-2 bg-gray-200 rounded">
            <div
              className="absolute h-full bg-blue-900 rounded"
              style={{
                width: `${getProgress(
                  requirements.witnesses.current,
                  requirements.witnesses.required
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="font-medium">Status</span>
            {Object.values(requirements).every(
              (req) => req.current >= req.required
            ) ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-1" />
                <span className="font-medium">Elegível</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="w-5 h-5 mr-1" />
                <span className="font-medium">Pendente</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}