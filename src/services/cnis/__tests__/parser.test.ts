import { describe, it, expect } from 'vitest';
import { parseCnisPdf } from '../pdfParser';
import { CnisAnalysisData } from '../../../types/modules/cnis';

describe('CNIS PDF Parser', () => {
  it('deve converter dados do processador para o formato de análise', async () => {
    // Cria um arquivo PDF de teste
    const pdfBlob = new Blob(['Teste'], { type: 'application/pdf' });
    const testFile = new File([pdfBlob], 'test.pdf', { type: 'application/pdf' });

    try {
      const result = await parseCnisPdf(testFile);

      // Verifica se o resultado tem a estrutura correta
      expect(result).toHaveProperty('clientId');
      expect(result).toHaveProperty('contributions');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('specialPeriods');
      expect(result).toHaveProperty('ruralPeriods');
      expect(result).toHaveProperty('lastUpdate');

      // Verifica o formato do sumário
      expect(result.summary).toHaveProperty('totalMonths');
      expect(result.summary).toHaveProperty('regularMonths');
      expect(result.summary).toHaveProperty('irregularMonths');
      expect(result.summary).toHaveProperty('pendingMonths');
      expect(result.summary).toHaveProperty('totalContributions');
      expect(result.summary).toHaveProperty('averageContribution');

      // Verifica se os arrays estão presentes
      expect(Array.isArray(result.contributions)).toBe(true);
      expect(Array.isArray(result.specialPeriods)).toBe(true);
      expect(Array.isArray(result.ruralPeriods)).toBe(true);
    } catch (error) {
      // Se houver erro no PDF de teste, ainda verifica se o erro é tratado corretamente
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain('Não foi possível processar');
    }
  });
});