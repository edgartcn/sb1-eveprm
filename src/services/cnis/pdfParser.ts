import { CnisContribution, CnisAnalysisData } from '../../types/modules/cnis';
import { CNISProcessor } from './processor';
import * as pdfjsLib from 'pdfjs-dist';

// Configuração do worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function parseCnisPdf(file: File): Promise<CnisAnalysisData> {
  try {
    const text = await readPdfText(file);
    const processor = new CNISProcessor();
    const result = processor.processar(text);
    
    return convertToAnalysisData(result);
  } catch (error) {
    console.error('Erro ao processar CNIS:', error);
    throw new Error('Não foi possível processar o arquivo CNIS. Por favor, verifique se o arquivo está correto.');
  }
}

async function readPdfText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Erro ao ler PDF:', error);
    throw new Error('Erro ao ler o arquivo PDF. Verifique se o arquivo não está corrompido.');
  }
}

function convertToAnalysisData(result: any): CnisAnalysisData {
  const contributions: CnisContribution[] = [];
  let totalValue = 0;
  
  // Processa os vínculos e remunerações
  result.vinculos.forEach((vinculo: any) => {
    vinculo.remuneracoes.forEach((rem: any) => {
      contributions.push({
        competencia: rem.competencia,
        empresa: vinculo.empresa.nome,
        cnpj: vinculo.empresa.codigo,
        tipo: 'normal',
        remuneracao: rem.valor,
        status: 'regular'
      });
      totalValue += rem.valor;
    });
  });

  const totalMonths = contributions.length;
  
  return {
    clientId: '',
    contributions,
    summary: {
      totalMonths,
      regularMonths: totalMonths, // Inicialmente considera todos regulares
      irregularMonths: 0,
      pendingMonths: 0,
      totalContributions: totalValue,
      averageContribution: totalValue / totalMonths || 0
    },
    specialPeriods: [],
    ruralPeriods: [],
    lastUpdate: new Date().toISOString()
  };
}