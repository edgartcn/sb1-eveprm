import { PetitionTemplate } from '../types/petition';

export const petitionTemplates: PetitionTemplate[] = [
  {
    id: 'aposentadoria-tempo',
    name: 'Aposentadoria por Tempo de Contribuição',
    description: 'Petição inicial para aposentadoria por tempo de contribuição',
    prompts: [
      {
        id: 'tempo-total',
        question: 'Qual o tempo total de contribuição do segurado?',
        type: 'text'
      },
      {
        id: 'ultima-contribuicao',
        question: 'Data da última contribuição',
        type: 'date'
      },
      {
        id: 'carencia-cumprida',
        question: 'A carência de 180 contribuições foi cumprida?',
        type: 'select',
        options: ['Sim', 'Não']
      }
    ]
  },
  {
    id: 'auxilio-doenca',
    name: 'Auxílio-Doença',
    description: 'Petição inicial para concessão de auxílio-doença',
    prompts: [
      {
        id: 'doenca',
        question: 'Qual a doença ou lesão que incapacita o segurado?',
        type: 'text'
      },
      {
        id: 'inicio-incapacidade',
        question: 'Data de início da incapacidade',
        type: 'date'
      },
      {
        id: 'possui-laudo',
        question: 'Possui laudo médico comprovando a incapacidade?',
        type: 'select',
        options: ['Sim', 'Não']
      }
    ]
  }
];