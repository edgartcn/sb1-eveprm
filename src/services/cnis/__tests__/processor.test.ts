import { describe, it, expect } from 'vitest';
import { CNISProcessor } from '../processor';

describe('CNISProcessor', () => {
  const processor = new CNISProcessor();

  // Texto CNIS atualizado para corresponder ao formato real
  const sampleCNISText = `
INSS - CNIS
Cadastro Nacional de Informações Sociais
Extrato Previdenciário

NIT: 123.45678.90-1    CPF: 123.456.789-00
Nome: JOAO DA SILVA
Data de nascimento: 01/01/1980
Nome da mãe: MARIA DA SILVA

Seq. 1    NIT: 123.45678.90-1
Código Emp.: 12.345.678/0001-90
Origem do Vínculo: EMPRESA ABC LTDA
Tipo Filiado no Vínculo: EMPREGADO
Data de Início: 01/01/2020
Data de Fim: 31/12/2020

Remunerações:
01/2020    1500,00
02/2020    1500,00    13
03/2020    1500,00
04/2020    1500,00
05/2020    1500,00
06/2020    1500,00    FERIAS
07/2020    1500,00
08/2020    1500,00
09/2020    1500,00
10/2020    1500,00
11/2020    1500,00
12/2020    1500,00    13
`;

  it('deve processar dados do segurado corretamente', () => {
    const result = processor.processar(sampleCNISText);

    expect(result.segurado).toEqual({
      nit: '123.45678.90-1',
      cpf: '123.456.789-00',
      nome: 'JOAO DA SILVA',
      dataNascimento: '01/01/1980',
      nomeMae: 'MARIA DA SILVA'
    });
  });

  it('deve processar vínculos empregatícios corretamente', () => {
    const result = processor.processar(sampleCNISText);

    expect(result.vinculos).toHaveLength(1);
    expect(result.vinculos[0]).toMatchObject({
      sequencial: '1',
      nit: '123.45678.90-1',
      empresa: {
        codigo: '12.345.678/0001-90',
        nome: 'EMPRESA ABC LTDA',
        tipo: 'Empregador'
      },
      tipoVinculo: 'EMPREGADO',
      dataInicio: '01/01/2020',
      dataFim: '31/12/2020'
    });
  });

  it('deve processar remunerações corretamente', () => {
    const result = processor.processar(sampleCNISText);

    expect(result.vinculos[0].remuneracoes).toHaveLength(12);
    
    // Verifica primeira remuneração
    expect(result.vinculos[0].remuneracoes[0]).toMatchObject({
      competencia: '01/2020',
      valor: 1500.00,
      indicadores: []
    });

    // Verifica remuneração com 13º
    expect(result.vinculos[0].remuneracoes[1]).toMatchObject({
      competencia: '02/2020',
      valor: 1500.00,
      indicadores: ['13']
    });

    // Verifica remuneração com férias
    expect(result.vinculos[0].remuneracoes[5]).toMatchObject({
      competencia: '06/2020',
      valor: 1500.00,
      indicadores: ['FERIAS']
    });
  });

  it('deve calcular períodos totais corretamente', () => {
    const result = processor.processar(sampleCNISText);

    expect(result.periodosTotais).toMatchObject({
      tempoContribuicao: 12, // 12 meses
      carencia: 12 // 12 competências com contribuição
    });
  });

  it('deve lidar com texto CNIS inválido', () => {
    expect(() => processor.processar('')).toThrow('Texto do CNIS inválido ou vazio');
    expect(() => processor.processar('Texto inválido')).toThrow('Não foi possível identificar os dados do segurado no CNIS');
  });

  it('deve lidar com vínculos sem remunerações', () => {
    const textSemRemuneracoes = `
NIT: 123.45678.90-1    CPF: 123.456.789-00
Nome: JOAO DA SILVA
Data de nascimento: 01/01/1980
Nome da mãe: MARIA DA SILVA

Seq. 1    NIT: 123.45678.90-1
Código Emp.: 12.345.678/0001-90
Origem do Vínculo: EMPRESA ABC LTDA
Tipo Filiado no Vínculo: EMPREGADO
Data de Início: 01/01/2020
Data de Fim: 31/12/2020
`;

    expect(() => processor.processar(textSemRemuneracoes))
      .toThrow('Nenhum vínculo encontrado no CNIS');
  });
});