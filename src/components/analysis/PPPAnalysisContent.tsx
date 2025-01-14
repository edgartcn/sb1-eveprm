import React from 'react';
import { Upload, Clock, Shield } from 'lucide-react';

export function PPPAnalysisContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Upload className="w-5 h-5 text-blue-700" />
            <h3 className="font-medium text-blue-900">Documentos PPP</h3>
          </div>
          <p className="text-sm text-blue-800">2 documentos anexados</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-green-700" />
            <h3 className="font-medium text-green-900">Tempo Especial</h3>
          </div>
          <p className="text-sm text-green-800">5 anos, 3 meses e 15 dias</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-purple-700" />
            <h3 className="font-medium text-purple-900">Agentes Nocivos</h3>
          </div>
          <p className="text-sm text-purple-800">Ruído, Calor, Químicos</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Períodos Analisados</h3>
        <div className="space-y-4">
          {[1, 2].map((period) => (
            <div key={period} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Período</p>
                  <p className="font-medium">01/2015 - 12/2020</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Empresa</p>
                  <p className="font-medium">Indústria ABC Ltda</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Função</p>
                  <p className="font-medium">Operador de Máquinas</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agentes Nocivos</p>
                  <p className="font-medium">Ruído: 87 dB(A)</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}