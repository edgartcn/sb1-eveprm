import { useState, useEffect } from 'react';
import { useClient } from '../contexts/ClientContext';
import { supabase } from '../lib/supabase';
import { RuralAnalysisData, RuralWorkPeriod, RuralDocument, RuralWitness } from '../types/modules/rural';

export function useRuralAnalysis() {
  const { selectedClient } = useClient();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<RuralAnalysisData | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedClient) {
      loadAnalysisData();
    } else {
      setAnalysisData(null);
      setAnalysisId(null);
    }
  }, [selectedClient]);

  const loadAnalysisData = async () => {
    if (!selectedClient) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get the most recent analysis or create a new one
      const { data: existingAnalyses, error: analysisError } = await supabase
        .from('rural_analysis')
        .select('*')
        .eq('client_id', selectedClient.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (analysisError) throw analysisError;

      let analysis = existingAnalyses?.[0];

      if (!analysis) {
        // Create new analysis
        const { data: newAnalysis, error: createError } = await supabase
          .from('rural_analysis')
          .insert({
            client_id: selectedClient.id,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            status: 'em_analise',
            age_requirement_met: false,
            rural_time_requirement_met: false,
            documents_requirement_met: false,
            witnesses_requirement_met: false,
            observations: []
          })
          .select()
          .single();

        if (createError) throw createError;
        analysis = newAnalysis;
      }

      setAnalysisId(analysis.id);

      // Load work periods
      const { data: workPeriods, error: periodsError } = await supabase
        .from('rural_work_periods')
        .select('*')
        .eq('analysis_id', analysis.id)
        .order('start_date', { ascending: true });

      if (periodsError) throw periodsError;

      // Load documents
      const { data: documents, error: documentsError } = await supabase
        .from('rural_documents')
        .select('*')
        .eq('analysis_id', analysis.id)
        .order('issue_date', { ascending: false });

      if (documentsError) throw documentsError;

      // Load witnesses
      const { data: witnesses, error: witnessesError } = await supabase
        .from('rural_witnesses')
        .select('*')
        .eq('analysis_id', analysis.id);

      if (witnessesError) throw witnessesError;

      // Calculate requirements
      const requirements = calculateRequirements(selectedClient, workPeriods || [], documents || [], witnesses || []);

      setAnalysisData({
        clientId: selectedClient.id,
        workPeriods: workPeriods || [],
        documents: documents || [],
        witnesses: witnesses || [],
        requirements,
        status: analysis.status,
        observations: analysis.observations || [],
        lastUpdate: analysis.updated_at
      });

    } catch (err) {
      console.error('Error loading rural analysis:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados da análise rural');
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the code remains the same...
  const addWorkPeriod = async (period: Omit<RuralWorkPeriod, 'id'>) => {
    if (!selectedClient || !analysisId) return;

    try {
      const { data, error } = await supabase
        .from('rural_work_periods')
        .insert({
          analysis_id: analysisId,
          ...period
        })
        .select()
        .single();

      if (error) throw error;

      await loadAnalysisData();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar período');
      throw err;
    }
  };

  const addDocument = async (document: Omit<RuralDocument, 'id'>) => {
    if (!selectedClient || !analysisId) return;

    try {
      const { data, error } = await supabase
        .from('rural_documents')
        .insert({
          analysis_id: analysisId,
          ...document
        })
        .select()
        .single();

      if (error) throw error;

      await loadAnalysisData();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar documento');
      throw err;
    }
  };

  const addWitness = async (witness: Omit<RuralWitness, 'id'>) => {
    if (!selectedClient || !analysisId) return;

    try {
      const { data, error } = await supabase
        .from('rural_witnesses')
        .insert({
          analysis_id: analysisId,
          ...witness
        })
        .select()
        .single();

      if (error) throw error;

      await loadAnalysisData();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar testemunha');
      throw err;
    }
  };

  const updateAnalysisStatus = async (status: RuralAnalysisData['status']) => {
    if (!selectedClient || !analysisId) return;

    try {
      const { error } = await supabase
        .from('rural_analysis')
        .update({ status })
        .eq('id', analysisId);

      if (error) throw error;

      await loadAnalysisData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      throw err;
    }
  };

  return {
    isLoading,
    error,
    analysisData,
    addWorkPeriod,
    addDocument,
    addWitness,
    updateAnalysisStatus,
    refreshData: loadAnalysisData
  };
}

function calculateRequirements(
  client: any,
  workPeriods: any[],
  documents: any[],
  witnesses: any[]
): RuralAnalysisData['requirements'] {
  // Calculate age based on client's birth date
  const birthDate = client.birth_date ? new Date(client.birth_date) : new Date();
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  // Calculate total rural work time
  const totalMonths = workPeriods.reduce((total, period) => {
    const start = new Date(period.start_date);
    const end = period.end_date ? new Date(period.end_date) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                  (end.getMonth() - start.getMonth());
    return total + (period.status === 'validado' ? months : 0);
  }, 0);

  // Validate documents
  const validDocuments = documents.filter(doc => doc.status === 'validado').length;

  // Validate witnesses
  const validWitnesses = witnesses.filter(w => w.validation_status === 'validado').length;

  return {
    age: {
      required: 60,
      current: age
    },
    ruralWork: {
      required: 180, // 15 years in months
      current: totalMonths
    },
    documents: {
      required: 3,
      current: validDocuments
    },
    witnesses: {
      required: 2,
      current: validWitnesses
    }
  };
}