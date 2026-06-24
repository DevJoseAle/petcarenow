import { create } from 'zustand';
import {
  getOnboardedValue,
  setOnboardedValue,
} from '../services/onboarding.service';

interface OnboardingState {
  isOnboarded: boolean;
  isHydrating: boolean;
  hydrateOnboarding: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useOnboardingStore =
  create<OnboardingState>((set) => ({
    isOnboarded: false,
    isHydrating: true,
    hydrateOnboarding: async () => {
      const isOnboarded =
        await getOnboardedValue();

      set({
        isOnboarded,
        isHydrating: false,
      });
    },
    completeOnboarding: async () => {
      await setOnboardedValue(true);

      set({
        isOnboarded: true,
        isHydrating: false,
      });
    },
  }));
