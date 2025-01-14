/*
  # Schema for Rural Retirement Analysis

  1. New Tables
    - `rural_analysis`
      - Main table for rural retirement analysis
      - Links to client and contains overall status
    - `rural_work_periods`
      - Records of rural work periods
      - Each period has location, activity type, and status
    - `rural_documents`
      - Supporting documents for rural work proof
      - Tracks document type, validity, and status
    - `rural_witnesses`
      - Witness information and statements
      - Contains contact info and relationship to client

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to manage their clients' data
*/

-- Rural Analysis table
CREATE TABLE IF NOT EXISTS rural_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  status text NOT NULL CHECK (status IN ('em_analise', 'elegivel', 'nao_elegivel')),
  age_requirement_met boolean DEFAULT false,
  rural_time_requirement_met boolean DEFAULT false,
  documents_requirement_met boolean DEFAULT false,
  witnesses_requirement_met boolean DEFAULT false,
  observations text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rural Work Periods table
CREATE TABLE IF NOT EXISTS rural_work_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES rural_analysis(id) ON DELETE CASCADE NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  property_name text NOT NULL,
  property_location text NOT NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('agricultura', 'pecuaria', 'pesca', 'extrativismo')),
  regime text NOT NULL CHECK (regime IN ('individual', 'economia_familiar', 'parceria', 'arrendamento')),
  document_type text,
  document_number text,
  status text NOT NULL CHECK (status IN ('pendente', 'validado', 'rejeitado')),
  observations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rural Documents table
CREATE TABLE IF NOT EXISTS rural_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES rural_analysis(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL,
  document_number text,
  issue_date date NOT NULL,
  validity_date date,
  issuing_body text NOT NULL,
  status text NOT NULL CHECK (status IN ('pendente', 'validado', 'rejeitado')),
  observations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rural Witnesses table
CREATE TABLE IF NOT EXISTS rural_witnesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES rural_analysis(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  cpf text NOT NULL,
  relationship text NOT NULL,
  contact text NOT NULL,
  address text NOT NULL,
  statement text,
  validation_status text NOT NULL CHECK (validation_status IN ('pendente', 'validado', 'rejeitado')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE rural_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE rural_work_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE rural_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE rural_witnesses ENABLE ROW LEVEL SECURITY;

-- Policies for rural_analysis
CREATE POLICY "Users can manage their own rural analysis"
  ON rural_analysis
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for rural_work_periods
CREATE POLICY "Users can manage work periods through rural analysis"
  ON rural_work_periods
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rural_analysis
      WHERE rural_analysis.id = rural_work_periods.analysis_id
      AND rural_analysis.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rural_analysis
      WHERE rural_analysis.id = rural_work_periods.analysis_id
      AND rural_analysis.user_id = auth.uid()
    )
  );

-- Policies for rural_documents
CREATE POLICY "Users can manage documents through rural analysis"
  ON rural_documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rural_analysis
      WHERE rural_analysis.id = rural_documents.analysis_id
      AND rural_analysis.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rural_analysis
      WHERE rural_analysis.id = rural_documents.analysis_id
      AND rural_analysis.user_id = auth.uid()
    )
  );

-- Policies for rural_witnesses
CREATE POLICY "Users can manage witnesses through rural analysis"
  ON rural_witnesses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rural_analysis
      WHERE rural_analysis.id = rural_witnesses.analysis_id
      AND rural_analysis.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rural_analysis
      WHERE rural_analysis.id = rural_witnesses.analysis_id
      AND rural_analysis.user_id = auth.uid()
    )
  );

-- Create updated_at triggers for all tables
CREATE TRIGGER rural_analysis_updated_at
  BEFORE UPDATE ON rural_analysis
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER rural_work_periods_updated_at
  BEFORE UPDATE ON rural_work_periods
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER rural_documents_updated_at
  BEFORE UPDATE ON rural_documents
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER rural_witnesses_updated_at
  BEFORE UPDATE ON rural_witnesses
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();