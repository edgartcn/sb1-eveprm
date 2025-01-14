import React from 'react';
import { Timeline } from '../cnis/Timeline';
import { ContributionsTable } from '../cnis/ContributionsTable';
import { AnalysisResults } from '../cnis/AnalysisResults';

export function CNISAnalysisContent() {
  return (
    <div className="space-y-6">
      <Timeline isLoading={false} />
      <ContributionsTable isLoading={false} />
      <AnalysisResults isLoading={false} />
    </div>
  );
}