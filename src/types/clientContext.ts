export interface ClientBasicInfo {
  id: string;
  name: string;
  cpf: string;
  rg?: string;
  birthDate: string;
  gender: 'M' | 'F';
  maritalStatus: string;
  motherName: string;
  fatherName?: string;
  nit?: string; // Número de Identificação do Trabalhador
}

export interface AnalysisStatus {
  currentPhase: 'initial' | 'documentation' | 'analysis' | 'petition' | 'complete';
  eligibleBenefits: string[];
  contributionTime: {
    total: number; // em meses
    validated: number;
    pending: number;
  };
  ruralActivity: {
    total: number; // em meses
    validated: number;
    pending: number;
  };
  specialTime: {
    total: number; // em meses
    validated: number;
    pending: number;
  };
}

export interface Document {
  id: string;
  type: 'CNIS' | 'PPP' | 'CTPS' | 'RG' | 'CPF' | 'RURAL' | 'OTHER';
  description: string;
  dateReceived: string;
  status: 'pending' | 'validated' | 'rejected';
  observations?: string;
}

export interface Pendency {
  id: string;
  type: 'document' | 'information' | 'witness' | 'other';
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'resolved';
  dueDate?: string;
}

export interface Observation {
  id: string;
  category: 'general' | 'cnis' | 'rural' | 'ppp' | 'petition';
  content: string;
  createdAt: string;
  importance: 'high' | 'medium' | 'low';
}

export interface ClientContext {
  clientId: string;
  basicInfo: ClientBasicInfo;
  analysisStatus: AnalysisStatus;
  documents: Document[];
  pendencies: Pendency[];
  observations: Observation[];
  lastUpdate: string;
}