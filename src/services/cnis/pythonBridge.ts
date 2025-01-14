import { CnisAnalysisData } from '../../types/modules/cnis';

const PYTHON_API_URL = 'http://localhost:5000/process-cnis';

export async function processPdfWithPython(file: File): Promise<CnisAnalysisData> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(PYTHON_API_URL, {
      method: 'POST',
      body: formData,
      // Adiciona timeout de 10 segundos
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Falha ao processar o arquivo');
    }

    const data = await response.json();
    return validateAndNormalizeData(data);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Tempo limite excedido ao tentar processar o arquivo');
      }
      throw new Error(`Erro ao processar arquivo: ${error.message}`);
    }
    throw new Error('Erro desconhecido ao processar arquivo');
  }
}

function validateAndNormalizeData(data: any): CnisAnalysisData {
  // Validação básica dos dados
  if (!data.contributions || !Array.isArray(data.contributions)) {
    throw new Error('Dados inválidos: contribuições não encontradas');
  }

  if (!data.summary || typeof data.summary !== 'object') {
    throw new Error('Dados inválidos: sumário não encontrado');
  }

  // Normaliza os dados
  return {
    clientId: data.clientId || '',
    contributions: data.contributions.map((c: any) => ({
      competencia: c.competencia || '',
      empresa: c.empresa || '',
      cnpj: c.cnpj || '',
      tipo: c.tipo || 'normal',
      remuneracao: Number(c.remuneracao) || 0,
      status: c.status || 'regular'
    })),
    summary: {
      totalMonths: Number(data.summary.totalMonths) || 0,
      regularMonths: Number(data.summary.regularMonths) || 0,
      irregularMonths: Number(data.summary.irregularMonths) || 0,
      pendingMonths: Number(data.summary.pendingMonths) || 0,
      totalContributions: Number(data.summary.totalContributions) || 0,
      averageContribution: Number(data.summary.averageContribution) || 0
    },
    specialPeriods: Array.isArray(data.specialPeriods) ? data.specialPeriods : [],
    ruralPeriods: Array.isArray(data.ruralPeriods) ? data.ruralPeriods : [],
    lastUpdate: data.lastUpdate || new Date().toISOString()
  };
}