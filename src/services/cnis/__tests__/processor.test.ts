import { describe, it, expect } from 'vitest';
import { CNISProcessor } from '../processor';
import { CNISData } from '../types';

describe('CNISProcessor', () => {
  const processor = new CNISProcessor();

  // Exemplo de texto CNIS para teste
  const sampleCNISText = `
    NIT: 123.45678.90-1 CPF: 123.456.789-00
    Nome: JOAO DA SILVA
    Data de nascimento: 01/01/1980
    Nome da mãe: MARIA DA SILVA

    Seq. 1 NIT 123.45678.90-1
    Código Emp. 12.345.678/0001-90
    Origem do Vínculo EMPRESA ABC LTDA
    Tipo Filiado no Vínculo EMPREGADO
    Data Inicio 01/01/2020
    Data Fim 31/12/2020

    01/2020 1500,00
    02/2020 1500,00 13
    03/2020 1500,00
    04/2020 1500,00
    05/2020 1500,00
    06/2020 1500,00 FERIAS
    07/2020 1500,00
    08/2020 1500,00
    09/2020 1500,00
    10/2020 1500,00
    11/2020 1500,00
    12/2020 1500,00 13
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
    expect(result.vinculos[0].remuneracoes[0]).toMatchObject({
      competencia: '01/2020',
      valor: 1500.00,
      indicadores: []
    });
    expect(result.vinculos[0].remuneracoes[1]).toMatchObject({
      competencia: '02/2020',
      valor: 1500.00,
      indicadores: ['13']
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
    expect(() => processor.processar('Texto inválido')).toThrow();
  });
});