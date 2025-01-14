export interface PetitionTemplate {
  id: string;
  name: string;
  description: string;
  category: 'aposentadoria' | 'auxilio' | 'pensao' | 'outros';
  structure: {
    sections: PetitionSection[];
    variables: PetitionVariable[];
  };
  requirements: string[];
}

export interface PetitionSection {
  id: string;
  title: string;
  content: string;
  order: number;
  isRequired: boolean;
  variables?: string[]; // IDs das variáveis utilizadas
}

export interface PetitionVariable {
  id: string;
  name: string;
  type: 'text' | 'date' | 'number' | 'select';
  description: string;
  options?: string[]; // Para variáveis do tipo select
  defaultValue?: string;
  validation?: {
    required: boolean;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface PetitionData {
  id: string;
  clientId: string;
  templateId: string;
  title: string;
  content: string;
  variables: Record<string, string>; // Valores das variáveis
  status: 'rascunho' | 'concluida' | 'protocolada';
  createdAt: string;
  updatedAt: string;
  protocolNumber?: string;
  protocolDate?: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}