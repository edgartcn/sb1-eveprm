import { CNISData, Segurado, Vinculo, Empresa, Remuneracao } from './types';

export class CNISProcessor {
  private static readonly REGEX = {
    SEGURADO: /NIT:\s*(\d+[\.-]\d+[\.-]\d+[-\d]*)\s*CPF:\s*(\d+[\.-]\d+[\.-]\d+[-\d]*)\s*Nome:\s*([^\n]+)\s*Data de nascimento:\s*(\d{2}\/\d{2}\/\d{4})\s*Nome da mãe:\s*([^\n]+)/,
    VINCULO: /Seq\.\s*(\d+)\s*NIT\s*([\d\.-]+)\s*Código Emp\.\s*([\d\/\.-]+)\s*Origem do Vínculo\s*([^\n]+)\s*.*?Tipo Filiado no\s*Vínculo\s*([^\n]+)\s*Data Inicio\s*(\d{2}\/\d{2}\/\d{4})\s*(?:Data Fim\s*(\d{2}\/\d{2}\/\d{4}))?\s*/g,
    REMUNERACAO: /(\d{2}\/\d{4})\s+([\d\.,]+)(?:\s+(\w+))?\s*\n?/g
  };

  public processar(text: string): CNISData {
    const segurado = this.parseSegurado(text);
    const vinculos = this.parseVinculos(text);
    const periodosTotais = this.calcularPeriodos(vinculos);

    return {
      segurado,
      vinculos,
      beneficios: [],
      periodosTotais
    };
  }

  private parseSegurado(text: string): Segurado {
    const match = text.match(CNISProcessor.REGEX.SEGURADO);
    if (!match) {
      throw new Error('Não foi possível extrair os dados do segurado');
    }

    return {
      nit: match[1],
      cpf: match[2],
      nome: match[3].trim(),
      dataNascimento: match[4],
      nomeMae: match[5].trim()
    };
  }

  private parseVinculos(text: string): Vinculo[] {
    const vinculos: Vinculo[] = [];
    let match: RegExpExecArray | null;
    
    CNISProcessor.REGEX.VINCULO.lastIndex = 0;
    while ((match = CNISProcessor.REGEX.VINCULO.exec(text)) !== null) {
      const vinculo = this.createVinculo(match);
      
      // Encontra o próximo vínculo ou o final do texto
      const currentIndex = CNISProcessor.REGEX.VINCULO.lastIndex;
      CNISProcessor.REGEX.VINCULO.lastIndex = match.index + match[0].length;
      const nextMatch = CNISProcessor.REGEX.VINCULO.exec(text);
      
      // Extrai o texto entre o vínculo atual e o próximo
      const endIndex = nextMatch ? nextMatch.index : text.length;
      const textoRemuneracoes = text.slice(currentIndex, endIndex);
      
      // Processa as remunerações
      this.parseRemuneracoes(textoRemuneracoes, vinculo);
      
      vinculos.push(vinculo);
      
      if (nextMatch) {
        CNISProcessor.REGEX.VINCULO.lastIndex = nextMatch.index;
      }
    }

    return vinculos;
  }

  private createVinculo(match: RegExpMatchArray): Vinculo {
    const empresa: Empresa = {
      codigo: match[3],
      nome: match[4].trim(),
      tipo: 'Empregador'
    };

    return {
      sequencial: match[1],
      nit: match[2],
      empresa,
      tipoVinculo: match[5].trim(),
      dataInicio: match[6],
      dataFim: match[7] || undefined,
      indicadores: [],
      remuneracoes: []
    };
  }

  private parseRemuneracoes(text: string, vinculo: Vinculo): void {
    let match: RegExpExecArray | null;
    CNISProcessor.REGEX.REMUNERACAO.lastIndex = 0;
    
    while ((match = CNISProcessor.REGEX.REMUNERACAO.exec(text)) !== null) {
      if (match[1] && match[2]) {
        const remuneracao: Remuneracao = {
          competencia: match[1],
          valor: this.parseValor(match[2]),
          indicadores: match[3] ? [match[3]] : []
        };
        vinculo.remuneracoes.push(remuneracao);
      }
    }
  }

  private parseValor(valor: string): number {
    return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
  }

  private calcularPeriodos(vinculos: Vinculo[]): { tempoContribuicao: number; carencia: number } {
    const competencias = new Set<string>();
    let tempoTotal = 0;

    vinculos.forEach(vinculo => {
      const inicio = this.parseData(vinculo.dataInicio);
      const fim = vinculo.dataFim ? this.parseData(vinculo.dataFim) : new Date();
      
      // Calcula a diferença em meses
      const meses = this.calcularMesesEntreDatas(inicio, fim);
      tempoTotal += meses;
      
      // Adiciona as competências com contribuição
      vinculo.remuneracoes.forEach(rem => {
        if (rem.valor > 0) {
          competencias.add(rem.competencia);
        }
      });
    });

    return {
      tempoContribuicao: tempoTotal,
      carencia: competencias.size
    };
  }

  private parseData(data: string): Date {
    const [dia, mes, ano] = data.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  }

  private calcularMesesEntreDatas(inicio: Date, fim: Date): number {
    const diffAnos = fim.getFullYear() - inicio.getFullYear();
    const diffMeses = fim.getMonth() - inicio.getMonth();
    const diffDias = fim.getDate() - inicio.getDate();
    
    let meses = (diffAnos * 12) + diffMeses;
    
    // Ajusta para incluir o mês se passou do dia inicial ou se está no mesmo dia
    if (diffDias >= 0) {
      meses += 1;
    }
    
    return Math.max(0, meses);
  }
}