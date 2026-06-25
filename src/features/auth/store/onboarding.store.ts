import { create } from 'zustand';
import {
  getOnboardedValue,
  setOnboardedValue,
} from '../services/onboarding.service';

interface OnboardingState {
  isOnboarded: boolean;
  isHydrating: boolean;
  hasHydrated: boolean;
  hydrateOnboarding: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useOnboardingStore =
  create<OnboardingState>((set, get) => ({
    isOnboarded: false,
    isHydrating: false,
    hasHydrated: false,
    hydrateOnboarding: async () => {
      if (get().hasHydrated || get().isHydrating === true) {
        return;
      }

      set({
        isHydrating: true,
      });

      const isOnboarded =
        await getOnboardedValue();

      set({
        isOnboarded,
        isHydrating: false,
        hasHydrated: true,
      });
    },
    completeOnboarding: async () => {
      await setOnboardedValue(true);

      set({
        isOnboarded: true,
        isHydrating: false,
        hasHydrated: true,
      });
    },
  }));
