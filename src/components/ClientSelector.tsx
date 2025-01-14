import React from 'react';
import { User } from 'lucide-react';
import { useClient } from '../contexts/ClientContext';
import { useNavigate } from '../hooks/useNavigate';

interface ClientSelectorProps {
  className?: string;
}

export function ClientSelector({ className = '' }: ClientSelectorProps) {
  const { selectedClient } = useClient();
  const { goToClientManagement } = useNavigate();

  if (!selectedClient) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md ${className}`}>
        <User className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente selecionado</h3>
        <p className="text-gray-500 text-center mb-4">
          Selecione um cliente para iniciar a análise rural
        </p>
        <button
          onClick={goToClientManagement}
          className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
        >
          Selecionar Cliente
        </button>
      </div>
    );
  }

  return null;
}