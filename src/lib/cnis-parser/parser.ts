import { CNISData, Vinculo } from './types';

export class CNISProcessor {
  // ... outros métodos permanecem iguais ...

  private static parseRemuneracao(text: string, vinculo: Vinculo): void {
    // Atualizado regex para capturar formato MM/YYYY
    const regex_remuneracao = /(\d{2}\/\d{4})\s*([\d\.,]+)(?:\s*([\w-]+))?\s*/g;
    let match: RegExpExecArray | null;

    while ((match = regex_remuneracao.exec(text)) !== null) {
      const [month, year] = match[1].split('/');
      vinculo.remuneracoes.push({
        competencia: `${month}/${year}`, // Mantém o formato MM/YYYY
        valor: parseFloat(match[2].replace('.', '').replace(',', '.')),
        indicadores: match[3] ? [match[3]] : []
      });
    }
  }

  private static calcularPeriodos(vinculos: Vinculo[]): PeriodosTotais {
    let tempoTotal = 0;
    const competencias = new Set<string>();

    vinculos.forEach(vinculo => {
      // Converte datas no formato DD/MM/YYYY para Date
      const [dia, mes, ano] = vinculo.dataInicio.split('/');
      const inicio = new Date(Number(ano), Number(mes) - 1, Number(dia));
      
      let fim: Date;
      if (vinculo.dataFim) {
        const [diaFim, mesFim, anoFim] = vinculo.dataFim.split('/');
        fim = new Date(Number(anoFim), Number(mesFim) - 1, Number(diaFim));
      } else {
        fim = new Date();
      }
      
      tempoTotal += Math.floor((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 30));
      
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

  // ... resto do código permanece igual ...
}