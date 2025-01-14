export interface PetitionTemplate {
  id: string;
  name: string;
  description: string;
  prompts: PetitionPrompt[];
}

export interface PetitionPrompt {
  id: string;
  question: string;
  type: 'text' | 'date' | 'select';
  options?: string[];
}

export interface PetitionData {
  benefitType: string;
  clientName: string;
  clientDocument: string;
  clientBirthDate: string;
  [key: string]: string;
}