import { describe, it, expect, beforeAll } from 'vitest';
import { parseCnisPdf } from '../pdfParser';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker for tests
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

describe('CNIS PDF Parser', () => {
  let samplePdfFile: File;

  beforeAll(async () => {
    // Create a sample PDF with CNIS content
    const pdfContent = `
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

    // Create a PDF file blob
    const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });
    samplePdfFile = new File([pdfBlob], 'sample-cnis.pdf', { type: 'application/pdf' });
  });

  it('deve processar um arquivo PDF do CNIS corretamente', async () => {
    const result = await parseCnisPdf(samplePdfFile);

    // Verifica a estrutura básica do resultado
    expect(result).toHaveProperty('clientId');
    expect(result).toHaveProperty('contributions');
    expect(result).toHaveProperty('summary');
    expect(result).toHaveProperty('specialPeriods');
    expect(result).toHaveProperty('ruralPeriods');
    expect(result).toHaveProperty('lastUpdate');

    // Verifica as contribuições
    expect(result.contributions).toHaveLength(12);
    expect(result.contributions[0]).toMatchObject({
      competencia: '01/2020',
      empresa: 'EMPRESA ABC LTDA',
      cnpj: '12.345.678/0001-90',
      tipo: 'normal',
      remuneracao: 1500.00,
      status: 'regular'
    });

    // Verifica o sumário
    expect(result.summary).toMatchObject({
      totalMonths: 12,
      regularMonths: 12,
      irregularMonths: 0,
      pendingMonths: 0,
      totalContributions: 18000.00, // 12 * 1500
      averageContribution: 1500.00
    });
  });

  it('deve rejeitar arquivos que não são PDF', async () => {
    const invalidFile = new File(['not a pdf'], 'test.txt', { type: 'text/plain' });
    await expect(parseCnisPdf(invalidFile)).rejects.toThrow('O arquivo deve ser um PDF válido');
  });

  it('deve lidar com PDFs sem texto legível', async () => {
    const emptyPdfBlob = new Blob([''], { type: 'application/pdf' });
    const emptyPdfFile = new File([emptyPdfBlob], 'empty.pdf', { type: 'application/pdf' });
    await expect(parseCnisPdf(emptyPdfFile)).rejects.toThrow('O PDF não contém texto legível');
  });

  it('deve lidar com PDFs com formato CNIS inválido', async () => {
    const invalidContentBlob = new Blob(['Texto qualquer que não é um CNIS'], { type: 'application/pdf' });
    const invalidFile = new File([invalidContentBlob], 'invalid.pdf', { type: 'application/pdf' });
    await expect(parseCnisPdf(invalidFile)).rejects.toThrow('Não foi possível identificar os dados do segurado no CNIS');
  });
});