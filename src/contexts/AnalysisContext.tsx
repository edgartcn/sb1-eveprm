import React, { createContext, useContext, useState } from 'react';
import { ClientContext } from '../types/clientContext';

interface AnalysisContextType {
  analysisContext: ClientContext | null;
  setAnalysisContext: (context: ClientContext | null) => void;
  updateAnalysisContext: (updates: Partial<ClientContext>) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [analysisContext, setAnalysisContext] = useState<ClientContext | null>(null);

  const updateAnalysisContext = (updates: Partial<ClientContext>) => {
    if (!analysisContext) return;
    
    setAnalysisContext({
      ...analysisContext,
      ...updates,
      lastUpdate: new Date().toISOString()
    });
  };

  return (
    <AnalysisContext.Provider value={{ analysisContext, setAnalysisContext, updateAnalysisContext }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}