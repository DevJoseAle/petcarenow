export interface Veterinary {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  email: string | null;
  website_url: string | null;
  whatsapp_phone: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  photo_url: string | null;
  logo_url: string | null;
  cover_url: string | null;
  latitude: number;
  longitude: number;
  is_emergency: boolean;
  is_24_7: boolean;
  description: string | null;
  years_experience: number | null;
  mission: string | null;
  values: string | null;
  languages: string[] | null;
  parking_available: boolean;
  accessibility_features: string | null;
  accepts_insurance: boolean;
  payment_methods: string[] | null;
  offers_home_visit: boolean;
  home_visit_notes: string | null;
}

export interface VeterinaryFilters {
  onlyEmergency: boolean;
  only24Hours: boolean;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface MapRegion
  extends LocationCoordinates {
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface VeterinaryWithDistance
  extends Veterinary {
  distanceKm: number | null;
}

export interface VeterinaryServiceCategory {
  code: string;
  label: string;
  description: string | null;
  sort_order: number;
}

export interface VeterinaryServiceItem {
  id: string;
  veterinary_id: string;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  price_amount: number | null;
  currency: string | null;
  image_url: string | null;
  category_code: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  category?: VeterinaryServiceCategory | null;
}

export interface VeterinaryStaffMember {
  id: string;
  veterinary_id: string;
  photo_url: string | null;
  full_name: string;
  specialty: string | null;
  university: string | null;
  years_experience: number | null;
  bio: string | null;
  languages: string[] | null;
  schedule_notes: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VeterinaryHourBlock {
  id: string;
  veterinary_id: string;
  hour_type:
    | 'general'
    | 'emergency'
    | 'holiday'
    | 'closed_day'
    | 'home_visit';
  day_of_week: number | null;
  opens_at: string | null;
  closes_at: string | null;
  notes: string | null;
  is_24_hours: boolean;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
}

export interface VeterinaryRichProfile {
  veterinary: Veterinary;
  services: VeterinaryServiceItem[];
  serviceCategories: VeterinaryServiceCategory[];
  staff: VeterinaryStaffMember[];
  hours: VeterinaryHourBlock[];
}
