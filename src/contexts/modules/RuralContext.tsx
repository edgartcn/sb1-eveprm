import React, { createContext, useContext, useState } from 'react';
import { RuralAnalysisData } from '../../types/modules/rural';

interface RuralContextType {
  ruralData: Record<string, RuralAnalysisData>;
  updateRuralData: (clientId: string, data: Partial<RuralAnalysisData>) => void;
  getRuralData: (clientId: string) => RuralAnalysisData | null;
}

const RuralContext = createContext<RuralContextType | undefined>(undefined);

export function RuralProvider({ children }: { children: React.ReactNode }) {
  const [ruralData, setRuralData] = useState<Record<string, RuralAnalysisData>>({});

  const updateRuralData = (clientId: string, data: Partial<RuralAnalysisData>) => {
    setRuralData(current => ({
      ...current,
      [clientId]: {
        ...current[clientId],
        ...data,
        lastUpdate: new Date().toISOString()
      }
    }));
  };

  const getRuralData = (clientId: string) => ruralData[clientId] || null;

  return (
    <RuralContext.Provider value={{ ruralData, updateRuralData, getRuralData }}>
      {children}
    </RuralContext.Provider>
  );
}

export function useRural() {
  const context = useContext(RuralContext);
  if (context === undefined) {
    throw new Error('useRural must be used within a RuralProvider');
  }
  return context;
}