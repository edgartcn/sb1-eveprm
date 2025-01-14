import React, { createContext, useContext, useState } from 'react';
import { CnisAnalysisData } from '../../types/modules/cnis';

interface CnisContextType {
  cnisData: Record<string, CnisAnalysisData>;
  updateCnisData: (clientId: string, data: Partial<CnisAnalysisData>) => void;
  getCnisData: (clientId: string) => CnisAnalysisData | null;
}

export const CnisContext = createContext<CnisContextType | undefined>(undefined);

export function CnisProvider({ children }: { children: React.ReactNode }) {
  const [cnisData, setCnisData] = useState<Record<string, CnisAnalysisData>>({});

  const updateCnisData = (clientId: string, data: Partial<CnisAnalysisData>) => {
    setCnisData(current => ({
      ...current,
      [clientId]: {
        ...current[clientId],
        ...data,
        lastUpdate: new Date().toISOString()
      }
    }));
  };

  const getCnisData = (clientId: string) => cnisData[clientId] || null;

  return (
    <CnisContext.Provider value={{ cnisData, updateCnisData, getCnisData }}>
      {children}
    </CnisContext.Provider>
  );
}

export function useCnis() {
  const context = useContext(CnisContext);
  if (context === undefined) {
    throw new Error('useCnis must be used within a CnisProvider');
  }
  return context;
}