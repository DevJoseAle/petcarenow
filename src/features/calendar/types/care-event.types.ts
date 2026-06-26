export type CareEventType =
  | 'medication'
  | 'consultation'
  | 'deworming'
  | 'vaccine'
  | 'custom';

export type CareEventStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled';

export interface CareEventMetadata {
  vaccine_name?: string;
  dose?: string;
  applied_at?: string;
  next_due_at?: string;
  clinic_name?: string;
  doctor_name?: string;
  reason?: string;
  notes?: string;
}

export interface CareEvent {
  id: string;
  pet_id: string;
  owner_id: string;
  event_type: CareEventType;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  status: CareEventStatus;
  reminder_at: string | null;
  metadata: CareEventMetadata | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCareEventInput {
  pet_id: string;
  owner_id: string;
  event_type: CareEventType;
  title: string;
  description?: string | null;
  starts_at: string;
  ends_at?: string | null;
  status?: CareEventStatus;
  reminder_at?: string | null;
  metadata?: CareEventMetadata | null;
}

export interface UpdateCareEventInput {
  event_type?: CareEventType;
  title?: string;
  description?: string | null;
  starts_at?: string;
  ends_at?: string | null;
  status?: CareEventStatus;
  reminder_at?: string | null;
  metadata?: CareEventMetadata | null;
}
