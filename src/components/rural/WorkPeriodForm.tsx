import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useRuralAnalysis } from '../../hooks/useRuralAnalysis';
import { RuralWorkPeriod } from '../../types/modules/rural';

export function WorkPeriodForm() {
  const { analysisData, addWorkPeriod, isLoading } = useRuralAnalysis();
  const [formData, setFormData] = useState<Omit<RuralWorkPeriod, 'id'>>({
    startDate: '',
    endDate: '',
    property: '',
    propertyLocation: '',
    activity: 'agricultura',
    regime: 'individual',
    documentType: '',
    status: 'pendente'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addWorkPeriod(formData);
      setFormData({
        startDate: '',
        endDate: '',
        property: '',
        propertyLocation: '',
        activity: 'agricultura',
        regime: 'individual',
        documentType: '',
        status: 'pendente'
      });
    } catch (error) {
      console.error('Error adding work period:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Períodos de Trabalho Rural</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Início</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Fim</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Propriedade</label>
            <input
              type="text"
              value={formData.property}
              onChange={(e) => setFormData({ ...formData, property: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Localização</label>
            <input
              type="text"
              value={formData.propertyLocation}
              onChange={(e) => setFormData({ ...formData, propertyLocation: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Atividade</label>
            <select
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value as any })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="agricultura">Agricultura</option>
              <option value="pecuaria">Pecuária</option>
              <option value="pesca">Pesca</option>
              <option value="extrativismo">Extrativismo</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Regime</label>
            <select
              value={formData.regime}
              onChange={(e) => setFormData({ ...formData, regime: e.target.value as any })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="individual">Individual</option>
              <option value="economia_familiar">Economia Familiar</option>
              <option value="parceria">Parceria</option>
              <option value="arrendamento">Arrendamento</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Documento Comprobatório</label>
          <input
            type="text"
            value={formData.documentType}
            onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ex: Contrato de Parceria, Bloco de Produtor..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Período
          </button>
        </div>
      </form>

      {analysisData?.workPeriods && analysisData.workPeriods.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Períodos Cadastrados</h3>
          <div className="space-y-2">
            {analysisData.workPeriods.map((period) => (
              <div
                key={period.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{period.property}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(period.startDate).toLocaleDateString()} - 
                    {period.endDate ? new Date(period.endDate).toLocaleDateString() : 'Atual'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    period.status === 'validado' 
                      ? 'bg-green-100 text-green-800'
                      : period.status === 'rejeitado'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {period.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}