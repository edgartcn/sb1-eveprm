import React from 'react';
import { WorkPeriodForm } from '../rural/WorkPeriodForm';
import { DocumentUpload } from '../rural/DocumentUpload';
import { WitnessForm } from '../rural/WitnessForm';

export function RuralAnalysisContent() {
  return (
    <div className="space-y-6">
      <WorkPeriodForm />
      <DocumentUpload />
      <WitnessForm />
    </div>
  );
}