import React, { useState } from 'react';
import { X, Wand2 } from 'lucide-react';
import { PetitionTemplate, PetitionData } from '../../types/petition';
import { petitionTemplates } from '../../data/petitionTemplates';

interface GeneratePetitionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (content: string) => void;
}

export function GeneratePetitionDialog({ isOpen, onClose, onGenerate }: GeneratePetitionDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PetitionTemplate | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    try {
      // Here you would integrate with your chosen LLM API
      const petitionContent = `Exemplo de petição gerada para ${selectedTemplate.name}...`;
      onGenerate(petitionContent);
      onClose();
    } catch (error) {
      console.error('Erro ao gerar petição:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Gerar Petição com IA</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!selectedTemplate ? (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Selecione um modelo:</h3>
              <div className="grid gap-4">
                {petitionTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className="text-left p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50"
                  >
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedTemplate.prompts.map((prompt) => (
                <div key={prompt.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {prompt.question}
                  </label>
                  {prompt.type === 'select' ? (
                    <select
                      className="w-full border-gray-300 rounded-md shadow-sm"
                      value={answers[prompt.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [prompt.id]: e.target.value })}
                    >
                      <option value="">Selecione...</option>
                      {prompt.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : prompt.type === 'date' ? (
                    <input
                      type="date"
                      className="w-full border-gray-300 rounded-md shadow-sm"
                      value={answers[prompt.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [prompt.id]: e.target.value })}
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-md shadow-sm"
                      value={answers[prompt.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [prompt.id]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end items-center gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancelar
          </button>
          {selectedTemplate && (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isGenerating ? 'Gerando...' : 'Gerar Petição'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}