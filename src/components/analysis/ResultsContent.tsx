import React from 'react';
import { CheckCircle, AlertCircle, Clock, Calendar } from 'lucide-react';

export function ResultsContent() {
  const benefits = [
    {
      type: 'Aposentadoria por Tempo de Contribuição',
      status: 'eligible',
      requirements: {
        time: '35 anos',
        current: '36 anos',
        age: '62 anos',
      },
    },
    {
      type: 'Aposentadoria Rural',
      status: 'pending',
      requirements: {
        time: '15 anos',
        current: '12 anos',
        age: '60 anos',
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit) => (
          <div
            key={benefit.type}
            className={`p-6 rounded-lg ${
              benefit.status === 'eligible' ? 'bg-green-50' : 'bg-yellow-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  {benefit.status === 'eligible' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                  <h3 className="font-medium text-gray-900">{benefit.type}</h3>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tempo Necessário:</span>
                    <span className="font-medium">{benefit.requirements.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tempo Atual:</span>
                    <span className="font-medium">{benefit.requirements.current}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Idade Mínima:</span>
                    <span className="font-medium">{benefit.requirements.age}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Recomendações</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <Clock className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
            <span className="text-blue-900">
              Aguardar mais 3 anos para atingir o tempo mínimo de contribuição rural
            </span>
          </li>
          <li className="flex items-start">
            <Calendar className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
            <span className="text-blue-900">
              Recolher contribuições em atraso do período de 01/2019 a 06/2019
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}