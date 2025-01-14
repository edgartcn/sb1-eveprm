import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useClient } from '../contexts/ClientContext';
import { ClientSwitcher } from './ClientSwitcher';

interface ClientHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  actions?: React.ReactNode;
}

export function ClientHeader({ title, subtitle, onBack, actions }: ClientHeaderProps) {
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </button>
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-blue-200 text-sm">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ClientSwitcher />
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}