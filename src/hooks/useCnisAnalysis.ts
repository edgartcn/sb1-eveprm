import { useAnalysis } from '../contexts/AnalysisContext';
import { Document, Pendency, Observation } from '../types/clientContext';

export function useCnisAnalysis() {
  const { analysisContext, updateAnalysisContext } = useAnalysis();

  const updateCnisData = (cnisData: {
    contributionMonths: number;
    validatedMonths: number;
    pendingMonths: number;
    specialPeriods?: { start: string; end: string; company: string }[];
    ruralPeriods?: { start: string; end: string; property: string }[];
  }) => {
    if (!analysisContext) return;

    // Atualizar tempo de contribuição
    const contributionTime = {
      total: cnisData.contributionMonths,
      validated: cnisData.validatedMonths,
      pending: cnisData.pendingMonths
    };

    // Identificar novos benefícios elegíveis
    const eligibleBenefits = [...analysisContext.analysisStatus.eligibleBenefits];
    if (contributionTime.validated >= 180) { // 15 anos
      if (!eligibleBenefits.includes('Aposentadoria por Idade')) {
        eligibleBenefits.push('Aposentadoria por Idade');
      }
    }
    if (contributionTime.validated >= 420) { // 35 anos
      if (!eligibleBenefits.includes('Aposentadoria por Tempo de Contribuição')) {
        eligibleBenefits.push('Aposentadoria por Tempo de Contribuição');
      }
    }

    // Criar novas pendências baseadas na análise
    const newPendencies: Pendency[] = [];
    if (cnisData.pendingMonths > 0) {
      newPendencies.push({
        id: `pend-${Date.now()}`,
        type: 'document',
        description: 'Documentos comprobatórios para períodos pendentes no CNIS',
        priority: 'high',
        status: 'open',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Adicionar observações relevantes
    const newObservations: Observation[] = [];
    if (cnisData.specialPeriods?.length) {
      newObservations.push({
        id: `obs-${Date.now()}`,
        category: 'cnis',
        content: `Identificados ${cnisData.specialPeriods.length} períodos com potencial para enquadramento especial`,
        createdAt: new Date().toISOString(),
        importance: 'high'
      });
    }

    // Atualizar documentos
    const newDocuments: Document[] = [
      {
        id: `doc-${Date.now()}`,
        type: 'CNIS',
        description: 'CNIS Atualizado',
        dateReceived: new Date().toISOString(),
        status: 'validated',
        observations: cnisData.pendingMonths > 0 ? 'Períodos pendentes identificados' : undefined
      }
    ];

    // Atualizar o contexto
    updateAnalysisContext({
      analysisStatus: {
        ...analysisContext.analysisStatus,
        currentPhase: 'analysis',
        eligibleBenefits,
        contributionTime
      },
      documents: [...analysisContext.documents, ...newDocuments],
      pendencies: [...analysisContext.pendencies, ...newPendencies],
      observations: [...analysisContext.observations, ...newObservations]
    });
  };

  return {
    updateCnisData
  };
}