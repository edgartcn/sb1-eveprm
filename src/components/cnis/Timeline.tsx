import React from 'react';
import { Loader } from 'lucide-react';

interface TimelineProps {
  isLoading: boolean;
}

export function Timeline({ isLoading }: TimelineProps) {
  const timelineData = [
    { year: 2023, status: 'regular', months: 12 },
    { year: 2022, status: 'regular', months: 12 },
    { year: 2021, status: 'irregular', months: 8 },
    { year: 2020, status: 'regular', months: 12 },
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-48">
          <Loader className="w-8 h-8 text-blue-900 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Linha do Tempo Contributiva</h2>
      <div className="flex items-center space-x-4 overflow-x-auto pb-4">
        {timelineData.map((item) => (
          <div
            key={item.year}
            className={`flex-shrink-0 w-32 p-4 rounded-lg ${
              item.status === 'regular' ? 'bg-green-50' : 'bg-yellow-50'
            }`}
          >
            <div className="text-lg font-semibold">{item.year}</div>
            <div
              className={`text-sm ${
                item.status === 'regular' ? 'text-green-700' : 'text-yellow-700'
              }`}
            >
              {item.months} meses
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}