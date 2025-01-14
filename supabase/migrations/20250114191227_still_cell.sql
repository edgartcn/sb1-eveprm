/*
  # Schema for Petition Generation Module

  1. New Tables
    - `petition_templates`
      - Base templates for different types of petitions
      - Contains structure, variables, and requirements
    - `petitions`
      - Generated petitions for clients
      - Stores content, status, and metadata
    - `petition_attachments`
      - Documents attached to petitions
      - Links to relevant evidence and supporting documents

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to manage their petitions
*/

-- Petition Templates table
CREATE TABLE IF NOT EXISTS petition_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('aposentadoria', 'auxilio', 'pensao', 'outros')),
  structure jsonb NOT NULL, -- Contains sections and variables
  requirements text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Petitions table
CREATE TABLE IF NOT EXISTS petitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  template_id uuid REFERENCES petition_templates(id),
  title text NOT NULL,
  content text NOT NULL,
  variables jsonb DEFAULT '{}',
  status text NOT NULL CHECK (status IN ('rascunho', 'concluida', 'protocolada')),
  protocol_number text,
  protocol_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb, -- Additional metadata like benefit type, dates, etc.
  version integer DEFAULT 1
);

-- Petition Attachments table
CREATE TABLE IF NOT EXISTS petition_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  petition_id uuid REFERENCES petitions(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  file_type text NOT NULL,
  file_path text NOT NULL,
  size_bytes bigint,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE petition_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE petitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE petition_attachments ENABLE ROW LEVEL SECURITY;

-- Policies for petition_templates
CREATE POLICY "Users can read active templates"
  ON petition_templates
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Policies for petitions
CREATE POLICY "Users can manage their own petitions"
  ON petitions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for petition_attachments
CREATE POLICY "Users can manage attachments through petitions"
  ON petition_attachments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM petitions
      WHERE petitions.id = petition_attachments.petition_id
      AND petitions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM petitions
      WHERE petitions.id = petition_attachments.petition_id
      AND petitions.user_id = auth.uid()
    )
  );

-- Create updated_at triggers for all tables
CREATE TRIGGER petition_templates_updated_at
  BEFORE UPDATE ON petition_templates
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER petitions_updated_at
  BEFORE UPDATE ON petitions
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER petition_attachments_updated_at
  BEFORE UPDATE ON petition_attachments
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert some initial petition templates
INSERT INTO petition_templates (name, description, category, structure, requirements) VALUES
(
  'Aposentadoria por Tempo de Contribuição',
  'Template para petição inicial de aposentadoria por tempo de contribuição',
  'aposentadoria',
  '{
    "sections": [
      {
        "id": "qualificacao",
        "title": "Da Qualificação",
        "content": "O(a) Requerente, {nome}, {nacionalidade}, {estado_civil}, portador(a) do RG nº {rg} e CPF nº {cpf}, residente e domiciliado(a) em {endereco}, vem respeitosamente à presença de Vossa Excelência...",
        "order": 1,
        "isRequired": true
      },
      {
        "id": "fatos",
        "title": "Dos Fatos",
        "content": "O(a) Requerente completou o tempo de contribuição necessário para a concessão do benefício, tendo contribuído por {tempo_contribuicao} anos...",
        "order": 2,
        "isRequired": true
      }
    ],
    "variables": [
      {
        "id": "nome",
        "name": "Nome Completo",
        "type": "text",
        "required": true
      },
      {
        "id": "tempo_contribuicao",
        "name": "Tempo de Contribuição",
        "type": "number",
        "required": true
      }
    ]
  }'::jsonb,
  ARRAY['CNIS', 'Documentos Pessoais', 'Comprovante de Residência']
),
(
  'Auxílio-Doença',
  'Template para petição inicial de auxílio-doença',
  'auxilio',
  '{
    "sections": [
      {
        "id": "qualificacao",
        "title": "Da Qualificação",
        "content": "O(a) Requerente, {nome}, {nacionalidade}, {estado_civil}, portador(a) do RG nº {rg} e CPF nº {cpf}, residente e domiciliado(a) em {endereco}, vem respeitosamente à presença de Vossa Excelência...",
        "order": 1,
        "isRequired": true
      },
      {
        "id": "doenca",
        "title": "Da Incapacidade",
        "content": "O(a) Requerente encontra-se incapacitado(a) para o trabalho desde {data_inicio_incapacidade} em razão de {diagnostico}...",
        "order": 2,
        "isRequired": true
      }
    ],
    "variables": [
      {
        "id": "nome",
        "name": "Nome Completo",
        "type": "text",
        "required": true
      },
      {
        "id": "data_inicio_incapacidade",
        "name": "Data Início da Incapacidade",
        "type": "date",
        "required": true
      }
    ]
  }'::jsonb,
  ARRAY['Laudos Médicos', 'CNIS', 'Documentos Pessoais']
);