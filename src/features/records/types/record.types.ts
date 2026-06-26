export type PetRecordType =
  | 'weight'
  | 'symptom'
  | 'medication'
  | 'note';

export interface PetRecord {
  id: string;
  pet_id: string;
  owner_id: string;
  record_type: PetRecordType;
  recorded_at: string;
  description: string;
  value_numeric: number | null;
  value_unit: string | null;
  metadata: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePetRecordInput {
  pet_id: string;
  owner_id: string;
  record_type: PetRecordType;
  recorded_at: string;
  description: string;
  value_numeric?: number | null;
  value_unit?: string | null;
  metadata?: Record<string, string> | null;
}

export interface UpdatePetRecordInput {
  record_type?: PetRecordType;
  recorded_at?: string;
  description?: string;
  value_numeric?: number | null;
  value_unit?: string | null;
  metadata?: Record<string, string> | null;
}
