export interface CnisContribution {
  competencia: string;
  empresa: string;
  cnpj?: string;
  tipo: string;
  remuneracao: number;
  status: 'regular' | 'pendente' | 'irregular';
  observacoes?: string;
}

export interface CnisAnalysisData {
  clientId: string;
  contributions: CnisContribution[];
  summary: {
    totalMonths: number;
    regularMonths: number;
    irregularMonths: number;
    pendingMonths: number;
    totalContributions: number;
    averageContribution: number;
  };
  specialPeriods: {
    start: string;
    end: string;
    company: string;
    activity: string;
    agent: string;
  }[];
  ruralPeriods: {
    start: string;
    end: string;
    property: string;
    activity: string;
  }[];
  lastUpdate: string;
}