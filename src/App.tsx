import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ClientProvider } from './contexts/ClientContext';
import { AnalysisProvider } from './contexts/AnalysisContext';
import { CnisProvider } from './contexts/modules/CnisContext';
import { RuralProvider } from './contexts/modules/RuralContext';
import { PetitionProvider } from './contexts/modules/PetitionContext';
import { AppContent } from './AppContent';

export default function App() {
  return (
    <AuthProvider>
      <ClientProvider>
        <AnalysisProvider>
          <CnisProvider>
            <RuralProvider>
              <PetitionProvider>
                <AppContent />
              </PetitionProvider>
            </RuralProvider>
          </CnisProvider>
        </AnalysisProvider>
      </ClientProvider>
    </AuthProvider>
  );
}