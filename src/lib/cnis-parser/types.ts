export interface Segurado {
  nome: string;
  cpf: string;
  nit: string;
  dataNascimento: string;
  nomeMae: string;
}

export interface Empresa {
  codigo: string;
  nome: string;
  tipo: string;
}

export interface Remuneracao {
  competencia: string;
  valor: number;
  indicadores: string[];
  contratante?: string;
  estabelecimento?: string;
  formaPrestacaoServico?: string;
}

export interface Vinculo {
  sequencial: string;
  nit: string;
  empresa: Empresa;
  tipoVinculo: string;
  dataInicio: string;
  dataFim?: string;
  matricula?: string;
  indicadores: string[];
  remuneracoes: Remuneracao[];
}

export interface PeriodosTotais {
  tempoContribuicao: number;
  carencia: number;
}

export interface CNISData {
  segurado: Segurado;
  vinculos: Vinculo[];
  beneficios: any[];
  periodosTotais: PeriodosTotais;
}