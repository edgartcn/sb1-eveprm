import { supabase } from '../../lib/supabase';
import { CnisAnalysisData } from '../../types/modules/cnis';

function formatCompetenciaToDate(competencia: string): string {
  // Converte formato "MM/YYYY" para "YYYY-MM-DD"
  const [month, year] = competencia.split('/');
  return `${year}-${month.padStart(2, '0')}-01`;
}

export async function saveCnisAnalysis(clientId: string, data: CnisAnalysisData) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error('Usuário não autenticado');

  // Criar análise
  const { data: analysis, error: analysisError } = await supabase
    .from('cnis_analysis')
    .insert({
      client_id: clientId,
      user_id: user.data.user.id,
      total_contribution_time: data.summary.totalMonths,
      validated_contribution_time: data.summary.regularMonths,
      pending_contribution_time: data.summary.pendingMonths,
      total_special_time: 0,
      total_rural_time: 0,
      carencia_met: data.summary.regularMonths >= 180,
      status: 'em_analise',
      observations: []
    })
    .select()
    .single();

  if (analysisError) throw analysisError;

  // Inserir vínculos empregatícios
  const employmentBonds = data.contributions.reduce((bonds: any[], contribution) => {
    const existingBond = bonds.find(b => b.employer_name === contribution.empresa);
    if (!existingBond) {
      bonds.push({
        analysis_id: analysis.id,
        employer_name: contribution.empresa,
        employer_cnpj: contribution.cnpj,
        employer_type: 'empresa',
        start_date: formatCompetenciaToDate(contribution.competencia),
        status: 'ativo'
      });
    }
    return bonds;
  }, []);

  if (employmentBonds.length > 0) {
    const { error: bondsError } = await supabase
      .from('cnis_employment_bonds')
      .insert(employmentBonds);

    if (bondsError) throw bondsError;
  }

  // Inserir contribuições
  const formattedContributions = data.contributions.map(contribution => ({
    analysis_id: analysis.id,
    competence: formatCompetenciaToDate(contribution.competencia),
    contribution_value: contribution.remuneracao,
    contribution_type: 'normal',
    status: contribution.status
  }));

  if (formattedContributions.length > 0) {
    const { error: contributionsError } = await supabase
      .from('cnis_contributions')
      .insert(formattedContributions);

    if (contributionsError) throw contributionsError;
  }

  return analysis;
}