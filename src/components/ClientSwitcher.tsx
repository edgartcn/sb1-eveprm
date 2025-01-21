import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Search, AlertCircle } from 'lucide-react';
import { useClientStore } from '../lib/store';
import { useClients } from '../lib/queries';

export function ClientSwitcher() {
  const { selectedClient, setSelectedClient } = useClientStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: clients, isLoading, error, refetch } = useClients();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredClients = clients?.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpf?.includes(searchTerm) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-blue-800 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium">
          {selectedClient ? selectedClient.name : 'Selecionar Cliente'}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full mx-auto mb-2"></div>
                Carregando clientes...
              </div>
            ) : error ? (
              <div className="p-4">
                <div className="flex items-center justify-center text-red-600 mb-2">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>Erro ao carregar clientes</span>
                </div>
                <button
                  onClick={() => refetch()}
                  className="w-full px-4 py-2 text-sm text-blue-900 hover:bg-blue-50 rounded-md"
                >
                  Tentar novamente
                </button>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </div>
            ) : (
              <div className="py-2">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                      selectedClient?.id === client.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    {client.cpf && (
                      <div className="text-xs text-gray-500">CPF: {client.cpf}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}