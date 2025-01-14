import React, { createContext, useContext, useState } from 'react';
import { PetitionData, PetitionTemplate } from '../../types/modules/petition';

interface PetitionContextType {
  petitionData: Record<string, PetitionData[]>;
  templates: PetitionTemplate[];
  updatePetitionData: (clientId: string, petitionId: string, data: Partial<PetitionData>) => void;
  createPetition: (clientId: string, templateId: string) => PetitionData;
  getPetitions: (clientId: string) => PetitionData[];
  getTemplate: (templateId: string) => PetitionTemplate | null;
}

const PetitionContext = createContext<PetitionContextType | undefined>(undefined);

export function PetitionProvider({ children }: { children: React.ReactNode }) {
  const [petitionData, setPetitionData] = useState<Record<string, PetitionData[]>>({});
  const [templates, setTemplates] = useState<PetitionTemplate[]>([]);

  const updatePetitionData = (clientId: string, petitionId: string, data: Partial<PetitionData>) => {
    setPetitionData(current => ({
      ...current,
      [clientId]: (current[clientId] || []).map(petition =>
        petition.id === petitionId
          ? { ...petition, ...data, updatedAt: new Date().toISOString() }
          : petition
      )
    }));
  };

  const createPetition = (clientId: string, templateId: string): PetitionData => {
    const newPetition: PetitionData = {
      id: `petition-${Date.now()}`,
      clientId,
      templateId,
      title: '',
      content: '',
      variables: {},
      status: 'rascunho',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPetitionData(current => ({
      ...current,
      [clientId]: [...(current[clientId] || []), newPetition]
    }));

    return newPetition;
  };

  const getPetitions = (clientId: string) => petitionData[clientId] || [];

  const getTemplate = (templateId: string) =>
    templates.find(template => template.id === templateId) || null;

  return (
    <PetitionContext.Provider value={{
      petitionData,
      templates,
      updatePetitionData,
      createPetition,
      getPetitions,
      getTemplate
    }}>
      {children}
    </PetitionContext.Provider>
  );
}

export function usePetition() {
  const context = useContext(PetitionContext);
  if (context === undefined) {
    throw new Error('usePetition must be used within a PetitionProvider');
  }
  return context;
}