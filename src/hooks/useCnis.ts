import { useContext } from 'react';
import { CnisContext } from '../contexts/modules/CnisContext';

export function useCnis() {
  const context = useContext(CnisContext);
  if (context === undefined) {
    throw new Error('useCnis must be used within a CnisProvider');
  }
  return context;
}