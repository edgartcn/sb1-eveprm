export interface RuralWorkPeriod {
  id: string;
  startDate: string;
  endDate: string;
  property: string;
  propertyLocation: string;
  activity: 'agricultura' | 'pecuaria' | 'pesca' | 'extrativismo';
  regime: 'individual' | 'economia_familiar' | 'parceria' | 'arrendamento';
  documentType: string;
  documentNumber?: string;
  status: 'pendente' | 'validado' | 'rejeitado';
}

export interface RuralDocument {
  id: string;
  type: string;
  number?: string;
  issueDate: string;
  validityDate?: string;
  issuingBody: string;
  status: 'pendente' | 'validado' | 'rejeitado';
  observations?: string;
}

export interface RuralWitness {
  id: string;
  name: string;
  cpf: string;
  relationship: string;
  contact: string;
  address: string;
  statement?: string;
  validationStatus: 'pendente' | 'validado' | 'rejeitado';
}

export interface RuralAnalysisData {
  clientId: string;
  workPeriods: RuralWorkPeriod[];
  documents: RuralDocument[];
  witnesses: RuralWitness[];
  requirements: {
    age: {
      required: number;
      current: number;
    };
    ruralWork: {
      required: number;
      current: number;
    };
    documents: {
      required: number;
      current: number;
    };
    witnesses: {
      required: number;
      current: number;
    };
  };
  status: 'em_analise' | 'elegivel' | 'nao_elegivel';
  observations: string[];
  lastUpdate: string;
}