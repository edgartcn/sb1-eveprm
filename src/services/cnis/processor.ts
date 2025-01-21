import { CNISData, Segurado, Vinculo, Empresa, Remuneracao } from './types';

export class CNISProcessor {
  private static readonly REGEX = {
    // Updated to handle the actual CNIS format with more flexible whitespace
    SEGURADO: /NIT:\s*([\d\.-]+)\s*CPF:\s*([\d\.-]+)\s*Nome:\s*([^\n]+?)(?:\s+Data de nascimento:\s*(\d{2}\/\d{2}\/\d{4})\s*Nome da mãe:\s*([^\n]+)|$)/i,
    
    // Updated to be more flexible with line breaks and spacing
    VINCULO: /(?:Seq\.|Sequencial)\s*(\d+)\s*NIT\s*([\d\.-]+)\s*(?:Código\s+Emp\.|CNPJ\/CEI\/CPF)\s*([\d\/\.-]+)\s*(?:Origem do Vínculo|Empregador)\s*([^\n]+?)\s*(?:Tipo\s+(?:Filiado\s+)?(?:no\s+)?Vínculo|Categoria)\s*([^\n]+?)\s*Data\s+(?:de\s+)?Início\s*(\d{2}\/\d{2}\/\d{4})\s*(?:Data\s+(?:de\s+)?Fim\s*(\d{2}\/\d{2}\/\d{4}))?\s*/gi,
    
    // Updated to handle various formats of remuneration entries
    REMUNERACAO: /(?:^|\s)(\d{2}\/\d{4})\s+([\d\.,]+)(?:\s+([A-Z0-9]+(?:\s+[A-Z0-9]+)*))?\s*$/gm
  };

  public processar(text: string): CNISData {
    if (!text || typeof text !== 'string') {
      throw new Error('Texto do CNIS inválido ou vazio');
    }

    try {
      // Normalize text to handle different line endings and extra spaces
      const normalizedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\s+/g, ' ')
        .trim();

      const segurado = this.parseSegurado(normalizedText);
      const vinculos = this.parseVinculos(normalizedText);
      
      if (vinculos.length === 0) {
        throw new Error('Nenhum vínculo encontrado no CNIS');
      }

      const periodosTotais = this.calcularPeriodos(vinculos);

      return {
        segurado,
        vinculos,
        beneficios: [],
        periodosTotais
      };
    } catch (error) {
      console.error('Erro ao processar CNIS:', {
        error,
        textLength: text.length,
        textPreview: text.substring(0, 100)
      });
      throw error;
    }
  }

  private parseSegurado(text: string): Segurado {
    const match = text.match(CNISProcessor.REGEX.SEGURADO);
    if (!match) {
      const textPreview = text.substring(0, 200);
      console.error('Falha ao extrair dados do segurado:', { textPreview });
      throw new Error('Não foi possível identificar os dados do segurado no CNIS');
    }

    // Handle optional fields
    const [_, nit, cpf, nome, dataNascimento = '', nomeMae = ''] = match;

    return {
      nit: nit.trim(),
      cpf: cpf.trim(),
      nome: nome.trim(),
      dataNascimento: dataNascimento.trim(),
      nomeMae: nomeMae.trim()
    };
  }

  private parseVinculos(text: string): Vinculo[] {
    const vinculos: Vinculo[] = [];
    let match: RegExpExecArray | null;
    
    // Reset lastIndex before starting
    CNISProcessor.REGEX.VINCULO.lastIndex = 0;
    
    while ((match = CNISProcessor.REGEX.VINCULO.exec(text)) !== null) {
      try {
        const vinculo = this.createVinculo(match);
        
        // Find the text block for this vínculo's remunerações
        const currentPos = match.index + match[0].length;
        const nextMatch = text.slice(currentPos).match(CNISProcessor.REGEX.VINCULO);
        const endPos = nextMatch ? currentPos + nextMatch.index : text.length;
        const remuneracoesText = text.slice(currentPos, endPos);
        
        // Process remunerações
        this.parseRemuneracoes(remuneracoesText, vinculo);
        
        if (vinculo.remuneracoes.length > 0) {
          vinculos.push(vinculo);
        } else {
          console.warn('Vínculo sem remunerações encontrado:', {
            sequencial: vinculo.sequencial,
            empresa: vinculo.empresa.nome
          });
        }
      } catch (error) {
        console.error('Erro ao processar vínculo:', { match, error });
      }
    }

    return vinculos;
  }

  // Rest of the class implementation remains the same...
}