import React, { useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';

interface Witness {
  id: string;
  name: string;
  document: string;
  relationship: string;
  contact: string;
}

export function WitnessForm() {
  const [witnesses, setWitnesses] = useState<Witness[]>([
    {
      id: '1',
      name: '',
      document: '',
      relationship: '',
      contact: '',
    },
  ]);

  const addWitness = () => {
    setWitnesses([
      ...witnesses,
      {
        id: Date.now().toString(),
        name: '',
        document: '',
        relationship: '',
        contact: '',
      },
    ]);
  };

  const removeWitness = (id: string) => {
    setWitnesses(witnesses.filter((witness) => witness.id !== id));
  };

  const updateWitness = (id: string, field: keyof Witness, value: string) => {
    setWitnesses(
      witnesses.map((witness) =>
        witness.id === id ? { ...witness, [field]: value } : witness
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 text-blue-900 mr-2" />
        <h2 className="text-lg font-semibold">Testemunhas</h2>
      </div>
      <div className="space-y-4">
        {witnesses.map((witness) => (
          <div key={witness.id} className="grid grid-cols-12 gap-4 p-4 border rounded-lg">
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input
                type="text"
                value={witness.name}
                onChange={(e) => updateWitness(witness.id, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">CPF</label>
              <input
                type="text"
                value={witness.document}
                onChange={(e) => updateWitness(witness.id, 'document', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700">Relação</label>
              <select
                value={witness.relationship}
                onChange={(e) => updateWitness(witness.id, 'relationship', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione...</option>
                <option value="vizinho">Vizinho</option>
                <option value="colega">Colega de Trabalho</option>
                <option value="familiar">Familiar</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Contato</label>
              <input
                type="tel"
                value={witness.contact}
                onChange={(e) => updateWitness(witness.id, 'contact', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-1 flex items-end justify-center">
              <button
                onClick={() => removeWitness(witness.id)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={addWitness}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Testemunha
        </button>
      </div>
    </div>
  );
}