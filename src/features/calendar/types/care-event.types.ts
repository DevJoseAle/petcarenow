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
  reminder_at?: string | null;
}
