export interface Client {
  id: string;
  user_id: string;
  name: string;
  cpf?: string;
  rg?: string;
  birth_date?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}