export interface Veterinary {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  latitude: number;
  longitude: number;
  is_emergency: boolean;
  is_24_7: boolean;
  description: string | null;
}
