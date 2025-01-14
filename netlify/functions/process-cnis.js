const processCNIS = (cnis_text) => {
  const CNISData = {
    segurado: {},
    vinculos: [],
    beneficios: [],
    periodosTotais: {}
  };

  // Extrai dados do segurado
  const regex_segurado = /NIT:\s*(\d+[\.-]\d+[\.-]\d+[-\d]*)\s*CPF:\s*(\d+[\.-]\d+[\.-]\d+[-\d]*)\s*Nome:\s*([^\n]+)\s*Data de nascimento:\s*(\d{2}\/\d{2}\/\d{4})\s*Nome da mãe:\s*([^\n]+)/;
  const match_segurado = cnis_text.match(regex_segurado);
  
  if (match_segurado) {
    CNISData.segurado = {
      nit: match_segurado[1],
      cpf: match_segurado[2],
      nome: match_segurado[3].trim(),
      dataNascimento: match_segurado[4],
      nomeMae: match_segurado[5].trim()
    };
  }

  // Extrai vínculos e contribuições
  const regex_vinculo = /Empregador:\s*([^\n]+)\s*CNPJ:\s*(\d+[\.-]\d+[\.-]\d+[-\d]*)\s*Data de início:\s*(\d{2}\/\d{2}\/\d{4})\s*Data de fim:\s*(\d{2}\/\d{2}\/\d{4}|Em Aberto)/g;
  let match_vinculo;
  
  while ((match_vinculo = regex_vinculo.exec(cnis_text)) !== null) {
    CNISData.vinculos.push({
      empregador: match_vinculo[1].trim(),
      cnpj: match_vinculo[2],
      dataInicio: match_vinculo[3],
      dataFim: match_vinculo[4]
    });
  }

  // Extrai contribuições
  const regex_contribuicao = /(\d{2}\/\d{4})\s+([^\n]+)\s+R\$\s*([\d\.,]+)/g;
  let match_contribuicao;
  
  while ((match_contribuicao = regex_contribuicao.exec(cnis_text)) !== null) {
    CNISData.contribuicoes.push({
      competencia: match_contribuicao[1],
      empregador: match_contribuicao[2].trim(),
      valor: parseFloat(match_contribuicao[3].replace('.', '').replace(',', '.'))
    });
  }

  // Calcula períodos totais
  const totalContribuicoes = CNISData.contribuicoes.length;
  const valorTotal = CNISData.contribuicoes.reduce((sum, c) => sum + c.valor, 0);

  CNISData.periodosTotais = {
    totalMeses: totalContribuicoes,
    mesesRegulares: totalContribuicoes, // Assumindo todos regulares inicialmente
    mesesPendentes: 0,
    valorTotal: valorTotal,
    mediaContribuicoes: valorTotal / totalContribuicoes
  };

  return CNISData;
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { cnis_text } = JSON.parse(event.body);
    
    if (!cnis_text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'CNIS text is required' })
      };
    }

    const result = processCNIS(cnis_text);
    
    // Converte para o formato esperado pela interface
    const formattedResult = {
      clientId: '',
      contributions: result.contribuicoes.map(c => ({
        competencia: c.competencia,
        empresa: c.empregador,
        cnpj: '',
        tipo: 'normal',
        remuneracao: c.valor,
        status: 'regular'
      })),
      summary: {
        totalMonths: result.periodosTotais.totalMeses,
        regularMonths: result.periodosTotais.mesesRegulares,
        irregularMonths: 0,
        pendingMonths: result.periodosTotais.mesesPendentes,
        totalContributions: result.periodosTotais.valorTotal,
        averageContribution: result.periodosTotais.mediaContribuicoes
      },
      specialPeriods: [],
      ruralPeriods: [],
      lastUpdate: new Date().toISOString()
    };
    
    return {
      statusCode: 200,
      body: JSON.stringify(formattedResult)
    };
  } catch (error) {
    console.error('Error processing CNIS:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error processing CNIS',
        error: error.message 
      })
    };
  }
}