/*
  # Schema for CNIS Analysis Module

  1. New Tables
    - `cnis_analysis`
      - Main analysis table linking to client
      - Stores summary data and status
    - `cnis_contributions`
      - Individual contribution records
      - Monthly contributions with status and details
    - `cnis_employment_bonds`
      - Employment relationships
      - Details about employers and positions
    - `cnis_special_periods`
      - Special contribution periods
      - Hazardous or special conditions

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to manage their analyses
*/

-- CNIS Analysis table
CREATE TABLE IF NOT EXISTS cnis_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  total_contribution_time integer NOT NULL, -- in months
  validated_contribution_time integer NOT NULL,
  pending_contribution_time integer NOT NULL,
  total_special_time integer NOT NULL DEFAULT 0,
  total_rural_time integer NOT NULL DEFAULT 0,
  carencia_met boolean DEFAULT false,
  eligible_benefits text[],
  status text NOT NULL CHECK (status IN ('em_analise', 'concluida', 'revisao_necessaria')),
  observations text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CNIS Employment Bonds table
CREATE TABLE IF NOT EXISTS cnis_employment_bonds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES cnis_analysis(id) ON DELETE CASCADE NOT NULL,
  employer_name text NOT NULL,
  employer_cnpj text,
  employer_type text NOT NULL CHECK (employer_type IN ('empresa', 'domestico', 'rural', 'autonomo', 'outro')),
  position text,
  cbo_code text,
  start_date date NOT NULL,
  end_date date,
  status text NOT NULL CHECK (status IN ('ativo', 'encerrado', 'pendente')),
  observations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CNIS Contributions table
CREATE TABLE IF NOT EXISTS cnis_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES cnis_analysis(id) ON DELETE CASCADE NOT NULL,
  employment_bond_id uuid REFERENCES cnis_employment_bonds(id),
  competence date NOT NULL,
  contribution_value numeric(10,2) NOT NULL,
  contribution_type text NOT NULL CHECK (contribution_type IN ('normal', 'complementar', '13_salario')),
  status text NOT NULL CHECK (status IN ('regular', 'pendente', 'irregular')),
  indicators text[], -- '13º', 'Férias', etc.
  observations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CNIS Special Periods table
CREATE TABLE IF NOT EXISTS cnis_special_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES cnis_analysis(id) ON DELETE CASCADE NOT NULL,
  employment_bond_id uuid REFERENCES cnis_employment_bonds(id) NOT NULL,
  start_date date NOT NULL,
  end_date date,
  factor numeric(3,2) NOT NULL, -- 1.2, 1.4, etc.
  agent_type text NOT NULL CHECK (agent_type IN ('ruido', 'quimico', 'biologico', 'outro')),
  agent_description text,
  ppp_available boolean DEFAULT false,
  ltcat_available boolean DEFAULT false,
  status text NOT NULL CHECK (status IN ('pendente', 'validado', 'rejeitado')),
  observations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cnis_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE cnis_employment_bonds ENABLE ROW LEVEL SECURITY;
ALTER TABLE cnis_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cnis_special_periods ENABLE ROW LEVEL SECURITY;

-- Policies for cnis_analysis
CREATE POLICY "Users can manage their own CNIS analysis"
  ON cnis_analysis
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for cnis_employment_bonds
CREATE POLICY "Users can manage bonds through CNIS analysis"
  ON cnis_employment_bonds
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cnis_analysis
      WHERE cnis_analysis.id = cnis_employment_bonds.analysis_id
      AND cnis_analysis.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cnis_analysis
      WHERE cnis_analysis.id = cnis_employment_bonds.analysis_id
      AND cnis_analysis.user_id = auth.uid()
    )
  );

-- Policies for cnis_contributions
CREATE POLICY "Users can manage contributions through CNIS analysis"
  ON cnis_contributions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cnis_analysis
      WHERE cnis_analysis.id = cnis_contributions.analysis_id
      AND cnis_analysis.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cnis_analysis
      WHERE cnis_analysis.id = cnis_contributions.analysis_id
      AND cnis_analysis.user_id = auth.uid()
    )
  );

-- Policies for cnis_special_periods
CREATE POLICY "Users can manage special periods through CNIS analysis"
  ON cnis_special_periods
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cnis_analysis
      WHERE cnis_analysis.id = cnis_special_periods.analysis_id
      AND cnis_analysis.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cnis_analysis
      WHERE cnis_analysis.id = cnis_special_periods.analysis_id
      AND cnis_analysis.user_id = auth.uid()
    )
  );

-- Create updated_at triggers for all tables
CREATE TRIGGER cnis_analysis_updated_at
  BEFORE UPDATE ON cnis_analysis
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER cnis_employment_bonds_updated_at
  BEFORE UPDATE ON cnis_employment_bonds
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER cnis_contributions_updated_at
  BEFORE UPDATE ON cnis_contributions
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER cnis_special_periods_updated_at
  BEFORE UPDATE ON cnis_special_periods
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_cnis_analysis_client_id ON cnis_analysis(client_id);
CREATE INDEX idx_cnis_contributions_competence ON cnis_contributions(competence);
CREATE INDEX idx_cnis_employment_bonds_dates ON cnis_employment_bonds(start_date, end_date);
CREATE INDEX idx_cnis_special_periods_dates ON cnis_special_periods(start_date, end_date);