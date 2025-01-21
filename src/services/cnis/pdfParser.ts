import { CnisContribution, CnisAnalysisData } from '../../types/modules/cnis';
import { CNISProcessor } from './processor';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export async function parseCnisPdf(file: File): Promise<CnisAnalysisData> {
  try {
    const text = await readPdfText(file);
    const processor = new CNISProcessor();
    const result = processor.processar(text);
    
    return convertToAnalysisData(result);
  } catch (error) {
    console.error('Erro ao processar CNIS:', error);
    if (error instanceof Error) {
      throw new Error(`Não foi possível processar o arquivo CNIS: ${error.message}`);
    }
    throw new Error('Não foi possível processar o arquivo CNIS. Por favor, verifique se o arquivo está correto.');
  }
}

async function readPdfText(file: File): Promise<string> {
  if (!file || file.type !== 'application/pdf') {
    throw new Error('O arquivo deve ser um PDF válido');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ');
      fullText += pageText + '\n';
    }
    
    if (!fullText.trim()) {
      throw new Error('O PDF não contém texto legível');
    }
    
    return fullText;
  } catch (error) {
    console.error('Erro ao ler PDF:', error);
    if (error instanceof Error) {
      throw new Error(`Erro ao ler o arquivo PDF: ${error.message}`);
    }
    throw new Error('Erro ao ler o arquivo PDF. Verifique se o arquivo não está corrompido.');
  }
}

function convertToAnalysisData(result: any): CnisAnalysisData {
  if (!result || !result.vinculos) {
    throw new Error('Dados do CNIS inválidos ou incompletos');
  }

  const contributions: CnisContribution[] = [];
  let totalValue = 0;
  
  // Processa os vínculos e remunerações
  result.vinculos.forEach((vinculo: any) => {
    if (vinculo.remuneracoes && Array.isArray(vinculo.remuneracoes)) {
      vinculo.remuneracoes.forEach((rem: any) => {
        if (rem.competencia && typeof rem.valor === 'number') {
          contributions.push({
            competencia: rem.competencia,
            empresa: vinculo.empresa?.nome || 'Empresa não identificada',
            cnpj: vinculo.empresa?.codigo || '',
            tipo: 'normal',
            remuneracao: rem.valor,
            status: 'regular'
          });
          totalValue += rem.valor;
        }
      });
    }
  });

  const totalMonths = contributions.length;
  
  if (totalMonths === 0) {
    throw new Error('Nenhuma contribuição encontrada no CNIS');
  }
  
  return {
    clientId: '',
    contributions,
    summary: {
      totalMonths,
      regularMonths: totalMonths,
      irregularMonths: 0,
      pendingMonths: 0,
      totalContributions: totalValue,
      averageContribution: totalValue / totalMonths
    },
    specialPeriods: [],
    ruralPeriods: [],
    lastUpdate: new Date().toISOString()
  };
}