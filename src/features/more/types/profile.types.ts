export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  country: string | null;
  language: string | null;
  onboarding_completed: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UpdateUserProfileInput {
  full_name: string | null;
  country: string | null;
  language: string | null;
}
