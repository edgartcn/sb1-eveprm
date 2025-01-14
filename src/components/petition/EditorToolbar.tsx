import React from 'react';
import { FileText, Users, Calendar } from 'lucide-react';

export function EditorToolbar() {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center space-x-6">
        <div className="flex items-center">
          <FileText className="w-4 h-4 text-gray-500 mr-2" />
          <select className="form-select border-gray-300 rounded-md text-sm">
            <option>Aposentadoria por Tempo de Contribuição</option>
            <option>Aposentadoria por Idade</option>
            <option>Auxílio-Doença</option>
            <option>Pensão por Morte</option>
          </select>
        </div>

        <div className="flex items-center">
          <Users className="w-4 h-4 text-gray-500 mr-2" />
          <select className="form-select border-gray-300 rounded-md text-sm">
            <option>Selecionar Cliente</option>
            <option>João Silva</option>
            <option>Maria Santos</option>
          </select>
        </div>

        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="date"
            className="form-input border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  );
}